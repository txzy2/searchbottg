async function sendSneakerInfo(chatId, i, bot, userStorage) {
  const currentIndex = i + 1;
  const totalSneakers = userStorage[chatId].sneakers.length;
  bot.sendPhoto(chatId, userStorage[chatId].sneakers[i].imageUrl, {
    caption:
      `Кроссовки: <i>${userStorage[chatId].sneakers[i].title}</i>\n\n` +
      `<i>➖ Бренд:</i> ${userStorage[chatId].search}\n` +
      `<i>➖ Пол:</i> ${userStorage[chatId].gender}\n\n` +
      `<i>💸 Цена:</i> <code>${userStorage[chatId].sneakers[i].price}</code>`,
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "<<", callback_data: "prev_btn" },
          { text: `${currentIndex}/${totalSneakers}`, callback_data: "total" },
          { text: ">>", callback_data: "next_btn" },
        ],
        [{ text: "🏠 Выход в главное меню", callback_data: "home" }],
      ],
    }),
  });
}

async function updateSneakerInfo(chatId, i, bot, userStorage, messageId) {
  const currentIndex = i + 1;
  const totalSneakers = userStorage[chatId].sneakers.length;
  bot.editMessageMedia(
    {
      type: "photo",
      media: userStorage[chatId].sneakers[i].imageUrl,
      caption:
        `<b>👟 Кроссовки:</b> <i>${userStorage[chatId].sneakers[i].title}</i>\n\n` +
        `<i>➖ Бренд:</i> ${userStorage[chatId].search}\n` +
        `<i>➖ Пол:</i> ${userStorage[chatId].gender}\n\n` +
        `<i>💸 Цена:</i> <code>${userStorage[chatId].sneakers[i].price}</code> руб`,
      parse_mode: "HTML",
    },
    {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: "<<", callback_data: "prev_btn" },
            {
              text: `${currentIndex}/${totalSneakers}`,
              callback_data: "total",
            },
            { text: ">>", callback_data: "next_btn" },
          ],
          [{ text: "🏠 Выход в главное меню", callback_data: "home" }],
        ],
      }),
    },
  );
}

module.exports = {
  sendSneakerInfo,
  updateSneakerInfo,
};
