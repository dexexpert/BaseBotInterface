import { Telegraf, Context, session } from "telegraf";
import { BETTING_BOT_TOKEN } from "./config";
import MainCommands from "./apps";
import Actions from "./apps/actions";
import express from "express";
import axios from "axios";

const app = express();
const PORT = 3006;
app.use(express.json());
const SECOND_BACKEND_URL = "http://localhost:4000/api";
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Endpoint to create a wallet and notify the second backend
app.post("/api/create-wallet", async (req, res) => {
  const { walletAddress, privateKey, params } = req.body;

  try {
    console.log("alert created wallet")
    // Notify the Second Backend about the new wallet
    await axios.post(`${SECOND_BACKEND_URL}/monitor-wallet`, {
      walletAddress,
      privateKey,
      params,
    });

    console.log("Wallet created and sent to second backend:", walletAddress);
    res.status(200).send("Wallet created and monitoring started.");
  } catch (error) {
    console.error("Error notifying second backend:", error);
    res.status(500).send("Failed to notify second backend.");
  }
});

// Endpoint to receive alerts from the Second Backend
app.post("/api/alert", async (req, res) => {
  const { walletAddress, amount } = req.body;

  console.log(`Alert received: Wallet ${walletAddress} received ${amount}`);

  // Notify the user via Telegram
  try {
    // await bot.telegram.sendMessage(
    //   CHAT_ID,
    //   `Wallet ${walletAddress} received ${amount} tokens. Verifying...`
    // );
    console.log("Alert sent to user.");

    // Perform checks (add your verification logic here)
    const isValid = true; // Replace with actual verification logic

    if (isValid) {
      // Notify the Second Backend to proceed with the swap
      await axios.post(`${SECOND_BACKEND_URL}/proceed-swap`, {
        walletAddress,
        amount,
      });
      console.log("Approval sent to Second Backend.");
    }

    res.status(200).send("Alert processed.");
  } catch (error) {
    console.error("Error processing alert:", error);
    res.status(500).send("Failed to process alert.");
  }
});
// Define session interface
interface CustomSession {
  state?: string | null;
  messageIds?: number[];
  tokenAddress?: string | null;
}

interface SessionContext extends Context {
  session: CustomSession;
}

const volume_bot = new Telegraf<SessionContext>(BETTING_BOT_TOKEN);

// Use session middleware
volume_bot.use(session({ defaultSession: (): CustomSession => ({ state: "" }) }));

// Setup commands and actions
MainCommands(volume_bot);
Actions(volume_bot);
app.listen(PORT, () => {
  console.log(`Bot backend listening on port ${PORT}`);
});
// Export bot
export default volume_bot;
