const TelegramApi = require('node-telegram-bot-api')
const { config } = require('dotenv')

config()
const bot = new TelegramApi(process.env.TOKEN, { polling: true })

const main = async () => {
	console.log('Bot create by Anton Kamaev')

	bot.onText(/\/start/, async msg => {
		bot.sendMessage(msg.chat.id, 'Hi')
	})
}

main()
