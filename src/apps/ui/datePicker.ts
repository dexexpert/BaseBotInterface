import Calendar from "telegram-inline-calendar";
import { Telegraf } from "telegraf";

const CalendarUI = (bot: Telegraf) => {
  const calendar: typeof Calendar = new Calendar(bot, {
    date_format: "DD-MM-YYYY",
    language: "en",
    bot_api: "telegraf",
  });

  const startCalendar = async (ctx: any) => {
    return calendar.startNavCalendar(ctx.message);
  };

  const handleCalendarClick = async (ctx: any) => {
    if (
      ctx.callbackQuery?.message?.message_id ===
      calendar.chats.get(ctx.callbackQuery.message.chat.id)
    ) {
      const selectedDate = calendar.clickButtonCalendar(ctx.callbackQuery);
      if (selectedDate !== -1) {
        await bot.telegram.sendMessage(
          ctx.callbackQuery.message.chat.id,
          `You selected: ${selectedDate}`
        );
        const [day, month, year] = selectedDate.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.toUTCString();
        // return selectedDate;
      }
    }
    return null;
  };

  return { startCalendar, handleCalendarClick };
};

export default CalendarUI;
