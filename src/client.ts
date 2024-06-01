import * as dotenv from "dotenv";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

dotenv.config();

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC),
});
