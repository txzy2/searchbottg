const gender_option = async (bot, msg, gender) => {
	console.log(gender)
	bot.editMessageText(
		`${msg.message.chat.first_name} ты выбрал ${
			gender[msg.message.chat.id].gender == 'man' ? 'мужской' : 'женский'
		}`,
		{
			chat_id: msg.message.chat.id,
			message_id: msg.message.message_id,
		}
	)
}

module.exports = {
	gender_option,
}
