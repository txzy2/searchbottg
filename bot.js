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
			`<b>✌🏼 Привет <i>${msg.chat.first_name}</i></b>! Я помогу тебе найти кроссовки по твоему запросу.\n\n<i>💭 Давай для начала выберем твой пол</i>`,
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
		userStorage[chat_id] = { gender: msg.data }

		switch (msg.data) {
			case 'man':
				await gender_option(bot, msg, userStorage)
				logger.info(`${user} select ${userStorage[chat_id].gender}`)
				break

			case 'woman':
				await gender_option(bot, msg, userStorage)
				logger.info(`${user} select ${userStorage[chat_id].gender}`)
				break
		}
	})
}

main()
