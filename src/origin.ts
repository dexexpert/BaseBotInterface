// import { Telegraf, Markup, Context, session } from "telegraf";
// import { BETTING_BOT_TOKEN } from "./config";
// import { colUsers } from "./services/mongo";
// import { logUserAction } from "./utils/logUserAction";

// import { Home } from "./apps/pages/home";
// import {
//   ConnectWalletHandler,
//   HandleWalletAddress,
//   ResetWalletAddress,
// } from "./apps/pages/connectWallet";
// import { WalletInfo } from "./apps/pages/walletInfo";
// import {
//   HandleMinting,
//   //  MintNFT
// } from "./apps/pages/mintNFT";
// import { Library } from "./apps/pages/library";
// import { CreateCollectionHandler } from "./apps/pages/createCollection";

// interface CustomSession {
//   state?: string | null;
//   messageIds?: number[];
// }

// interface SessionContext extends Context {
//   session: CustomSession;
// }

// const minter_bot = new Telegraf<SessionContext>(BETTING_BOT_TOKEN);

// minter_bot.use(
//   session({ defaultSession: (): CustomSession => ({ state: "" }) })
// );

// const deletePreviousMessages = async (ctx: SessionContext) => {
//   if (ctx.session?.messageIds) {
//     for (const messageId of ctx.session.messageIds) {
//       try {
//         await ctx.deleteMessage(messageId);
//       } catch (error) {
//         console.error("⚠️ Failed to delete message:", error);
//       }
//     }
//     ctx.session.messageIds = [];
//   }
// };

// minter_bot.start(async (ctx) => {
//   const tgId = ctx.from?.id.toString();
//   const username = ctx.from?.username || "";
//   const firstName = ctx.from?.first_name || "";
//   try {
//     ctx.session.state = null;
//     await deletePreviousMessages(ctx);

//     let welcome_msg = `👋 Hi, <b>${firstName}</b>\nWelcome to LaunchB0xx NFT Minting!\n\n`;

//     const user = await colUsers.findOne({ tgId });
//     let start_msg: any;

//     if (user) {
//       const walletAddress = user.account || "";
//       welcome_msg += `🎉 Your Sui wallet address is: <code>${walletAddress}</code>`;
//       start_msg = await ctx.replyWithHTML(
//         welcome_msg,
//         Markup.inlineKeyboard([
//           [
//             Markup.button.callback("🔗 Reset Wallet", "connectWallet"),
//             Markup.button.callback("💰 Wallet Info", "walletInfo"),
//           ],
//           [
//             Markup.button.callback("🪄 Create Collection", "createCollection"),
//             Markup.button.callback("🚀 Mint NFTs", "mintNFT"),
//           ],
//           [
//             Markup.button.callback("🦄 Library", "library"),
//             Markup.button.callback("🔍 View Txns", "viewTxns"),
//           ],
//           [
//             Markup.button.url("❔ FAQ", "https://launchb0xx.xyz"),
//             Markup.button.callback("💬 Support", "support"),
//           ],
//         ])
//       );
//     } else {
//       welcome_msg += `🔗 No wallet connected yet. Please connect your seed wallet.`;
//       start_msg = await ctx.replyWithHTML(
//         welcome_msg,
//         Markup.inlineKeyboard([
//           [Markup.button.callback("🔗 Connect Wallet", "connectWallet")],
//           [
//             Markup.button.url("❔ FAQ", "https://launchb0xx.xyz"),
//             Markup.button.callback("💬 Support", "support"),
//           ],
//         ])
//       );
//     }

//     ctx.session.messageIds = [start_msg.message_id];
//     logUserAction(ctx, "🤖 Started the bot");
//   } catch (error) {
//     console.error("⚠️ Failed to handle start command:", error);
//     ctx.reply(
//       "There was an error processing your request to start. Please try again later."
//     );
//   }
// });

// minter_bot.on("callback_query", async (ctx: any) => {
//   const tgId = ctx.from?.id.toString();

//   const data = ctx.callbackQuery.data;
//   const [action, actionName, confirmedData] = ctx.callbackQuery.data.split("_");

//   if (data && data.startsWith("home")) {
//     await Home(ctx);
//   } else if (data && data.startsWith("connectWallet")) {
//     await ConnectWalletHandler(tgId, ctx);
//   } else if (data && data.startsWith("resetWallet")) {
//     await ResetWalletAddress(ctx);
//   } else if (data && data.startsWith("walletInfo")) {
//     await WalletInfo(tgId, ctx);
//   } else if (data && data.startsWith("createCollection")) {
//     await CreateCollectionHandler(tgId, ctx);
//   } else if (data && data.startsWith("mintNFT")) {
//     await HandleMinting(tgId, ctx);
//   } else if (data && data.startsWith("library")) {
//     await Library(tgId, ctx);
//   }
// });

// minter_bot.on("message", async (ctx) => {
//   const tgId = ctx.from?.id.toString();
//   if (
//     ctx.session.state === "inputPriKey" ||
//     ctx.session.state === "replacePriKey"
//   ) {
//     await HandleWalletAddress(tgId, ctx);
//   } else if (ctx.session.state === "uploadFiles") {
//   } else if (ctx.session.state === "mintStartDate") {
//   } else if (ctx.session.state === "inputColAddr") {
//     // await MintNFT(tgId, ctx);
//   } else {
//     await ctx.reply(
//       "❌ I wasn't expecting that input. Please use the buttons to navigate."
//     );
//   }
// });

// //
// //// Bot Helpers
// //

// minter_bot.telegram.setMyCommands([
//   {
//     command: "start",
//     description: "Start the bot for minting NFT on Aptos",
//   },
//   { command: "help", description: "Get a list of available commands" },
// ]);

// minter_bot.help(async (ctx) => {
//   ctx.replyWithHTML(
//     `Here are the commands you can use:\n\n` +
//       `/start - Start the bot for minting NFT on Aptos\n` +
//       `/help - Get this help message\n`,
//     Markup.inlineKeyboard([
//       [Markup.button.callback("🏠 Go to Home", "home")],
//       [Markup.button.callback("💬 Contact Support", "support")],
//     ])
//   );
// });

// export default minter_bot;
