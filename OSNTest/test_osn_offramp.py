"""OSN Off-Ramp API Integration Tests — Sepolia testnet workflow.

Tests the full flow: pre-flight → quote → transfer → on-chain funding → upload tx hash → status tracking.

Usage:
    python3 test_osn_offramp.py

Prerequisites:
    pip install requests web3

Config files (in the same directory):
    .api-key             — OSN API key
    sepolia_wallet.json  — Sepolia wallet with private key
"""

import json
import os
import sys
import time
from pathlib import Path

import requests

# ---------------------------------------------------------------------------
# Paths & Config
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
API_KEY_FILE = BASE_DIR / ".api-key"
WALLET_FILE = BASE_DIR / "sepolia_wallet.json"

BASE_URL = "https://d1qjqmd2pn1890.cloudfront.net/api/v4"
CHAIN_ID = "0xaa36a7"  # Ethereum Sepolia
USDT_CONTRACT = "0x4a8a33C88ad2635dd885E7c03f9e8e7eF6387647"
DEPOSIT_WALLET = "0x3d7ed81a7d72b07ee53d423fa45009c639abb494"
TEST_AMOUNT = 1.0  # USDT

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_api_key() -> str:
    """Read API key from .api-key file."""
    assert API_KEY_FILE.exists(), f"API key file not found: {API_KEY_FILE}"
    key = API_KEY_FILE.read_text().strip()
    assert key, "API key file is empty"
    return key


def load_wallet() -> dict:
    """Load Sepolia wallet from sepolia_wallet.json."""
    assert WALLET_FILE.exists(), f"Wallet file not found: {WALLET_FILE}"
    return json.loads(WALLET_FILE.read_text())


def headers(api_key: str) -> dict:
    return {"x-api-key": api_key, "Content-Type": "application/json"}


def api(method: str, path: str, api_key: str, **kwargs) -> dict:
    """Make an API request and return parsed JSON."""
    url = f"{BASE_URL}{path}"
    resp = requests.request(method, url, headers=headers(api_key), timeout=30, **kwargs)
    try:
        data = resp.json()
    except ValueError:
        data = resp.text
    print(f"  {resp.status_code} {resp.reason}")
    return resp, data


def onchain_fund(wallet: dict, amount_usdt: float) -> str:
    """Send USDT on Sepolia and return the tx hash."""
    from web3 import Web3

    RPC = "https://eth-sepolia.api.onfinality.io/public"
    USDT_ABI = [
        {
            "constant": True,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function",
        },
        {
            "constant": False,
            "inputs": [
                {"name": "_to", "type": "address"},
                {"name": "_value", "type": "uint256"},
            ],
            "name": "transfer",
            "outputs": [{"name": "", "type": "bool"}],
            "type": "function",
        },
    ]

    w3 = Web3(Web3.HTTPProvider(RPC))
    assert w3.is_connected(), "Cannot connect to Sepolia RPC"

    acct = w3.eth.account.from_key(wallet["private_key"])
    deposit_checksum = Web3.to_checksum_address(DEPOSIT_WALLET)
    usdt_checksum = Web3.to_checksum_address(USDT_CONTRACT)

    contract = w3.eth.contract(address=usdt_checksum, abi=USDT_ABI)

    # Check balances
    eth_balance = w3.from_wei(w3.eth.get_balance(acct.address), "ether")
    print(f"  ETH balance: {eth_balance}")
    assert eth_balance > 0, "Insufficient ETH for gas"

    usdt_balance = contract.functions.balanceOf(acct.address).call()
    usdt_balance_float = usdt_balance / 1e6
    print(f"  USDT balance: {usdt_balance_float}")

    raw_amount = int(amount_usdt * 1e6)
    assert usdt_balance >= raw_amount, (
        f"Insufficient USDT. Need {amount_usdt}, have {usdt_balance_float}"
    )

    # Build & send
    tx = contract.functions.transfer(deposit_checksum, raw_amount).build_transaction({
        "from": acct.address,
        "gas": 100000,
        "gasPrice": w3.eth.gas_price,
        "nonce": w3.eth.get_transaction_count(acct.address),
        "chainId": 11155111,
    })

    signed = w3.eth.account.sign_transaction(tx, wallet["private_key"])
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    tx_hex = "0x" + tx_hash.hex()
    print(f"  TX sent: {tx_hex}")

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
    assert receipt.status == 1, f"On-chain tx failed: {receipt}"
    print(f"  TX confirmed: block {receipt.blockNumber}")
    return tx_hex


# ---------------------------------------------------------------------------
# Test Steps
# ---------------------------------------------------------------------------

def step1_check_recipient_banks(api_key: str) -> str:
    """Pre-flight: verify at least one recipient bank account exists. Returns bank account id."""
    print("\n[Step 1] Check recipient bank accounts")
    _, data = api("GET", "/recipient-bank-account", api_key)
    assert "accounts" in data, "Response missing 'accounts' key"
    assert len(data["accounts"]) > 0, "No recipient bank accounts found — add one first"

    # Prefer an approved account
    approved = [a for a in data["accounts"] if a.get("status") == "approved"]
    assert len(approved) > 0, "No approved bank accounts found"

    bank = approved[0]
    bank_id = bank["id"]
    print(f"  Using bank: {bank['nick_name']} (ID: {bank_id})")
    return bank_id


def step2_check_wallets(api_key: str) -> str:
    """Pre-flight: find the Sepolia off-ramp wallet. Returns source_wallet_id."""
    print("\n[Step 2] Check available wallets")
    _, data = api("GET", "/users/me/wallets", api_key)
    assert "wallets" in data, "Response missing 'wallets' key"

    sepolia_wallets = [
        w for w in data["wallets"]
        if w.get("chain_id") == CHAIN_ID
        and "user_organization_offramp_wallet" in w.get("purposes", [])
    ]
    assert len(sepolia_wallets) > 0, f"No Sepolia off-ramp wallet found"

    wallet_id = sepolia_wallets[0]["id"]
    wallet_addr = sepolia_wallets[0]["address"]
    print(f"  Using wallet: {wallet_addr} (ID: {wallet_id})")
    return wallet_id


def step3_create_quote(api_key: str) -> tuple[str, float]:
    """Create a payment quote. Returns (quote_id, rate)."""
    print("\n[Step 3] Create payment quote")
    body = {
        "source_currency": "USDT",
        "destination_currency": "HKD",
        "amount": TEST_AMOUNT,
        "chain_id": CHAIN_ID,
    }
    resp, data = api("POST", "/payment-quotes", api_key, json=body)
    assert resp.status_code in (200, 201), f"Failed to create quote: {data}"
    assert "payment_quote_id" in data, "Response missing 'payment_quote_id'"
    assert "rate" in data, "Response missing 'rate'"

    quote_id = data["payment_quote_id"]
    rate = data["rate"]
    expires_at = data.get("expires_at", "N/A")
    print(f"  Quote ID: {quote_id}")
    print(f"  Rate: {rate}")
    print(f"  Expires: {expires_at}")

    assert rate > 0, f"Invalid rate: {rate}"
    return quote_id, rate


def step4_create_transfer(api_key: str, quote_id: str, bank_id: str, wallet_id: str) -> tuple[str, str]:
    """Create a transfer. Returns (transfer_id, payment_id)."""
    print("\n[Step 4] Create transfer")
    body = {
        "amount": TEST_AMOUNT,
        "source_currency": "USDT",
        "destination_currency": "HKD",
        "chain_id": CHAIN_ID,
        "is_wallet": True,
        "payment_quote_id": quote_id,
        "recipient_bank_account_id": bank_id,
        "source_wallet_id": wallet_id,
    }
    resp, data = api("POST", "/transfers", api_key, json=body)
    assert resp.status_code in (200, 201), f"Failed to create transfer: {data}"
    assert "id" in data, "Response missing transfer 'id'"
    assert "payment_id" in data, "Response missing 'payment_id'"
    assert data["status"] == "pending", f"Transfer not pending: {data['status']}"

    transfer_id = data["id"]
    payment_id = data["payment_id"]
    print(f"  Transfer ID: {transfer_id}")
    print(f"  Payment ID: {payment_id}")
    print(f"  Status: {data['status']}")
    return transfer_id, payment_id


def step5_fund_onchain(wallet: dict) -> str:
    """Fund the transfer on-chain. Returns tx hash."""
    print("\n[Step 5] Fund on-chain (send USDT to OSN deposit wallet)")
    tx_hash = onchain_fund(wallet, TEST_AMOUNT)
    assert tx_hash.startswith("0x"), f"Invalid tx hash: {tx_hash}"
    assert len(tx_hash) == 66, f"Invalid tx hash length: {len(tx_hash)}"
    print(f"  TX hash: {tx_hash}")
    return tx_hash


def step6_upload_tx_hash(api_key: str, transfer_id: str, tx_hash: str):
    """Upload the tx hash to OSN."""
    print("\n[Step 6] Upload transaction hash")
    body = {"transaction_hash": tx_hash}
    resp, data = api(
        "PUT",
        f"/transfers/{transfer_id}/upload-tx-hash",
        api_key,
        json=body,
    )
    assert resp.status_code == 200, f"Failed to upload tx hash: {data}"
    assert data is True or data == "true" or (isinstance(data, dict) and data), (
        f"Unexpected upload response: {data}"
    )
    print("  Upload successful")


def step7_check_status(api_key: str, payment_id: str) -> str:
    """Check payment status. Returns current status."""
    print("\n[Step 7] Check payment status")
    _, data = api("GET", f"/payment-histories/status/{payment_id}", api_key)
    assert "status" in data, "Response missing 'status'"

    status = data["status"]
    print(f"  Status: {status}")
    assert status in ("pending", "processing", "completed"), f"Unexpected status: {status}"
    return status


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("OSN Off-Ramp API Integration Test")
    print("=" * 60)

    # Load credentials
    api_key = load_api_key()
    wallet = load_wallet()

    # Step 1: Pre-flight — bank accounts
    bank_id = step1_check_recipient_banks(api_key)

    # Step 2: Pre-flight — wallets
    wallet_id = step2_check_wallets(api_key)

    # Step 3: Create quote
    quote_id, _ = step3_create_quote(api_key)

    # Step 4: Create transfer
    transfer_id, payment_id = step4_create_transfer(api_key, quote_id, bank_id, wallet_id)

    # Step 5: Fund on-chain
    tx_hash = step5_fund_onchain(wallet)

    # Step 6: Upload tx hash
    step6_upload_tx_hash(api_key, transfer_id, tx_hash)

    # Step 7: Check status
    status = step7_check_status(api_key, payment_id)

    print("\n" + "=" * 60)
    print(f"ALL TESTS PASSED — Payment status: {status}")
    print("=" * 60)

    # Poll until completed (optional, with timeout)
    print("\nPolling for completion (max 5 minutes)...")
    for i in range(30):
        time.sleep(10)
        _, data = api("GET", f"/payment-histories/status/{payment_id}", api_key)
        status = data.get("status", "unknown")
        print(f"  [{i+1}/30] Status: {status}")
        if status == "completed":
            print("\nPayment COMPLETED successfully!")
            break
        if status in ("failed", "cancelled", "rejected"):
            print(f"\nPayment ended with status: {status}")
            sys.exit(1)
    else:
        print(f"\nPolling timed out. Final status: {status}")


if __name__ == "__main__":
    main()
