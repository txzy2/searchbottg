const gender_option = async (bot, msg, userStorage) => {
	bot.editMessageText(
		`✌🏼 <b><i>${msg.message.chat.first_name}</i></b> ты выбрал ${
			userStorage[msg.message.chat.id].gender == 'man' ? 'мужской' : 'женский'
		} стиль кроссовок.\n\n💭 Теперь напиши мне пожалуйста какие кроссовки будем искать <i>(Например: nike air force 1)</i>`,

		{
			chat_id: msg.message.chat.id,
			message_id: msg.message.message_id,
			parse_mode: 'HTML',
			// reply_markup: JSON.stringify({
			// 	inline_keyboard: [
			// 		[{ text: 'basketshop', callback_data: 'basketshop' }],
			// 		[{ text: 'streetbeat', callback_data: 'streetbeat' }],
			// 		[{ text: 'funkydunky', callback_data: 'funkydunky' }],
			// 	],
			// }),
		}
	)
	userStorage[msg.message.chat.id] = {
		state: 'awaitText',
		gender: userStorage[msg.message.chat.id].gender,
	}
}

module.exports = {
	gender_option,
}
