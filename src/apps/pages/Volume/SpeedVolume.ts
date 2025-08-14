import { Markup } from "telegraf";

const SpeedVolume = async (ctx: any) => {
    try {
      ctx.session.state = "volume_speed"
      const message = await ctx.reply(`Choose transaction speed for: \n${ctx.session.tokenAddress}`, Markup.inlineKeyboard([
        [Markup.button.callback("1 tx per minute", "speedVolume_1")],
        [Markup.button.callback("2 tx per minute", "speedVolume_2")],
        [Markup.button.callback("4 tx per minute", "speedVolume_4")],
        [Markup.button.callback("Main menu", "home")],
      ]))
    } catch (err) {
      console.log(err);
      ctx.reply(
        "There was an error processing your request. Please try again later."
      );
    }
  };
  
  export default SpeedVolume;
  