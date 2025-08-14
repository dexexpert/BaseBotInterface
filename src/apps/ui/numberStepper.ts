import { Context } from "telegraf";

export const startNumberStepper = (
  bot: any,
  ctx: any,
  minNumber: number,
  maxNumber: number
): Promise<number> => {
  return new Promise((resolve) => {
    let currentNumber = minNumber;

    const generateKeyboard = (currentNumber: number) => [
      [
        ...(currentNumber > minNumber
          ? [{ text: "<<", callback_data: "decrement" }]
          : [{ text: "MIN", callback_data: "noworks" }]),
        { text: currentNumber.toString(), callback_data: "value" },
        ...(currentNumber < maxNumber
          ? [{ text: ">>", callback_data: "increment" }]
          : [{ text: "MAX", callback_data: "noworks" }]),
      ],
      [{ text: "Confirm", callback_data: "confirm" }],
    ];

    // Initial message with stepper
    ctx.reply(`Number stepper bot!`, {
      reply_markup: {
        inline_keyboard: generateKeyboard(currentNumber),
      },
    });

    // Handle increment action
    bot.action("increment", async (ctx: any) => {
      if (currentNumber < maxNumber) currentNumber++;
      ctx.editMessageText(`Number stepper bot!`, {
        reply_markup: {
          inline_keyboard: generateKeyboard(currentNumber),
        },
      });
    });

    // Handle decrement action
    bot.action("decrement", async (ctx: any) => {
      if (currentNumber > minNumber) currentNumber--;
      ctx.editMessageText(`Number stepper bot!`, {
        reply_markup: {
          inline_keyboard: generateKeyboard(currentNumber),
        },
      });
    });

    // Handle confirm action
    bot.action("confirm", (ctx: any) => {
      ctx.reply(`The selected number is: ${currentNumber}`);
      resolve(currentNumber); // Return the selected number
    });
  });
};
