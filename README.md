<img width="1252" height="888" alt="image" src="https://github.com/user-attachments/assets/29a76a8b-9d05-489f-945b-eacca9b17996" />

> [!IMPORTANT]
> Mediolano dapp is in constant development. Use for testing purposes only. 

Quick links:
<br>
<a href="https://ip.mediolano.app">Mediolano Dapp</a>
<br>
<a href="https://mediolano.xyz">Website mediolano.xyz</a>
<br>
<a href="https://t.me/MediolanoStarknet">Telegram</a>
<br>
<a href="https://x.com/mediolanoapp">X / Twitter</a>
<br>


## Programmable IP for the Integrity Web

Mediolano provides seamless tokenization services for intellectual property, leveraging Starknet’s unparalleled high-speed, low-cost, and smart contract intelligence for digital assets to empower creators, collectors, and organizations to protect and monetize their IP assets effectively.

Registering intellectual property on Mediolano means your asset is automatically tokenized and protected in 181 countries, according to The Berne Convention for the Protection of Literary and Artistic Works, adopted in 1886. Mediolano assets generate Proof of Ownership to guarantee recognition of the authorship of IP without the need for registration with the World Intellectual Property Organization (WIPO).

Mediolano offers permissionless services with ZERO FEES for Programmable IP, such as artwork, videos, music, literary works, AI models, software, and other works of authorship. The copyright is immutable time stamped on Starknet public blockchain, and settled on Ethereum, providing Proof of Ownership valid for 50-70 years, in accord with the legal jurisdiction. Tokenizing intellectual property with smart contracts opens the door to countless opportunities, from integrations with communities and games to monetization with AI Agents.

Mediolano aims to serve as the intellectual property provider for the integrity web, a public good to empower programmable IP to anyone. By integrating standards, innovative technology and decentralization, Mediolano ensures interoperability, security and sovereignty. Our platform is tailored for the tokenization and management of intellectual property, enabling you to register, track, license and monetize IP effortlessly, unlocking new revenue streams.


### Key Features

- Programmable IP: Transform intelligence works into digital assets that can be managed, traded, and monetized. This includes everything from images, music, NFTs, papers, video and real-world assets.

- Immutable Ownership & Attribution: blockchain ensures clear sovereignty, verifiable ownership and attribution for every piece of IP, safeguarding your property.

- Enhanced Registration & Protection: Use templates and smart contracts to take charge of your IP assets in the digital realm with immutable and transparent ownership.

- High-Speed & Low-Cost: Leverage Starknet's unparalleled speed and cost-efficiency with ZERO FEES on Mediolano Protocol.

- Gas Fee Abstraction: AVNU Paymaster integration eliminates gas fee barriers for seamless user experience. (Experimental feature)


[![YouTube](http://i.ytimg.com/vi/uvskLmxmt7M/hqdefault.jpg)](https://www.youtube.com/watch?v=uvskLmxmt7M)



## Roadmap

- [x] Starknet Ignition **24.9**

- [x] MIP Protocol @ Starknet Sepolia **24.11**

- [x] Mediolano Dapp @ Starknet Sepolia **24.11**

- [x] Programmable IP Contracts **25.02**

- [x] MIP Dapp @ Starknet Sepolia **25.06**

- [X] MIP Protocol @ Starknet Mainnet **25.07**

- [ ] MIP Collections Protocol @ Starknet Sepolia **25.07**

- [ ] MIP Dapp @ Starknet Mainnet **25.08**

- [ ] Mediolano Dapp @ Starknet Mainnet **25.08**

- [ ] MIP Collections Protocol @ Starknet Mainnet **25.08**

- [ ] Medialane Protocol @ Starknet Sepolia **25.08**

- [ ] Medialane Dapp @ Starknet Sepolia **25.09**

- [ ] Medialane Protocol @ Starknet Mainnet **25.11**

- [ ] Medialane Dapp @ Starknet Mainnet **25.11**


## Contributing

We are building open-source Integrity Web with the amazing **OnlyDust** platform. Check https://app.onlydust.com/p/mediolano for more information.

We also have a Telegram group focused to support development: https://t.me/mediolanoapp

Ccontributions are **greatly appreciated**. If you have a feature or suggestion that would our plattform better, please fork the repo and create a pull request with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/Feature`)
3. Commit your Changes (`git commit -m 'Add some Feature'`)
4. Push to the Branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## Getting Started


### Running locally

Dapp requirements:
- Next.js 15
- React 19
- Node.js 18.18 or later.
- macOS, Windows (including WSL), and Linux are supported.

Clone the repository to your local machine:

```bash
git clone https://github.com/mediolano-app/mediolano-app.git
```
Install dependencies for Next.js 15 + React 19:

```bash
npm install --force
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Running via Docker

To run the containerized application, there is no dependencies requirement. 
Clone the repository, and run:

```bash
 docker build -t mediolano-app .     
```

To build the image. Then, start the container:

```bash
docker run -p 8080:8080 mediolano-app
```

### Quick Start with Paymaster

```bash
# 1. Clone and install
git clone https://github.com/mediolano-app/mediolano-app.git
cd mediolano-app
npm install

# 2. Configure environment
cp .env.example .env.local
# Add your AVNU Paymaster API key

# 3. Run the app
npm run dev

# 4. Visit /paymaster-demo to try it out!
```
