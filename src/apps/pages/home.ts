import { Markup } from "telegraf";

export const Home = async (ctx: any) => {
  ctx.session.state = null;
  const tgId = ctx.from?.id.toString();
  const firstName = ctx.from?.first_name || "";
  try {
    if (Array.isArray(ctx.session.messageIds) && ctx.session.messageIds.length > 0) { await ctx.deleteMessage() }
    let welcome_msg = `👤 Hi, <b>${firstName}</b>\nWelcome to Base EVM Volume Bot!\n\n`;

    let home_msg: any;

    welcome_msg += `Experience the power of our volume bot on Base EVM. We offer tools to boost your tokens metrics!
  
  🔊 Volume: Organic and Performance volume options
  📈 Trending: Boost your Dexscreener metrics
  📊 Fresh wallets generated for buys/sells on every transaction
  💰 Get started for as low as 0.1 BASE ETH
  
  Select a Liquidity Pool below to get started 🚀`;
    home_msg = await ctx.replyWithHTML(
      welcome_msg,
      Markup.inlineKeyboard([
        [Markup.button.callback("Aerodrome", "pool_Aerodrome")],
        [Markup.button.callback("Uniswap", "pool_Uniswap")],
        [Markup.button.callback("PancakeSwap", "pool_PancakeSwap")],
        [Markup.button.callback("Alien Base", "pool_AlienBase")],
        [Markup.button.callback("Balancer", "pool_Balancer")],
        [Markup.button.callback("SwapBased", "pool_SwapBased")],
        [Markup.button.callback("BaseSwap", "pool_BaseSwap")],
        [Markup.button.callback("SushiSwap", "pool_SushiSwap")],
        [Markup.button.callback("Omni Exchange", "pool_OmniExchange")],
        [Markup.button.callback("Solidly", "pool_Solidly")],
        [Markup.button.callback("iZiSwap", "pool_iZiSwap")],
        [Markup.button.callback("RocketSwap", "pool_RocketSwap")],
        [Markup.button.callback("DeltaSwap", "pool_DeltaSwap")],
        [Markup.button.callback("Equalizer", "pool_Equalizer")],
        [Markup.button.callback("Infusion", "pool_Infusion")],
        [Markup.button.callback("💸 Referrals", "Referrals")],
        [Markup.button.callback("🌎 Support", "help")],
      ])
    );

    ctx.session.messageIds = [home_msg.message_id];


  } catch (error) {
    console.error("⚠️ Failed to handle start command:", error);
    ctx.reply(
      "There was an error processing your request to start. Please try again later."
    );
  }
};
