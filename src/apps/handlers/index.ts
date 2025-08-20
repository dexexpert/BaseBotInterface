import axios, { AxiosResponse } from "axios";
import { Markup } from "telegraf";

// Hyper EVM client will be imported here once we set up the EVM dependencies
// import { ethers } from "ethers";

function isValidEthereumAddress(address: string) {
  // Ethereum address validation (42 characters starting with 0x)
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumAddressRegex.test(address);
}

async function fetchAllPools(tokenAddress: string) {
  const url = `https://api.dexscreener.com/token-pairs/v1/base/${tokenAddress}`;
  try {
    const response: AxiosResponse = await axios.get(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        // origin: "https://app.hyperevm.com",
        // referer: "https://app.hyperevm.com/",
        "sec-ch-ua": `Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        // "x-api-key": "hyperevm_api.key", // This will need to be updated with actual API key
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pool data in fetchAllPools function:", error);
    return null;
  }
}

// export async function getPoolFeeAndProtocolByPairAddress(
//   tokenAddress: string,
//   pairAddress: string
// ) {
//   const pools = await fetchAllPools(tokenAddress);

//   if (pools) {
//     // Find the pool with matching poolAddress
//     const pool = pools.find(
//       (pool: any) =>
//         pool.pairAddress.toLowerCase() === pairAddress.toLowerCase()
//     );
//     let dexId = pool.dexId;
//     if (pool.dexId === "deltaswap") dexId = "deltaswap-v1";
//     else if (pool.dexId === "balancer") dexId = "balancer-v2-stable";
//     else if (pool.dexId === "solidlycom") dexId = "solidly-v3";
//     else if (pool.dexId === "rocketswap") dexId = "rocketswap-v2";
//     else if (pool.dexId === "equalizer") dexId = "scale";
//     else if (pool.dexId === "uniswap")
//       dexId = "uniswap" + pool.labels[0] !== "v3" ? "-" : "" + pool.labels[0];
//     else if (pool.dexId === "pancakeswap")
//       dexId = "pancake" + pool.labels[0] !== "v2" && "-" + pool.labels[0];
//     else if (pool.dexid === "swapbased")
//       dexId = "swapbased" + pool.labels[0] === "v2" ? "" : "-" + pool.labes[0];
//     return pool
//       ? {
//           protocol: pool.dexId,
//           version: pool.labels ? pool.labels[0] : "none",
//           dexId,
//         }
//       : null;
//   }
//   return null;
// }

export const handleWaitingTokenAddress = async (ctx: any) => {
  try {
    ctx.session.state = "walletWithdrawAmount";
    const addressInput = ctx.message.text;
    const poolName = ctx.session.poolName;
    ctx.session.tokenAddress = addressInput;
    const protocolName = ctx.session.protocolName;

    const message = await ctx.reply(
      `We are validating this token on ${ctx.session.protocolName}`
    );

    // Validate Ethereum address format
    if (!isValidEthereumAddress(addressInput)) {
      await ctx.reply(
        `Invalid token address format. Please provide a valid Ethereum address.`
      );
      await ctx.reply(
        `Enter the contract address of your token on ${ctx.session.poolName}.`
      );
      ctx.session.state = "waitingTokenAddress";
      return;
    }

    // Fetch pools for the specific DEX
    const resultPools = await fetchAllPools(addressInput);
    let poolFound = false;

    if (resultPools && resultPools.length !== 0) {
      for (const pool of resultPools) {
        const platform = pool.dexId;
        if (platform === ctx.session.poolName) {
          poolFound = true;
          break;
        }
      }
    }

    // Filter pools with minimum liquidity and HYPER pairs
    const realPools = resultPools.filter(
      (item: any) =>
        item.liquidity.usd >= 100 &&
        item.dexId === poolName &&
        (item.baseToken.address ===
          "0x4200000000000000000000000000000000000006" || // HYPER token address
          item.quoteToken.address ===
            "0x4200000000000000000000000000000000000006") // This will need to be updated with actual HYPER token address
    );

    ctx.session.realPools = realPools;

    if (!realPools || realPools.length === 0 || !poolFound) {
      await ctx.reply(`No pool found for:\n\n${addressInput}`);
      await ctx.reply(
        `Enter the contract address of your token on ${ctx.session.poolName}.`
      );
      ctx.session.state = "waitingTokenAddress";
    } else {
      await ctx.reply("Validation complete.");

      const poolItems = realPools.map((item: any) => [
        Markup.button.callback(
          `Liq: $${item.liquidity.usd.toFixed(2)} | ${item.pairAddress.slice(
            0,
            20
          )}...`, // Button name
          `poolID_${item.pairAddress.slice(0,20)}` // Callback data
        ),
      ]);
      await ctx.reply("Select a pool:", Markup.inlineKeyboard(poolItems));
    }
  } catch (err) {
    ctx.session.state = "waitingTokenAddress";
    console.log("Error in handleWaitingTokenAddress", err);
    ctx.reply(
      "There was an error processing your request. Please input address."
    );
  }
};
