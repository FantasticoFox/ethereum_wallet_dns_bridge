# Wallet-to-Domain Lookup System User Guide

## Overview
The Wallet-to-Domain Lookup System is a CLI tool that allows you to associate cryptocurrency wallet addresses with domain names using DNS TXT records. This creates a verifiable link between your wallet and domain that can be cryptographically validated.

## Prerequisites
- **Node.js** (v18 or higher)
- **DNS Admin Access**: You must have administrative access to your domain's DNS settings
- **Cryptocurrency Wallet**: A private key for the wallet you want to associate

## Installation

### Option 1: Use Pre-built Binary
1. Download `wallet-tool.js` from the GitHub releases
2. Run commands using: `node wallet-tool.js <command>`

### Option 2: Build from Source
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the tool: `node build.js`
4. Use the built file: `node dist/wallet-tool.js <command>`

## Commands

### Generate Proof
Creates a cryptographic proof linking your wallet to a domain.

```bash
node wallet-tool.js generate <domain> <privateKey>
```

**Parameters:**
- `<domain>`: Your domain name (e.g., `example.com`)
- `<privateKey>`: Your wallet's private key (e.g., `0x1234...`)

**Example:**
```bash
node wallet-tool.js generate example.com 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**Output:**
The tool will generate a TXT record content that looks like:
```
wallet=0xAbC123...;nonce=a1b2c3d4e5;timestamp=1234567890;sig=0xdef456...
```

### Verify Association
Verifies that a wallet-to-domain association exists and is valid.

```bash
node wallet-tool.js verify <domain> <lookupKey>
```

**Parameters:**
- `<domain>`: The domain name to check
- `<lookupKey>`: The lookup identifier you used in the DNS record

**Example:**
```bash
node wallet-tool.js verify example.com wallet1
```

## DNS Configuration

### Step-by-Step DNS Setup

1. **Generate the Proof**
   ```bash
   node wallet-tool.js generate yourdomain.com 0xYourPrivateKey
   ```

2. **Copy the TXT Record Content**
   The tool will output something like:
   ```
   wallet=0xAbC123...;nonce=a1b2c3d4e5;timestamp=1234567890;sig=0xdef456...
   ```

3. **Access Your DNS Provider**
   - Log into your domain registrar or DNS hosting service
   - Navigate to DNS management/settings

4. **Create TXT Record**
   - **Name/Host**: `aqua._<your-lookup-key>`
   - **Value**: The generated content from step 2
   - **Example Name**: `aqua._wallet1` (for lookup key "wallet1")

5. **Save and Wait**
   - Save the DNS record
   - DNS propagation can take 1-24 hours

6. **Verify the Association**
   ```bash
   node wallet-tool.js verify yourdomain.com wallet1
   ```

### DNS Record Format

**Record Name Pattern:**
```
aqua._<lookup-key>.<domain>
```

**Examples:**
- `aqua._wallet1.example.com` (for lookup key "wallet1")
- `aqua._main.mysite.org` (for lookup key "main")
- `aqua._trading.crypto-domain.io` (for lookup key "trading")

## Security Considerations

### Private Key Safety
- **Never share your private key** with anyone
- The tool only uses your private key to generate the cryptographic signature
- **Private keys are not stored** anywhere by this tool
- Consider using a dedicated wallet for domain associations

### DNS Security
- Use **DNSSEC** if your domain provider supports it
- Regularly monitor your DNS records for unauthorized changes
- Use strong passwords for your DNS provider account

### Proof Validity
- Each proof includes a timestamp and random nonce to prevent replay attacks
- The cryptographic signature ensures data integrity
- You can generate new proofs to update or revoke associations

## Troubleshooting

### "Invalid or no association found"
**Possible causes:**
1. **DNS Record Missing**: Check that the TXT record exists at the correct location
2. **DNS Propagation**: Wait longer for DNS changes to propagate globally
3. **Wrong Format**: Ensure the TXT record content exactly matches the generated proof
4. **Incorrect Lookup Key**: Verify you're using the same lookup key in both DNS and verify command

**Solutions:**
- Use online DNS lookup tools to verify your TXT record exists
- Try the verify command from different networks/locations
- Double-check the exact spelling of domain and lookup key

### "Error generating proof"
**Possible causes:**
1. **Invalid Private Key**: Ensure the private key is in correct format (0x...)
2. **Invalid Domain**: Check domain name format and spelling

### DNS Propagation Check
You can manually check if your DNS record exists using:
```bash
# Linux/Mac
dig TXT aqua._wallet1.yourdomain.com

# Windows
nslookup -type=TXT aqua._wallet1.yourdomain.com
```

## Use Cases

### Portfolio Verification
Link multiple wallets to your domain for portfolio transparency:
- `aqua._eth.yourdomain.com` → Ethereum wallet
- `aqua._btc.yourdomain.com` → Bitcoin wallet  
- `aqua._trading.yourdomain.com` → Trading wallet

### Professional Identity
Establish credible links between your professional domain and crypto addresses:
- Company website + treasury wallet
- Personal portfolio site + investment addresses
- DeFi protocol + governance wallet

### NFT Artist Verification
Prove ownership of NFT collections by linking your artist domain to creator wallets.

## Advanced Usage

### Multiple Associations
You can associate multiple wallets with the same domain using different lookup keys:

```bash
# Associate main wallet
node wallet-tool.js generate yourdomain.com 0xMainWalletKey
# Add TXT record at: aqua._main.yourdomain.com

# Associate trading wallet  
node wallet-tool.js generate yourdomain.com 0xTradingWalletKey
# Add TXT record at: aqua._trading.yourdomain.com
```

### Updating Associations
To update or revoke an association:
1. Generate a new proof with the updated wallet
2. Replace the existing DNS TXT record
3. Or delete the DNS record to remove the association

## Technical Details

### Cryptographic Process
1. **Message Construction**: `timestamp + nonce + domain`
2. **Hashing**: SHA-256 hash of the message
3. **Signing**: EIP-191 signature using wallet private key
4. **Verification**: Recover address from signature and compare

### DNS Query Process
1. Query `aqua._<lookup-key>.<domain>` for TXT records
2. Parse the record content into components
3. Reconstruct the original message
4. Verify the cryptographic signature
5. Compare recovered address with claimed wallet address

## Support

For issues, questions, or contributions:
- Check existing GitHub issues
- Create new issues with detailed error messages
- Include your OS, Node.js version, and exact commands used

---

**⚠️ Important**: Always keep your private keys secure and never share them. This tool is designed for users who understand cryptocurrency wallet security basics. 