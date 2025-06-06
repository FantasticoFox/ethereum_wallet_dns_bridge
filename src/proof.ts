const { ethers } = require('ethers');
import { randomBytes } from 'crypto';
import { Proof } from './types';

export async function generateProof(domain: string, privateKey: string): Promise<Proof> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  
  // Message format: unix_timestamp|domain_name
  const message = `${timestamp}|${domain}`;
  
  // Sign with EIP-191 compliant personal_sign format
  // ethers.js automatically applies: "\x19Ethereum Signed Message:\n" + len(message) + message
  // This matches MetaMask's personal_sign behavior (EIP-191 version 0x45)
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  
  return {
    walletAddress: wallet.address,
    domainName: domain,
    nonce: '', // No nonce needed
    timestamp,
    signature
  };
}

// New function for MetaMask signatures
export function generateProofFromSignature(domain: string, walletAddress: string, timestamp: string, nonce: string, signature: string): Proof {
  return {
    walletAddress,
    domainName: domain,
    nonce,
    timestamp,
    signature
  };
}

export function createMessageToSign(domain: string, timestamp: string): string {
  return `${timestamp}|${domain}`;
}

export function formatTxtRecord(proof: Proof): string {
  return `wallet=${proof.walletAddress}&timestamp=${proof.timestamp}&sig=${proof.signature}`;
} 