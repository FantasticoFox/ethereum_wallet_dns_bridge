import { resolveTxt } from 'node:dns/promises'
import fs from 'fs'
import { ethers, Wallet } from "ethers"
import minimist from "minimist"

const argv = minimist(process.argv.slice(2))
const command = argv._[0]
const domainName = argv._[1]

if (!command) {
  console.error("ERROR: You must specify a command")
  process.exit(1)
}
if (!domainName) {
  console.error("ERROR: You must specify a domain name")
  process.exit(1)
}

const getWallet = async (mnemonic) => {
  // Always trim the last new line
  const wallet = Wallet.fromPhrase(mnemonic.trim())
  // const walletAddress = wallet.address //.toLowerCase()
  const walletAddress = ethers.getAddress(wallet.address)
  return [wallet, walletAddress, wallet.publicKey, wallet.privateKey]
}

const doSign = async (wallet, content) => {
  const signature = await wallet.signMessage(content)
  return signature
}

const verifySignature = async (signature, walletAddress, content) => {
  const recoveredAddress = ethers.utils.verifyMessage(content, signature);
  return recoveredAddress.toLowerCase() === walletAddress
}

let payload
switch (command) {
  case "generate":
    const credentials = JSON.parse(fs.readFileSync("./credentials.json"))
    let [wallet, _walletAddress, _publicKey] = await getWallet(
      credentials.mnemonic,
    )
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await doSign(wallet, `${timestamp}|domainName`)
    payload = `wallet=${_walletAddress}&timestamp=${timestamp}&sig=${signature}`
    console.log(`Put this in your DNS TXT record (${payload.length} chars):`)
    console.log(payload)
  case "verify":
    const rawRecords = await resolveTxt(`aqua._wallet.${domainName}`)
    const txtRecord = rawRecords.map(parts => parts.join(''))[0]
    const urlParam = new URLSearchParams(txtRecord)
    payload = Object.fromEntries(urlParam)
    const sigOk = await verifySignature(payload.sig, payload.wallet, `${payload.timestamp}|${domainName}`)
    console.log(sigOk)
}
