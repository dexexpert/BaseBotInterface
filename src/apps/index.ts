import { Telegraf, Markup, Context } from "telegraf";
// import { colUsers } from "../services/mongo";
import { logUserAction } from "../utils/logUserAction";
import { Home } from "./pages/home";

// Define session interface
interface CustomSession {
  state?: string | null;
  tokenAddress?: string | null;
  poolName? : string | null
  messageIds?: number[];
}

interface SessionContext extends Context {
  session: CustomSession;
}

const MainCommands = (bot: Telegraf<SessionContext>) => {
  // Start command
  bot.start(async (ctx) => {
    ctx.session.state = "";
    await Home(ctx);
  });

  // Help command
  bot.help(async (ctx) => {
    ctx.replyWithHTML(
      `Here are the commands you can use:\n\n` +
        `/start - Start the bot for Volume\n` +
        `/help - Get this help message\n`,
      Markup.inlineKeyboard([
        [Markup.button.callback("🏠 Go to Home", "home")],
        [Markup.button.callback("💬 Contact Support", "support")],
      ])
    );
  });

  // Setting bot commands
  bot.telegram.setMyCommands([
    {
      command: "start",
      description: "Start the bot for Volume",
    },
    { command: "help", description: "Get a list of available commands" },
  ]);
};

export default MainCommands;
