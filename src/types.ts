export interface Proof {
  walletAddress: string;
  domainName: string;
  nonce: string;
  timestamp: string;
  signature: string;
}

export interface TxtRecord {
  wallet: string;
  timestamp: string;
  sig: string;
}

export interface SignatureMethod {
  type: 'metamask' | 'mnemonic' | 'interactive';
  data?: string; // mnemonic or credential file path
}

export interface WalletConfig {
  mnemonic?: string;
  derivationPath?: string;
  credentialsFile?: string;
}

export interface SignatureRequest {
  message: string;
  address: string;
  method: SignatureMethod;
} 