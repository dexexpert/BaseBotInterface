export async function Pagination(
  items: any[],
  itemsPerPage = 10,
  buttonsPerRow = 2,
  customButtons?: any[]
) {
  let currentPage = 1;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const generateItemButtons = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);

    const itemButtons: any[] = [];
    for (let i = 0; i < pageItems.length; i += buttonsPerRow) {
      const row = pageItems
        .slice(i, i + buttonsPerRow)
        .map(
          (item: {
            sport_id: any;
            id: any;
            home: { name: any };
            away: { name: any };
          }) => ({
            text: `${item.home.name} vs ${item.away.name}`,
            callback_data: `match_${item.id}_${item.sport_id}`,
          })
        );
      itemButtons.push(row);
    }

    return itemButtons;
  };

  const generatePaginationButtons = (page: number) => {
    const paginationButtons: any[] = [];
    const showFirstButton = page > 3;
    const showLastButton = page < totalPages - 2;

    if (showFirstButton) {
      paginationButtons.push({ text: "<<", callback_data: "first_page" });
    } else {
      paginationButtons.push({ text: " ", callback_data: "nowork" });
    }

    for (
      let i = Math.max(1, page - 2);
      i <= Math.min(totalPages, page + 2);
      i++
    ) {
      const buttonLabel = i === page ? `[ ${i} ]` : `${i}`;
      paginationButtons.push({ text: buttonLabel, callback_data: `page_${i}` });
    }

    if (showLastButton) {
      paginationButtons.push({ text: ">>", callback_data: "last_page" });
    } else {
      paginationButtons.push({ text: " ", callback_data: "nowork" });
    }
    return paginationButtons;
  };

  const startPagination = async (ctx: any) => {
    currentPage = 1;
    return await ctx.reply(
      `Select a match below and place your bet! (Total page : ${totalPages})`,
      {
        reply_markup: {
          inline_keyboard: [
            ...generateItemButtons(currentPage),
            generatePaginationButtons(currentPage),
            customButtons,
          ],
        },
      }
    );
  };

  const handlePageChange = async (ctx: any, page: number) => {
    try {
      currentPage = Math.min(Math.max(page, 1), totalPages);
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [
          ...generateItemButtons(currentPage),
          generatePaginationButtons(currentPage),
          customButtons,
        ],
      });
      await ctx.answerCbQuery();
    } catch (err) {
      console.log(err);
    }
  };

  return {
    startPagination,
    handlePageChange,
    getCurrentPage: () => currentPage,
    getTotalPages: () => totalPages,
  };
}
