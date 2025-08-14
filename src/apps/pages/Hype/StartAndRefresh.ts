import { Markup } from "telegraf";
import { colHype } from "../../../services/mongo"
import axios from "axios";

const StartAndRefresh = async (ctx: any) => {
    try {
        ctx.session.state = "StartAndRefreshForHype";
        const walletAddress = ctx.session.walletAddress;
        const dex = ctx.session.protocolName;
        const updatedUser = await colHype.findOne({ walletAddress });
       
        const message = await ctx.replyWithHTML(
            `You're almost ready to kickstart your Volume Boost! Here's your order summary:
  
  🎊 Mode: Micro Hype mode

  📈 Dex: ${dex}
  📜 Token Info:
  <code>${updatedUser.tokenAddress}</code>

  💳 Your Deposit Wallet:
  <code>${walletAddress}</code>
  
  🚀 There is no limit on the amount of HYPER you deposit, the more you add, the longer the bot will run. 🚀
  
  After sending funds, standby while we validate payment and start the bot.`, Markup.inlineKeyboard([
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

export default StartAndRefresh;
