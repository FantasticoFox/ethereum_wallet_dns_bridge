export interface Proof {
  walletAddress: string;
  domainName: string;
  timestamp: string;
  expiration: string;
  signature: string;
}

export interface TxtRecord {
  wallet: string;
  timestamp: string;
  expiration: string;
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