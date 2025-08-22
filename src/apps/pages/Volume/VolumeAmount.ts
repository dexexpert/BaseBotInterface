import { Markup } from "telegraf";

const VolumeAmount = async (ctx: any, speed: Number) => {
  try {
    ctx.session.speed = speed;
    ctx.session.state = "volume_amount";
    const message = await ctx.reply(`Select the max Hyper amount per swap bundle from the options below:

You can also input a custom amount over 0.1

The bot will trade +-25% of this value.
`, Markup.inlineKeyboard([
      [Markup.button.callback("0.1 ETH", `amountVolume_0.1`)],
      [Markup.button.callback("0.2 ETH", `amountVolume_0.2`)],
      [Markup.button.callback("0.3 ETH", `amountVolume_0.3`)],
      [Markup.button.callback("0.5 ETH", `amountVolume_0.5`)],
      [Markup.button.callback("Main Menu", "home")],
    ]));
    //   ctx.session.messageIds = [message.message_id];
  } catch (err) {
    console.log(err);
    ctx.reply(
      "There was an error processing your request. Please try again later."
    );
  }
};

export default VolumeAmount;
