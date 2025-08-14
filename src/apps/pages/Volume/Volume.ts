import { Markup } from "telegraf";

const Volume = async (ctx: any) => {
  try {
    ctx.session.state = "bot_method"
    await ctx.reply(
      `➡️ Volume: Preset package configurations

💹 Custom Volume: Tailor your boost by selecting your preferred input, and the bot will provide you with the minimum deposit amount required to begin. This initial deposit will fuel your boost for the minimum time. For extended operation, simply increase your deposit beyond the minimum. The more funds you add, the longer the package will operate.

👤 Rank bot: Boost your metrics to help improve your Dexscreener ranking.  Buy only rank bot increases your holder account.

Keep in mind some key elements that influence the effectiveness of your boost:

💧 Liquidity: The availability of assets for trading affects how well your boost can perform.

📈 Token Price Movement: Both the starting and ending prices of the token play a role in the outcome of your boost`,
      Markup.inlineKeyboard([
        [Markup.button.callback("💹Volume", `volume`)],
        [Markup.button.callback("👤Rank bot", `rank`)],
        [Markup.button.callback("💨Hype bot", `hype`)],
        [Markup.button.callback("Main Menu", "home")],
      ])
    );

    // const message = await ctx.reply(`Choose transaction speed for: \n${ctx.session.tokenAddress}`, Markup.inlineKeyboard([
    //   [Markup.button.callback("1 tx per minute", "speed_1")],
    //   [Markup.button.callback("3 tx per minute", "speed_3")],
    //   [Markup.button.callback("6 tx per minute", "speed_6")],
    //   [Markup.button.callback("Main menu", "home")],
    // ]))
  } catch (err) {
    console.log(err);
    ctx.reply(
      "There was an error processing your request. Please try again later."
    );
  }
};

export default Volume;
