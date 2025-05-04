// utils/ipfs.ts
// Utilidades para trabajar con IPFS y metadatos de activos

// Define el tipo para metadatos de IPFS
export interface IPFSMetadata {
    name?: string;
    description?: string;
    image?: string;
    type?: string;
    creator?: string | { name: string; address: string };
    attributes?: Array<{ trait_type: string; value: string }>;
    [key: string]: any; // Para permitir propiedades adicionales
  }
  
  // Define el tipo para un asset básico
  export interface AssetType {
    id: string;
    name: string;
    description?: string;
    image?: string;
    ipfsCid?: string;
    type?: string;
    creator: any; // Adaptado a tu estructura actual
    owner: any; // Adaptado a tu estructura actual
    attributes?: Array<{ trait_type: string; value: string }>;
    [key: string]: any; // Para permitir propiedades adicionales
  }
  
  /**
   * Recupera metadatos desde IPFS usando un gateway público
   * @param {string} cid - Content Identifier de IPFS
   * @returns {Promise<IPFSMetadata|null>} - Metadatos recuperados o null en caso de error
   */
  export async function fetchIPFSMetadata(cid: string): Promise<IPFSMetadata | null> {
    if (!cid) return null;
    
    try {
      // Usamos un gateway público de IPFS (puedes cambiarlo por otro gateway si prefieres)
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      
      if (!response.ok) {
        console.error(`Error fetching from IPFS: ${response.statusText}`);
        return null;
      }
      
      const metadata = await response.json();
      return metadata as IPFSMetadata;
    } catch (error) {
      console.error("Error fetching IPFS metadata:", error);
      return null;
    }
  }
  
  /**
   * Determina el tipo de IP basado en metadatos
   * @param {IPFSMetadata} metadata - Metadatos recuperados de IPFS o mocks
   * @returns {string} - Tipo de propiedad intelectual detectado
   */
  export function determineIPType(metadata: IPFSMetadata | null): string {
    if (!metadata) return 'Generic';
    
    // Si hay un tipo explícito, lo usamos
    if (metadata.type) {
      return metadata.type;
    }
    
    // Inferimos el tipo basado en otros campos
    if (metadata.medium === 'Digital Art' || metadata.medium === 'Physical Art' || 
        metadata.medium === 'Painting' || metadata.medium === 'Illustration') {
      return 'Art';
    }
    
    if (metadata.fileType) {
      if (metadata.fileType.startsWith('audio/')) return 'Audio';
      if (metadata.fileType.startsWith('video/')) return 'Video';
      if (metadata.fileType.includes('code') || metadata.fileType.includes('javascript')) return 'Software';
    }
    
    // Inferencia por combinaciones de campos
    if (metadata.duration || metadata.genre || metadata.bpm) return 'Audio';
    if (metadata.resolution || metadata.framerate) return 'Video';
    if (metadata.yearCreated && metadata.artistName) return 'Art';
    if (metadata.version && (metadata.external_url || metadata.repository)) return 'Software';
    if (metadata.patent_number || metadata.patent_date) return 'Patent';
    if (metadata.trademark_number) return 'Trademark';
    
    // Verificar si tiene campos relacionados con NFTs
    if (metadata.tokenId || metadata.tokenStandard || metadata.blockchain) return 'NFT';
    
    // Si tiene documentación o papers
    if (metadata.pages || metadata.authors || metadata.publisher) return 'Document';
    
    // Si nada coincide, retornar Generic
    return 'Generic';
  }
  
  /**
   * Obtiene los CIDs conocidos para activos específicos
   * En una implementación real, esto podría obtener datos de una API o blockchain
   * @returns {Record<string, string>} - Mapa de IDs a CIDs
   */
  export function getKnownCids(): Record<string, string> {
    // Simula la recuperación de CIDs conocidos
    // En una aplicación real, esto vendría de tu backend o blockchain
    return {
      "1": "QmT7fTAgtScnXy1WGHYfzWrZfTsZEWPXbZqRPKqsYbifF1", // Arte digital
      "2": "QmULxVeZ6ADXYfSmvbWAr3k6WVp7WFjEbxxUdqkzKwxriY", // Software 
      "3": "QmVLDAhCY3X9P2uRudKAryuQFPM5zqA3Yij1dY8FpGbL3T", // Audio
      "4": "QmP1QyqoYxmYJQfYDj6BcUa5YNbgWgSJNjGTpz1G8HbR1N", // Video
      "5": "QmWnSQ3oRrYa9GyYaUCKQ5amL1z2Q1LFMYVM8Rkd3r9Kj2", // Patent
      // Puedes agregar más CIDs según sea necesario
    };
  }
  
  /**
   * Combina datos de metadatos IPFS con datos mock para un enfoque híbrido
   * @param {IPFSMetadata} ipfsData - Datos recuperados de IPFS (o null)
   * @param {AssetType} mockData - Datos mock como fallback
   * @returns {AssetType} - Datos combinados, priorizando IPFS sobre mock
   */
  export function combineData(ipfsData: IPFSMetadata | null, mockData: AssetType): AssetType {
    if (!ipfsData) return mockData;
    
    // Combinar los datos, priorizando los datos de IPFS
    const result: AssetType = {
      ...mockData,
      ...ipfsData as any, // Usamos any aquí para permitir la combinación
      // Garantizar que estos campos siempre estén disponibles
      id: mockData.id, // Mantener el ID original
      // Manejar casos especiales como objetos anidados
      creator: ipfsData.creator || mockData.creator,
      owner: mockData.owner, // Mantener el owner actual
      // Usar la imagen de IPFS si existe, sino la del mock
      image: ipfsData.image || mockData.image,
      // Usar los atributos de IPFS si existen, sino los del mock
      attributes: ipfsData.attributes || mockData.attributes,
      // Determinar el tipo basado en los metadatos de IPFS
      type: determineIPType(ipfsData),
    };
    
    // Mantener el CID original si existe
    if (mockData.ipfsCid) {
      result.ipfsCid = mockData.ipfsCid;
    }
    
    return result;
  }