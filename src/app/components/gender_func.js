const gender_option = async (bot, msg, userStorage) => {
  bot.editMessageText(
    `✌🏼 <b><i>${msg.message.chat.first_name}</i></b> ты выбрал ${userStorage[msg.message.chat.id].gender == 'man' ? 'мужской' : 'женский'
    } стиль кроссовок.\n\n<i>💭 Теперь давай что будем искать</i>`,

    {
      chat_id: msg.message.chat.id,
      message_id: msg.message.message_id,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: '👚 Одежда', callback_data: 'cloth' }],
          [{ text: '👟 Обувь', callback_data: 'shoe' }],
        ],
      }),
    },
  )
  userStorage[msg.message.chat.id] = {
    gender: userStorage[msg.message.chat.id].gender,
  }
}

module.exports = {
  gender_option,
}
