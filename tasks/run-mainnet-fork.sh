#!/bin/sh

# Load FORK_URL from .env.local - URL to fork from ethereum mainnet
. .env.development

CHAIN_ID=1337

anvil --accounts 2 --balance 300 --chain-id $CHAIN_ID --fork-url $MAINNET_FORK_URL 1>&2 &
ANVIL_PID=$!
[ ! -d ".dev-state" ] && mkdir .dev-state
tail -f /dev/null 

