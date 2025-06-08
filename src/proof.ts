const { ethers } = require('ethers');
import { Proof } from './types';

// Default expiration period in days
const DEFAULT_EXPIRATION_DAYS = 90;

export async function generateProof(domain: string, privateKey: string, expirationDays: number = DEFAULT_EXPIRATION_DAYS): Promise<Proof> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const expiration = Math.floor(Date.now() / 1000 + (expirationDays * 24 * 60 * 60)).toString();
  
  // Message format: unix_timestamp|domain_name|expiration_timestamp
  const message = `${timestamp}|${domain}|${expiration}`;
  
  // Sign with EIP-191 compliant personal_sign format
  // ethers.js automatically applies: "\x19Ethereum Signed Message:\n" + len(message) + message
  // This matches MetaMask's personal_sign behavior (EIP-191 version 0x45)
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  
  return {
    walletAddress: wallet.address,
    domainName: domain,
    timestamp,
    expiration,
    signature
  };
}

// Function for MetaMask signatures with expiration
export function generateProofFromSignature(domain: string, walletAddress: string, timestamp: string, expiration: string, signature: string): Proof {
  return {
    walletAddress,
    domainName: domain,
    timestamp,
    expiration,
    signature
  };
}

export function createMessageToSign(domain: string, timestamp: string, expiration: string): string {
  return `${timestamp}|${domain}|${expiration}`;
}

export function formatTxtRecord(proof: Proof): string {
  return `wallet=${proof.walletAddress}&timestamp=${proof.timestamp}&expiration=${proof.expiration}&sig=${proof.signature}`;
} 