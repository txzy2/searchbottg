async function mainMessage(bot, chat_id, username, message_id) {
  bot.sendMessage(
    chat_id,
    `<i><b>✌🏼 Привет ${username}</b>! Давай помогу тебе подобрать кроссовки и одежду на маркетплейсе <b><a href="https://www.basketshop.ru/">Basketshop</a></b></i>.\n\n` +
      `<i><b>🔗 Дополнительные ссылки:</b></i>\n` +
      `<i><b>➖ GitHub: </b><a href="https://github.com/kamaeff/searchbottg">Searchbottg</a></i>\n` +
      `<i><b>➖ Разработчик: </b><a href="http://94.228.124.88:3000/">KamaeffPage</a></i>`,
    {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: '🏀 Basketshop',
              web_app: {url: 'https://www.basketshop.ru/'},
            },
          ],
          [
            {text: '👨🏼Мужчина', callback_data: 'man'},
            {text: '👩🏼‍🦰 Женщина', callback_data: 'woman'},
          ],
        ],
      }),
    }
  )
}

module.exports = {
  mainMessage,
}
