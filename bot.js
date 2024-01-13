const TelegramApi = require('node-telegram-bot-api')
const { config } = require('dotenv')

const { gender_option } = require('./src/app/components/gender_func')
const { logger, objectToString } = require('./src/app/components/logger')

config()
const bot = new TelegramApi(process.env.TOKEN, { polling: true })
const userStorage = {}

const main = async () => {
	console.log('Bot create by Anton Kamaev')

	bot.onText(/\/start/, async msg => {
		bot.deleteMessage(msg.chat.id, msg.message_id - 1)
		bot.deleteMessage(msg.chat.id, msg.message_id)
		bot.sendMessage(
			msg.chat.id,
			`<b>✌🏼 Yo <i>${msg.chat.first_name}</i></b>! Я помогу тебе подобрать кроссовки по твоему запросу.\n\n<i>💭 Давай для начала выберем твой пол.</i>`,
			{
				parse_mode: 'HTML',
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{ text: 'Мужские', callback_data: 'man' },
							{ text: 'Женские', callback_data: 'woman' },
						],
					],
				}),
			}
		)
		logger.info(
			`${msg.chat.first_name} start using bot\n${objectToString(msg.from)}`
		)
	})

	/*Callbacks controller*/
	bot.on('callback_query', async msg => {
		const chat_id = msg.message.chat.id
		const message_id = msg.message.message_id
		const user = msg.message.chat.first_name

		switch (msg.data) {
			case 'man':
				userStorage[chat_id] = { gender: msg.data }
				console.log(userStorage[chat_id].gender)
				await gender_option(bot, msg, userStorage[chat_id])
				logger.info(`${user} select ${userStorage[chat_id].gender}`)
				break

			case 'woman':
				userStorage[chat_id] = { gender: msg.data }
				await gender_option(bot, msg, userStorage[chat_id])
				logger.info(`${user} select ${userStorage[chat_id].gender}`)
				break
		}
	})

	bot.on('text', async msg => {
		const chatId = msg.chat.id
		const messageId = msg.message_id
		let checked = false

		if (userStorage[chatId]) {
			switch (userStorage[chatId].state) {
				case 'awaitText':
					console.log(userStorage[chatId])
					userStorage[chatId] = {
						search: msg.text,
					}
					const response =
						await fetch(`https://www.basketshop.ru/?digiSearch=true&term=${
							userStorage[chatId].search
						}${
							userStorage[chatId].gender === 'man' ? '%20мужские' : '%20женские'
						}&params=%7Cfilter%3Dcategories%3A46%7Csort%3DDEFAULT
					`)

					if (response.status === 200) {
						console.log('ok')
						bot.sendMessage(chatId, link)
					} else {
						console.log('false')
					}
			}
		}
	})
}

main()
