const SelectPool = async (poolName: string, ctx: any) => {
  try {
    ctx.session.state = "waitingTokenAddress";
    ctx.session.poolName = poolName;
    const protocolName = ctx.session.protocolName;
    const message = await ctx.reply(`Enter the contract address of your token on ${protocolName}`);
    ctx.session.messageIds = [message.message_id];
  } catch (err) {
    console.log(err);
    ctx.reply(
      "There was an error processing your request. Please try again later."
    );
  }
};

export default SelectPool;
