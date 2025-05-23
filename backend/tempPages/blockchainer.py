from web3 import Web3

# Connect to Ganache
ganache_url = "http://127.0.0.1:8545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# Check Connection
print("Connected:", web3.is_connected())
account = "0x415eC6793E63eB71F637538a60280e88ECDCbA83"  # Replace with your MetaMask address
balance = web3.eth.get_balance(account)
print("Balance (ETH):", web3.from_wei(balance, "ether"))
sender = "0xEaF10E72aCeD112F3939B598b04A1D9Cf4132648"
receiver = "0x2abA2B30473B60a78ee65E34f1DfA12aB15E0064"
private_key = "0x3d31008474ee79572052121dd0599490d751fbe66172e73cee61ead7cddb416b"  # Get from Ganache

# Create Transaction
txn = {
    "to": receiver,
    "value": web3.to_wei(0.01, "ether"),
    "gas": 21000,
    "gasPrice": web3.to_wei(50, "gwei"),
    "nonce": web3.eth.get_transaction_count(sender)
}

# Sign and Send Transaction
signed_txn = web3.eth.account.sign_transaction(txn, private_key)
txn_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)

print("Transaction Hash:", web3.to_hex(txn_hash))

print("Balance (ETH):", web3.from_wei(web3.eth.get_balance(account), "ether"))

print("Balance (ETH):", web3.from_wei(web3.eth.get_balance(receiver), "ether"))
