import { Telegraf, Context, Markup } from "telegraf";
import { Home } from "./pages/home";
import SelectPool from "./pages/Pool/SelectPool";
import { handleWaitingTokenAddress } from "./handlers";
import { help } from "./pages/HelpPage/help";
import Volume from "./pages/Volume/Volume";
import SpeedVolume from "./pages/Volume/SpeedVolume";

import VolumeAmount from "./pages/Volume/VolumeAmount";
import OrderCreateVolume, {
  handleVolumeAmount,
} from "./pages/Volume/OrderCreateVolume";
import OrderCreateRank from "./pages/Rank/OrderCreateRank";
import OrderCreateHype from "./pages/Hype/OrderCreateHype";

import VolumeBotStatus from "./pages/Volume/VolumeBotStatus";
import RankBotStatus from "./pages/Rank/RankBotStatus";
import HypeBotStatus from "./pages/Hype/HypeBotStatus";

// Define session interface
interface CustomSession {
  state?: string | null;
  tokenAddress?: string | null;
  poolName?: string | null;
  messageIds?: number[];
  paginationInstances?: any;
}

interface SessionContext extends Context {
  session: CustomSession;
}

function toLowercaseName(name: string): string {
  const mappings: { [key: string]: string } = {
    Aerodrome: "aerodrome",
    Uniswap:"uniswap",
    PancakeSwap:"pancakeswap",
    AlienBase:"alien-base",
    Balancer:"balancer",  //balancer-v2-stable
    SwapBased:"swapbased",
    BaseSwap:"baseswap",
    SushiSwap:"sushiswap",
    Solidly:"solidlycom",  // solidly-v3
    iZiSwap:"iziswap",
    RocketSwap:"rocketswap", // rocketswap-v2
    DeltaSwap:"deltaswap", // deltaswap-v1
    Equalizer:"equalizer",  //scale
    Infusion:"infusion"   //infusion
  };

  return mappings[name] || name; // Return mapped value or original if not found
}

const Actions = (bot: Telegraf<SessionContext>) => {
  // ✅ Add the error handler here
  bot.catch((err, ctx) => {
    console.error("Telegram bot error:", err);
  });
  bot.on("callback_query", async (ctx: any) => {
    const tgId = ctx.from?.id.toString();
    const data = ctx.callbackQuery.data;

    if (data.startsWith("home")) {
      await Home(ctx);
    } else if (data.startsWith("help")) {
      await help(ctx);
    } else if (data.startsWith("pool_")) {
      const dataResult = data.split("pool_");
      const poolName = dataResult[1];
      ctx.session.protocolName = poolName;
      await SelectPool(toLowercaseName(poolName), ctx);
    } else if (data.startsWith("poolID_")) {
      const dataResult = data.split("poolID_");
      const poolID = dataResult[1];
      const pools = ctx.session.realPools;
      const selectedPool = pools.filter((item: any) => item.pairAddress.slice(0,20) == poolID);
      ctx.session.selectedPool = selectedPool;
      await Volume(ctx);
    } else if (data.startsWith("volume")) {
      await SpeedVolume(ctx);
    } else if (data.startsWith("speedVolume_")) {
      const dataResult = data.split("speedVolume_");
      const speedTx = dataResult[1];
      await VolumeAmount(ctx, Number(speedTx));
    } else if (data.startsWith("amountVolume_")) {
      const dataResult = data.split("amountVolume_");
      const amountTx = dataResult[1];
      await OrderCreateVolume(ctx, Number(amountTx));
    } else if (data.startsWith("vBotStatus")) {
      await VolumeBotStatus(ctx);
    } else if (data.startsWith("rank")) {
      await OrderCreateRank(ctx);
    } else if (data.startsWith("rBotStatus")) {
      await RankBotStatus(ctx);
    } else if (data.startsWith("hype")) {
      await OrderCreateHype(ctx);
    } else if (data.startsWith("hBotStatus")) {
      await HypeBotStatus(ctx);
    } else {
      await ctx.reply(
        "Coming Soon",
        Markup.inlineKeyboard([
          [Markup.button.callback("🏠 Go to Home", "home")],
        ])
      );
    }
  });

  // Handle incoming messages
  bot.on("message", async (ctx: any) => {
    const tgId = ctx.from?.id.toString();

    if (ctx.session.state === "waitingTokenAddress") {
      await handleWaitingTokenAddress(ctx);
    } else if (ctx.session.state === "volume_amount") {
      await handleVolumeAmount(ctx);
    } else {
      await ctx.reply(
        "❌ I wasn't expecting that input. Please use the buttons to navigate."
      );
    }
  });
};

export default Actions;
