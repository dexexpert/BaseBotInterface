import { Markup } from "telegraf";
import { colHype } from "../../../services/mongo"
import axios from "axios";
function getRunningTime(createdAt: string): string {
    const now = new Date();
    const createdTime = new Date(createdAt);
    let diff = Math.floor((now.getTime() - createdTime.getTime()) / 1000); // Difference in seconds

    const days = Math.floor(diff / (24 * 3600));
    diff %= 24 * 3600;

    const hours = Math.floor(diff / 3600);
    diff %= 3600;

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${days} days ${hours} hours ${minutes} min ${seconds} sec`;
}
function getTotalTimeForBot(createdAt: string, deadAt: string): string {
    const createdTime = new Date(createdAt);
    const deadTime = new Date(deadAt);
    let diff = Math.floor((deadTime.getTime() - createdTime.getTime()) / 1000); // Difference in seconds

    const days = Math.floor(diff / (24 * 3600));
    diff %= 24 * 3600;

    const hours = Math.floor(diff / 3600);
    diff %= 3600;

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${days} days ${hours} hours ${minutes} min ${seconds} sec`;
}
const HypeBotStatus = async (ctx: any) => {
    try {
        ctx.session.state = "hBotStatus";
        const walletAddress = ctx.session.walletAddress;
        const updatedUser = await colHype.findOne({ walletAddress });
        const status = updatedUser.status;
        const userName = updatedUser.username;
        const dex = updatedUser.protocol;
        const buyCount = updatedUser.buyCount;
        const runningTime = getRunningTime(updatedUser.createdAt);
        const deadTime = getTotalTimeForBot(updatedUser.createdAt, updatedUser.deadAt)
        const amount = ctx?.session?.orderAmont;
        console.log(`HYPEbotstatus ===> User: ${userName}, Running Time: ${status !== "dead" ? (updatedUser.createdAt === 0 ? 0 : runningTime) : deadTime}` );
        await ctx.deleteMessage();
        const message = await ctx.replyWithHTML(
            `📜 Token Info:
  <code>${updatedUser.tokenAddress}</code>
   
  🎊 Mode: Micro Hype mode
  
  📈 Dex: ${dex}
  ⌛️ Bot worked: ${status !== "dead" ? (updatedUser.createdAt === 0 ? 0 : runningTime) : deadTime}
  ⏹ Bot Status :<code> ${status === "startup" ? "Bot is waiting" : (status === "alive") ? "Bot is running" : "Bot was dead"} </code>
  💹 Bot maker: ${buyCount} (buy Count: ${buyCount})

  💳 Your Deposit Wallet:
  <code>${walletAddress}</code>
  🚨 You must deposit over 2 Hype to bot wallet🚨
  
  🚀 There is no limit on the amount of HYPER you deposit, the more you add, the longer the bot will run. 🚀
  
  After sending funds, standby while we validate payment`,
            Markup.inlineKeyboard([
                // [Markup.button.callback("Start", `startMicroBot`)],
                [Markup.button.callback("Bot's Status", `hBotStatus`)],
                // [Markup.button.callback("Main Menu", "home")],
            ])
        );
        ctx.session.messageIds = [message.message_id];
    } catch (err) {
        console.log(err);
        ctx.reply(
            "There was an error processing your request. Please try again later."
        );
    }
};
// ⌛️ Bot worked: 0 min
//   💹 Bot maker: 0 (buy Count: 0, sell Count: 0)

export default HypeBotStatus;
