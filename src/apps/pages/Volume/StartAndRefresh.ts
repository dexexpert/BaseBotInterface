import { Markup } from "telegraf";
import { colVolume, colRank } from "../../../services/mongo"
import axios from "axios";

const StartAndRefresh = async (ctx: any) => {
    try {
        ctx.session.state = "StartAndRefreshForVolume";
        const walletAddress = ctx.session.walletAddress;
        const updatedUser = await colVolume.findOne({ walletAddress });

        const maxTxAmount = updatedUser.maxTxAmount;
        const txsPerMinute = updatedUser.txsPerMinute;
        const amount = ctx?.session?.orderAmont;
        const dex = updatedUser.protocol;

        const message = await ctx.replyWithHTML(
            `You're almost ready to kickstart your Volume Boost! Here's your order summary:
  
  🎊 Mode: Micro Volume mode

  📈 Dex: ${dex}
  📜 Token Info:
  <code>${updatedUser.tokenAddress}</code>
  
  🔥Send a minimum of  <code>${(txsPerMinute * Number(amount) * 1.5).toFixed(2)}</code>  Hype to this deposit wallet address:
  💳 Your Deposit Wallet:
  <code>${walletAddress}</code>
  
  🚀 There is no limit on the amount of BASE ETH you deposit, the more you add, the longer the bot will run. 🚀
  
  After sending funds, standby while we validate payment and start the bot.`, Markup.inlineKeyboard([
                // [Markup.button.callback("Start", `startMicroBot`)],
                [Markup.button.callback("Bot's Status", `vBotStatus`)],
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

export default StartAndRefresh;
