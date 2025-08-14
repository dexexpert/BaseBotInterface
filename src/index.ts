import volume_bot from "./volumebot";
import { ConnectDB } from "./services/mongo";
import fs from "fs";
import { InputFile } from "telegraf/typings/core/types/typegram";

async function setBotDescription() {
  try {
    // Set the long description (bio)
    await volume_bot.telegram.setMyDescription(
      "Supercharge your Base tokens! This Telegram bot boosts trading volume affordably and introduces BASE - BASE EVM's first burn feature. Burn tokens easily with micro-transactions, open to all. Fast, low-cost, and powerful"
    );

    // Set the short description
    await volume_bot.telegram.setMyShortDescription(
      "BASEBooster Bot."
    );

    console.log("Description and short description set successfully!");
  } catch (error) {
    console.error("Error setting description:", error);
  }
}
// Catch async errors (Promise)
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 [unhandledRejection]', reason);
  // Optional: log or send to alerting service
});

// Catch sync errors
process.on('uncaughtException', (error) => {
  console.error('🔴 [uncaughtException]', error);
  // Optional: clean up resources
});
// async function setBotProfilePhoto() {
//   try {
//     // Upload profile picture
//     // const photo = fs.readFileSync("F:/FA_ARENA/logo.jpg");
//     await bet_bot.telegram.setMyProfilePhoto({
//       source: "F:/FA_ARENA/logo.jpg",
//     });

//     console.log("Profile picture set successfully!");
//   } catch (error) {
//     console.error("Error setting profile picture:", error);
//   }
// }

const StartBot = async () => {
  await ConnectDB();

  console.log("🤖 Bot is running...");
  await setBotDescription();
  // await setBotProfilePhoto();
  volume_bot.launch().then(() => {
    console.log("BASE Booster started");
  });

  process.once("SIGINT", () => volume_bot.stop("SIGINT"));
  process.once("SIGTERM", () => volume_bot.stop("SIGTERM"));
};

StartBot();