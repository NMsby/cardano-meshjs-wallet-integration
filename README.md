# Cardano MeshJS Wallet Integration

A decentralized application built on Cardano blockchain that demonstrates wallet integration using MeshJS.

## Features

- Multi-wallet discovery and connection
- Automatic detection of installed Cardano wallets
- Display of wallet balance (ADA and native tokens)
- Responsive design for various screen sizes
- Works with Eternl, Nami, Flint, and other Cardano wallets

## Technologies

- Next.js
- TypeScript
- MeshJS SDK
- Tailwind CSS
- Cardano Blockchain

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- A Cardano wallet (Eternl, Nami, Flint, etc.)

### Installation

1. Clone the repository
  ```
  git clone https://github.com/YourUsername/cardano-meshjs-wallet-integration.git
  cd cardano-meshjs-wallet-integration
  ```
2. Install dependencies
  ```
   npm install
   # or
   yarn install
   ```
3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `pages/_app.tsx` - Main application component with wallet integration
- `styles/globals.css` - Global styles
- `pages/index.tsx` - Home page
- `pages/about.tsx` - About page
- `pages/dashboard.tsx` - Dashboard page (requires wallet connection)

## Usage

1. Visit the application in your browser
2. Select your preferred Cardano wallet from the dropdown
3. Click "Connect Wallet" to establish a connection
4. Your wallet address and balance will be displayed once connected
5. Use the "Disconnect" button to disconnect your wallet

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [MeshJS](https://meshjs.dev/) - The Cardano development framework
- Cardano wallet providers (Eternl, Nami, Flint, etc.)

