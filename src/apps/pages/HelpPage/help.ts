import { Markup } from "telegraf";

export const help = async (ctx: any) => {
  ctx.session.state = "help";
  const tgId = ctx.from?.id.toString();
  const firstName = ctx.from?.first_name || "";
  try {
    await ctx.deleteMessage();
    let welcome_msg = `👋 Hi, <b>${firstName}</b>\nWelcome to Hyper Volume Bot!\n\n`;

    welcome_msg += `If you have any questions or inquiries, feel free to contact @onlycallmedev\n Thank you!`;
    let home_msg = await ctx.replyWithHTML(
      welcome_msg,
      Markup.inlineKeyboard([[Markup.button.callback("🏠 Go to Home", "home")]])
    );

    ctx.session.messageIds = [home_msg.message_id];
  } catch (error) {
    console.error("⚠️ Failed to handle help command:", error);
    ctx.reply(
      "There was an error processing your request to help. Please try again later."
    );
  }
};
