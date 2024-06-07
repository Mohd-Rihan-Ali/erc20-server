import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import cors from "cors";
import { ABI } from "./ABI";

const app = express();
const port = 8800;

dotenv.config();

app.use(cors());

const contractAddress = process.env.CONTRACT_ADDRESS as string;
const contractABI = ABI;

const provider = new ethers.providers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
);

const contract = new ethers.Contract(contractAddress, contractABI, provider);

interface Event {
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  transactionHash: string;
}

let events: Event[] = [];

contract.on("Transfer", (from, to, value, event) => {
  console.log(`Transfer from ${from} to ${to} of ${value.toString()}`);

  events.push({
    from,
    to,
    value: value.toString(),
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});

app.get("/events", () => {
  console.log(events);

  return events;
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
