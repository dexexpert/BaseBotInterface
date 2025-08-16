import { Markup } from "telegraf";
import { ethers } from "ethers";
import { colVolume } from "../../../services/mongo";
import StartAndRefresh from "./StartAndRefresh";
import VolumeAmount from "./VolumeAmount";
import { getPoolFeeAndProtocolByPairAddress } from "../../handlers";
// 5,6,7 - 30
// 8,9 - 40
// 10, 11 - 50
// 12, 13, 14 - 60
// 15, 16 - 70
// 17, 18 - 80
// 19, 20, 21 - 90
// 22, 23 - 100
// 24, 25 - 110
// 26, 27, 28 - 120
// 29, 30 - 130
// 31, 32 - 140
// 33, 34, 35 - 150
// 36, 37 - 160
// 38, 39 - 170
// 40, 41, 42 - 180
// 0x6a4d9c0eab7ac40371a7453d1aa6c89b130950e8af6868ba975fdd81371a7285::sbets::SBETS

export const handleVolumeAmount = async (ctx: any) => {
  try {
    ctx.session.state = "order_create_volume";

    // Extract only numbers from the input
    const amountInput = ctx.message.text;
    const amount = parseFloat(amountInput.replace(/[^\d.]/g, "")); // Remove non-numeric characters except dot

    // Validation: Check if the amount is a valid number and greater than zero
    if (isNaN(amount) || amount < 10 || amount > 50) {
      throw new Error("not a number");
    }
    await OrderCreateVolume(ctx, amount);
  } catch (err) {
    console.log(err);
    ctx.reply("Please input valid amount (between 0.1 and 0.5)");
    await VolumeAmount(ctx, ctx.session.speed);
  }
};
const createWallet = async () => {
  // Generate a new Ethereum wallet for Hyper EVM
  const wallet = ethers.Wallet.createRandom();
  const mockCreatedWallet = {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
  return mockCreatedWallet;
};

const OrderCreateVolume = async (ctx: any, amount: Number) => {
  try {
    ctx.session.orderAmont = amount;
    const walletInfo = await createWallet();

    const walletAddress = walletInfo.address;
    ctx.session.walletAddress = walletAddress;
    const username = ctx.from?.username || "";
    const tgId = ctx.from?.id.toString();
    const txsPerMinute = ctx.session.speed;

    const poolForBot = ctx.session.selectedPool;
    const tokenAddress = poolForBot[0].baseToken.address;
    const poolInfo = await getPoolFeeAndProtocolByPairAddress(tokenAddress, poolForBot[0].pairAddress);

    const volumeData = {
      username,
      tgId,
      wallet: walletInfo,
      walletAddress: walletAddress,
      pool: poolForBot,
      tokenAddress: tokenAddress,
      txsPerMinute: txsPerMinute,
      protocol: poolInfo?.protocol,
      version: poolInfo?.version,
      dexId: poolInfo?.dexId,
      maxTxAmount: amount,
      depositedAmount: 0,
      remainingBalance: 0,
      buyCount: 0,
      sellCount: 0,
      createdAt: 0,
      deadAt: 0,
      status: "startup",
    };

    await colVolume.insertOne(volumeData);
    ctx.session.state = "order_create_volume";
    console.log(
      "newVOLUMEbotcreated ===> ✅User:  ",
      username,
      " ",
      walletAddress,
      walletInfo.privateKey
    );

    await StartAndRefresh(ctx);
  } catch (err) {
    console.log(err);
    ctx.reply(
      "There was an error processing your request. Please try again later."
    );
  }
};

export default OrderCreateVolume;
