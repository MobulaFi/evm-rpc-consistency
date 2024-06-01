import { GetLogsReturnType, parseAbiItem } from "viem";
import { publicClient } from "./client";

const TOTAL_BLOCKS_TO_FETCH = 10;
const BLOCK_WAIT_TIME_MS = 1000;

let currentBlock = await publicClient.getBlock({ blockTag: "latest" });
const startBlock = currentBlock;

const event = parseAbiItem(
  "event Transfer(address indexed, address indexed, uint256)"
);

const headLogs: GetLogsReturnType = [];

while (currentBlock.number - startBlock.number < TOTAL_BLOCKS_TO_FETCH) {
  const _currentBlock = await publicClient.getBlock({ blockTag: "latest" });

  if (_currentBlock.number === currentBlock.number) {
    await new Promise((resolve) => setTimeout(resolve, BLOCK_WAIT_TIME_MS));
    continue;
  }

  currentBlock = _currentBlock;

  const logs = await publicClient.getLogs({
    event,
    fromBlock: currentBlock.number,
    toBlock: currentBlock.number,
  });

  if (logs.length > 0) {
    headLogs.push(...logs);
  }

  console.log(
    "Fetched " +
      logs.length +
      " logs from block " +
      currentBlock.number +
      " - " +
      currentBlock.transactions.length +
      " transactions"
  );
}

console.log("Done fetching head logs - fetched " + headLogs.length + " logs.");

const aggLogs = await publicClient.getLogs({
  event,
  fromBlock: startBlock.number + 1n,
  toBlock: currentBlock.number,
});

console.log(
  "Done fetching aggregated logs - fetched " + aggLogs.length + " logs."
);

const missingLogs = aggLogs.filter(
  (log) => !headLogs.find((headLog) => headLog.logIndex === log.logIndex)
);

if (missingLogs.length > 0) {
  console.log("RPC is inconsistent! Missing logs:", missingLogs);
} else {
  console.log(missingLogs);
}
