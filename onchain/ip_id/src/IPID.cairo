// File: src/IPID.cairo
#[starknet::contract]
pub mod IPID {
    use core::{
        array::ArrayTrait, traits::{Into}, box::BoxTrait, option::OptionTrait,
        starknet::{
            ContractAddress,
            storage::{
                StoragePointerWriteAccess, StoragePointerReadAccess, StorageMapReadAccess,
                StorageMapWriteAccess, Map
            }
        },
    };
    use starknet::{get_caller_address};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::pausable::PausableComponent;
    use openzeppelin::token::erc721::ERC721Component;

    // Import interfaces
    use super::super::interfaces::IIPTokenizerDispatcher;
    use super::super::interfaces::IIPTokenizerDispatcherTrait;

    // Components 
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: PausableComponent, storage: pausable, event: PausableEvent);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);

    // Component implementations
    use OwnableComponent::InternalTrait as OwnableInternalTrait;
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    
    #[abi(embed_v0)]
    impl PausableImpl = PausableComponent::PausableImpl<ContractState>;
    impl PausableInternalImpl = PausableComponent::InternalImpl<ContractState>;
    
    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    // Constants
    const ERROR_ALREADY_REGISTERED: felt252 = 'Already registered';
    const ERROR_NOT_REGISTERED: felt252 = 'Not registered';
    const ERROR_INVALID_METADATA: felt252 = 'Invalid metadata';
    const ERROR_INVALID_IP: felt252 = 'Invalid IP';
    const ERROR_UNAUTHORIZED: felt252 = 'Unauthorized';
    const ERROR_EXPIRED: felt252 = 'Expired IP ID';

    // ID Profile struct
    #[derive(Drop, Serde, starknet::Store, Clone)]
    struct IPProfile {
        // Basic info
        owner: ContractAddress,
        creation_date: u64,
        last_updated: u64,
        
        // IP metadata
        name: ByteArray,
        description: ByteArray,
        metadata_uri: ByteArray,
        metadata_hash: ByteArray,
        
        // Verification and certification
        is_verified: bool,
        certification_level: u8, // 0=None, 1=Basic, 2=Advanced, 3=Premium
        
        // Access control
        access_control_bitmap: u256, // Bitmap for different access levels
        
        // Integration with existing IP system
        linked_token_ids: Array<u256>,
    }

    // Permissions for different features
    #[derive(Drop, Serde, starknet::Store)]
    enum Permission {
        ViewBasic = 0,       // View basic info
        ViewMetadata = 1,    // View detailed metadata
        EditMetadata = 2,    // Edit metadata
        LinkAssets = 3,      // Link to other IP assets
        TransferOwnership = 4, // Transfer ownership
        ProgrammableLicense = 5, // Use programmable licensing features
    }

    #[storage]
    struct Storage {
        // IP ID tracking
        id_counter: u256,
        profiles: Map<u256, IPProfile>,
        user_to_id: Map<ContractAddress, u256>,
        // Integration with existing tokenizer
        tokenizer_contract: ContractAddress,
        // Verification and access control
        verifiers: Map<ContractAddress, bool>,
        feature_access: Map<(u256, u8), bool>, // (id, feature_id) -> has_access
        // Namespace management
        namespaces: Map<ByteArray, u256>, // name -> id
        // Community features
        communities: Map<u256, Array<u256>>, // community_id -> member_ids
        community_counter: u256,
        user_communities: Map<(ContractAddress, u256), bool>, // (user, community_id) -> is_member
        // Access levels and permissions
        global_permissions: Map<u8, Array<u8>>, // level -> [permissions]
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        pausable: PausableComponent::Storage,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        PausableEvent: PausableComponent::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
        IPIDRegistered: IPIDRegistered,
        IPIDUpdated: IPIDUpdated,
        IPAssetLinked: IPAssetLinked,
        VerificationStatusChanged: VerificationStatusChanged,
        CommunityCreated: CommunityCreated,
        CommunityJoined: CommunityJoined,
    }

    // Events
    #[derive(Drop, starknet::Event)]
    struct IPIDRegistered {
        id: u256,
        owner: ContractAddress,
        name: ByteArray,
    }

    #[derive(Drop, starknet::Event)]
    struct IPIDUpdated {
        id: u256,
        field: felt252,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct IPAssetLinked {
        id: u256,
        asset_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct VerificationStatusChanged {
        id: u256,
        is_verified: bool,
        level: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct CommunityCreated {
        community_id: u256,
        creator: ContractAddress,
        name: ByteArray,
    }

    #[derive(Drop, starknet::Event)]
    struct CommunityJoined {
        community_id: u256,
        member_id: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        tokenizer_contract: ContractAddress,
        name: ByteArray,
        symbol: ByteArray,
    ) {
        self.ownable.initializer(owner);
        self.erc721.initializer(name, symbol);
        self.tokenizer_contract.write(tokenizer_contract);
        
        // Initialize permission system
        let mut basic_permissions: Array<u8> = ArrayTrait::new();
        basic_permissions.append(Permission::ViewBasic.into());
        self.global_permissions.write(1, basic_permissions);
        
        let mut standard_permissions: Array<u8> = ArrayTrait::new();
        standard_permissions.append(Permission::ViewBasic.into());
        standard_permissions.append(Permission::ViewMetadata.into());
        self.global_permissions.write(2, standard_permissions);
        
        let mut premium_permissions: Array<u8> = ArrayTrait::new();
        premium_permissions.append(Permission::ViewBasic.into());
        premium_permissions.append(Permission::ViewMetadata.into());
        premium_permissions.append(Permission::ProgrammableLicense.into());
        self.global_permissions.write(3, premium_permissions);
    }

    // Main IPID Implementation
    #[abi(embed_v0)]
    impl IPIDImpl of super::super::interfaces::IIPID<ContractState> {
        // Registration and profile management
        fn register_ip_id(
            ref self: ContractState, 
            name: ByteArray, 
            description: ByteArray, 
            metadata_uri: ByteArray,
            metadata_hash: ByteArray
        ) -> u256 {
            self.pausable.assert_not_paused();
            let caller = get_caller_address();
            
            // Check if user already has an ID
            let existing_id = self.user_to_id.read(caller);
            assert(existing_id == 0, ERROR_ALREADY_REGISTERED);
            
            // Validate metadata
            assert(name.len() > 0, ERROR_INVALID_METADATA);
            assert(metadata_uri.len() > 0, ERROR_INVALID_METADATA);
            
            // Generate new ID
            let id = self.id_counter.read() + 1;
            self.id_counter.write(id);
            
            // Current timestamp
            let now = starknet::get_block_timestamp();
            
            // Create empty array for linked tokens
            let linked_tokens: Array<u256> = ArrayTrait::new();
            
            // Create profile
            let profile = IPProfile {
                owner: caller,
                creation_date: now,
                last_updated: now,
                name,
                description,
                metadata_uri,
                metadata_hash,
                is_verified: false,
                certification_level: 0,
                access_control_bitmap: 0,
                linked_token_ids: linked_tokens,
            };
            
            // Store profile
            self.profiles.write(id, profile);
            self.user_to_id.write(caller, id);
            
            // Register namespace if available
            if self.namespaces.read(name) == 0 {
                self.namespaces.write(name, id);
            }
            
            // Mint ERC721 token to represent ownership
            self.erc721._mint(caller, id);
            
            // Emit event
            self.emit(IPIDRegistered { id, owner: caller, name });
            
            id
        }

        fn update_profile(
            ref self: ContractState,
            id: u256,
            description: ByteArray,
            metadata_uri: ByteArray,
            metadata_hash: ByteArray
        ) {
            self.pausable.assert_not_paused();
            let caller = get_caller_address();
            
            // Get profile
            let mut profile = self.profiles.read(id);
            assert(profile.owner == caller, ERROR_UNAUTHORIZED);
            
            // Update fields
            profile.description = description;
            profile.metadata_uri = metadata_uri;
            profile.metadata_hash = metadata_hash;
            profile.last_updated = starknet::get_block_timestamp();
            
            // Store updated profile
            self.profiles.write(id, profile);
            
            // Emit event
            self.emit(IPIDUpdated { id, field: 'metadata', timestamp: profile.last_updated });
        }

        fn get_profile(self: @ContractState, id: u256) -> IPProfile {
            let profile = self.profiles.read(id);
            assert(profile.owner != starknet::contract_address_const::<0>(), ERROR_NOT_REGISTERED);
            profile
        }

        fn get_id_by_owner(self: @ContractState, owner: ContractAddress) -> u256 {
            let id = self.user_to_id.read(owner);
            assert(id != 0, ERROR_NOT_REGISTERED);
            id
        }

        fn get_id_by_name(self: @ContractState, name: ByteArray) -> u256 {
            let id = self.namespaces.read(name);
            assert(id != 0, ERROR_NOT_REGISTERED);
            id
        }

        // IP Asset linking
        fn link_ip_asset(ref self: ContractState, id: u256, asset_id: u256) {
            self.pausable.assert_not_paused();
            let caller = get_caller_address();
            
            // Get profile
            let mut profile = self.profiles.read(id);
            assert(profile.owner == caller, ERROR_UNAUTHORIZED);
            
            // Verify asset exists in tokenizer
            let tokenizer = IIPTokenizerDispatcher {
                contract_address: self.tokenizer_contract.read()
            };
            
            // Verify asset owner
            let asset_owner = tokenizer.get_token_owner(asset_id);
            assert(asset_owner == caller, ERROR_UNAUTHORIZED);
            
            // Add asset to linked tokens
            profile.linked_token_ids.append(asset_id);
            profile.last_updated = starknet::get_block_timestamp();
            
            // Store updated profile
            self.profiles.write(id, profile);
            
            // Emit event
            self.emit(IPAssetLinked { id, asset_id });
        }

        fn get_linked_assets(self: @ContractState, id: u256) -> Array<u256> {
            let profile = self.profiles.read(id);
            assert(profile.owner != starknet::contract_address_const::<0>(), ERROR_NOT_REGISTERED);
            profile.linked_token_ids
        }

        // Verification and certification
        fn verify_ip_id(ref self: ContractState, id: u256, level: u8) {
            self.ownable.assert_only_owner();
            let mut profile = self.profiles.read(id);
            assert(profile.owner != starknet::contract_address_const::<0>(), ERROR_NOT_REGISTERED);
            
            // Update verification status
            profile.is_verified = true;
            profile.certification_level = level;
            profile.last_updated = starknet::get_block_timestamp();
            
            // Store updated profile
            self.profiles.write(id, profile);
            
            // Emit event
            self.emit(VerificationStatusChanged { id, is_verified: true, level });
        }

        // Community features
        fn create_community(ref self: ContractState, name: ByteArray) -> u256 {
            self.pausable.assert_not_paused();
            let caller = get_caller_address();
            
            // Generate new community ID
            let community_id = self.community_counter.read() + 1;
            self.community_counter.write(community_id);
            
            // Create empty member list
            let members: Array<u256> = ArrayTrait::new();
            
            // Store community
            self.communities.write(community_id, members);
            
            // Emit event
            self.emit(CommunityCreated { community_id, creator: caller, name });
            
            community_id
        }

        fn join_community(ref self: ContractState, community_id: u256) {
            self.pausable.assert_not_paused();
            let caller = get_caller_address();
            
            // Get user ID
            let user_id = self.user_to_id.read(caller);
            assert(user_id != 0, ERROR_NOT_REGISTERED);
            
            // Check if community exists
            let mut members = self.communities.read(community_id);
            
            // Add member to community
            members.append(user_id);
            self.communities.write(community_id, members);
            
            // Track user membership
            self.user_communities.write((caller, community_id), true);
            
            // Emit event
            self.emit(CommunityJoined { community_id, member_id: user_id });
        }

        fn get_community_members(self: @ContractState, community_id: u256) -> Array<u256> {
            self.communities.read(community_id)
        }

        fn is_community_member(self: @ContractState, user: ContractAddress, community_id: u256) -> bool {
            self.user_communities.read((user, community_id))
        }

        // Access control
        fn set_permission(ref self: ContractState, id: u256, feature_id: u8, has_access: bool) {
            self.ownable.assert_only_owner();
            self.feature_access.write((id, feature_id), has_access);
        }

        fn has_permission(self: @ContractState, id: u256, feature_id: u8) -> bool {
            self.feature_access.read((id, feature_id))
        }

        // Pause/unpause
        fn set_paused(ref self: ContractState, paused: bool) {
            self.ownable.assert_only_owner();
            if paused {
                self.pausable.pause();
            } else {
                self.pausable.unpause();
            }
        }
    }

    // Private implementation
    #[generate_trait]
    impl PrivateImpl of PrivateTrait {
        fn _check_permission(self: @ContractState, id: u256, permission: Permission) -> bool {
            // Check direct permission
            if self.feature_access.read((id, permission.into())) {
                return true;
            }
            
            // Check certification level based permissions
            let profile = self.profiles.read(id);
            let level = profile.certification_level;
            
            if level == 0 {
                return false;
            }
            
            // Get permissions for this level
            let level_permissions = self.global_permissions.read(level);
            
            // Check if permission is included
            let mut i: u32 = 0;
            let permission_value: u8 = permission.into();
            loop {
                if i >= level_permissions.len() {
                    break false;
                }
                
                let current = level_permissions.get(i).unwrap().unbox();
                if current == permission_value {
                    break true;
                }
                
                i += 1;
            }
        }
    }
}