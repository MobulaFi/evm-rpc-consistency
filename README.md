### Is eth_getLogs consistent?

Spoiler: no, it's not.

### Methodology

- We ping the head of the chain with `eth_getLogs` every new block for 100 blocks.
- We then ask in a single `eth_getLogs` call for the logs of the last 100 blocks.
- We compare the two results.
