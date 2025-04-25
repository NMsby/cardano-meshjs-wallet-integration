import type { AppProps } from 'next/app';
import { MeshProvider } from '@meshsdk/react';
import { useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import Link from 'next/link';

// Define types for wallet assets and wallet info
type Asset = {
    unit: string;
    quantity: string;
};

type WalletInfo = {
    id: string;
    name: string;
    icon: string;
    version: string;
};

// Import styles
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
    const [connected, setConnected] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [walletBalance, setWalletBalance] = useState<Asset[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<string>('');

    // Fetch available wallets on component mount
    useEffect(() => {
        const getWallets = async () => {
            try {
                const wallets = await BrowserWallet.getAvailableWallets();
                setAvailableWallets(wallets);
                console.log('Available wallets:', wallets);
            } catch (error) {
                console.error('Error fetching available wallets:', error);
            }
        };

        getWallets();
    }, []);

    // Connect to selected wallet
    const connectWallet = async (walletId: string = selectedWallet) => {
        if (!walletId) return;

        try {
            setLoading(true);

            // Connect to the selected wallet
            const wallet = await BrowserWallet.enable(walletId);

            // Get wallet addresses
            const addresses = await wallet.getUsedAddresses();
            const address = addresses[0];
            setWalletAddress(address);

            // Get wallet balance - returns array of assets
            const balance = await wallet.getBalance();
            setWalletBalance(balance);

            setConnected(true);
            setLoading(false);
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            setLoading(false);
        }
    };

    // Disconnect wallet
    const disconnectWallet = () => {
        setConnected(false);
        setWalletAddress('');
        setWalletBalance([]);
        setSelectedWallet('');
    };

    return (
        <MeshProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
                {/* Header */}
                <header className="p-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">Cardano DApp</h1>
                    </div>
                    <nav className="space-x-6">
                        <Link href="/" className="hover:text-blue-300">Home</Link>
                        <Link href="/about" className="hover:text-blue-300">About</Link>
                        <Link href="/dashboard" className="hover:text-blue-300">Dashboard</Link>
                    </nav>
                    <div>
                        {!connected ? (
                            <div className="relative">
                                {availableWallets.length > 0 ? (
                                    <div className="flex flex-col">
                                        <div className="relative inline-block text-left mb-2">
                                            <select
                                                className="bg-blue-800 text-white px-4 py-2 rounded-lg w-full"
                                                value={selectedWallet}
                                                onChange={(e) => setSelectedWallet(e.target.value)}
                                            >
                                                <option value="">Select a wallet</option>
                                                {availableWallets.map((wallet) => (
                                                    <option key={wallet.id} value={wallet.id}>
                                                        {wallet.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => connectWallet()}
                                            disabled={loading || !selectedWallet}
                                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors ${(!selectedWallet) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? 'Connecting...' : 'Connect Wallet'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="mb-2 text-yellow-300">No Cardano wallets detected</p>
                                        <a
                                            href="https://eternl.io/app/mainnet/wallet"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-300 hover:text-blue-200 underline"
                                        >
                                            Install Eternl Wallet
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-800 rounded-lg p-2">
                                    <p className="text-sm">
                                        {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                                    </p>
                                    <p className="text-xs">
                                        {walletBalance.find(asset => asset.unit === 'lovelace')
                                            ? parseFloat(walletBalance.find(asset => asset.unit === 'lovelace').quantity) / 1000000
                                            : 0} ₳
                                    </p>
                                    {walletBalance.filter(asset => asset.unit !== 'lovelace').length > 0 && (
                                        <p className="text-xs text-blue-300">
                                            + {walletBalance.filter(asset => asset.unit !== 'lovelace').length} tokens
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto p-6">
                    {/* Hero Section */}
                    <section className="py-16 text-center">
                        <h1 className="text-5xl font-bold mb-6">Welcome to Cardano DApp</h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            A decentralized application built on Cardano blockchain using MeshJS and wallet integration.
                        </p>
                        {!connected && (
                            <div>
                                {availableWallets.length > 0 ? (
                                    <div className="flex flex-col items-center">
                                        <div className="mb-4 w-64">
                                            <select
                                                className="bg-blue-800 text-white px-4 py-2 rounded-lg w-full"
                                                value={selectedWallet}
                                                onChange={(e) => setSelectedWallet(e.target.value)}
                                            >
                                                <option value="">Choose your wallet</option>
                                                {availableWallets.map((wallet) => (
                                                    <option key={wallet.id} value={wallet.id}>
                                                        {wallet.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => connectWallet()}
                                            disabled={loading || !selectedWallet}
                                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors ${(!selectedWallet) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? 'Connecting...' : 'Launch App'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-blue-800 rounded-lg inline-block">
                                        <p className="mb-2">No Cardano wallets detected in your browser</p>
                                        <p className="mb-4 text-blue-300">Install one of these wallets to continue:</p>
                                        <div className="flex justify-center space-x-4">
                                            <a
                                                href="https://eternl.io/app/mainnet/wallet"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Eternl
                                            </a>
                                            <a
                                                href="https://namiwallet.io/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Nami
                                            </a>
                                            <a
                                                href="https://flint-wallet.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Flint
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Features Section */}
                    <section className="py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-blue-800 bg-opacity-40 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
                                <p>Leverage the security and reliability of Cardano blockchain for all your transactions.</p>
                            </div>
                            <div className="bg-blue-800 bg-opacity-40 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-3">MeshJS Integration</h3>
                                <p>Built with MeshJS SDK for seamless interaction with the Cardano blockchain.</p>
                            </div>
                            <div className="bg-blue-800 bg-opacity-40 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-3">Multi-Wallet Support</h3>
                                <p>Connect with your preferred Cardano wallet for a smooth user experience and transaction management.</p>
                            </div>
                        </div>
                    </section>

                    {/* Wallet Section - Show when wallets are available but not connected */}
                    {availableWallets.length > 0 && !connected && (
                        <section className="py-8">
                            <h2 className="text-2xl font-bold mb-6 text-center">Available Wallets</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {availableWallets.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        className={`p-4 border border-blue-400 rounded-lg cursor-pointer transition-all ${selectedWallet === wallet.id ? 'bg-blue-700' : 'bg-blue-800 bg-opacity-40 hover:bg-blue-700 hover:bg-opacity-40'}`}
                                        onClick={() => setSelectedWallet(wallet.id)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {wallet.icon && (
                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={wallet.icon}
                                                        alt={`${wallet.name} logo`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold">{wallet.name}</h3>
                                                <p className="text-xs text-blue-300">v{wallet.version}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => connectWallet()}
                                    disabled={loading || !selectedWallet}
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors ${(!selectedWallet) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Connecting...' : `Connect ${selectedWallet ? availableWallets.find(w => w.id === selectedWallet)?.name : 'Wallet'}`}
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Render the component passed to MyApp */}
                    <Component {...pageProps} />
                </main>

                {/* Footer */}
                <footer className="mt-12 py-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Cardano DApp. Built with MeshJS and Next.js</p>
                    {availableWallets.length > 0 && (
                        <p className="mt-2 text-blue-300">
                            {availableWallets.length} wallet{availableWallets.length > 1 ? 's' : ''} available: {availableWallets.map(w => w.name).join(', ')}
                        </p>
                    )}
                </footer>
            </div>
        </MeshProvider>
    );
}

export default App;