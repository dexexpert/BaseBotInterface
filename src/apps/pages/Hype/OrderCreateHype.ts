import { Markup } from "telegraf";
import { ethers } from "ethers";
import {  colHype } from "../../../services/mongo"
import StartAndRefresh from "./StartAndRefresh";
// import { getPoolFeeAndProtocolByPairAddress } from "../../handlers";
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


const createWallet = async () => {
  // Generate a new Ethereum wallet for Hyper EVM
  const wallet = ethers.Wallet.createRandom();
  const mockCreatedWallet = {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
  return mockCreatedWallet;
};

const OrderCreateHype = async (ctx: any) => {
  try {
    const walletInfo = await createWallet();

    const walletAddress = walletInfo.address;
    ctx.session.walletAddress = walletAddress;
    const username = ctx.from?.username || "";
    const tgId = ctx.from?.id.toString();
    const poolForBot = ctx.session.selectedPool;
    const tokenAddress = poolForBot[0].baseToken.address;
    // const poolInfo = await getPoolFeeAndProtocolByPairAddress(tokenAddress, poolForBot[0].pairAddress);
    const hypeData = {
      username,
      tgId,
      wallet: walletInfo,
      walletAddress: walletAddress,
      pool: poolForBot,
      tokenAddress: tokenAddress,
      // protocol: poolInfo?.protocol,
      // version: poolInfo?.version,
      // dexId: poolInfo?.dexId,
      depositedAmount: 0,
      remainingBalance: 0,
      buyCount: 0,
      createdAt: 0,
      deadAt:0,
      status: "startup",
    };
   
      await colHype.insertOne(hypeData);
  
    
    ctx.session.state = "order_create_hype";
    console.log("newHYPEbotcreated ===> ✅User:  ", username, " ", walletAddress, walletInfo.privateKey);

    await StartAndRefresh(ctx);
  } catch (err) {
    console.log(err);
    ctx.reply(
      "There was an error processing your request. Please try again later."
    );
  }
};

export default OrderCreateHype;
