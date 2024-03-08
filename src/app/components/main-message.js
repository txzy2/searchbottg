async function mainMessage(bot, chat_id, username) {
  bot.sendMessage(
    chat_id,
    `<b>✌🏼 Yo <i>${username}</i></b>! Я помогу тебе подобрать кроссовки по твоему запросу на маркетплейсе <i><a href="https://www.basketshop.ru/">Basketshop</a></i>.\n\n<i>💭 Давай для начала выберем твой пол.</i>`,
    {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: 'Basketshop',
              web_app: {url: 'https://www.basketshop.ru/'},
            },
          ],
          [
            {text: 'Мужские', callback_data: 'man'},
            {text: 'Женские', callback_data: 'woman'},
          ],
        ],
      }),
    },
  )
}

module.exports = {
  mainMessage,
}
