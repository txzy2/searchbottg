const TelegramApi = require("node-telegram-bot-api");
const { config } = require("dotenv");

const { gender_option } = require("./src/app/components/gender_func");
const { logger, objectToString } = require("./src/app/components/logger");
const { basketshop } = require("./src/app/basketshop/basketshop");
const {
  sendSneakerInfo,
  updateSneakerInfo,
} = require("./src/app/components/slider");

config();
const bot = new TelegramApi(process.env.TOKEN, { polling: true });
const userStorage = {};

const main = async () => {
  console.log("Bot create by Anton Kamaev");

  bot.onText(/\/start/, async (msg) => {
    bot.deleteMessage(msg.chat.id, msg.message_id - 1);
    bot.deleteMessage(msg.chat.id, msg.message_id);
    bot.sendMessage(
      msg.chat.id,
      `<b>✌🏼 Yo <i>${msg.chat.first_name}</i></b>! Я помогу тебе подобрать кроссовки по твоему запросу.\n\n<i>💭 Давай для начала выберем твой пол.</i>`,
      {
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: "Мужские", callback_data: "man" },
              { text: "Женские", callback_data: "woman" },
            ],
          ],
        }),
      },
    );
    logger.info(
      `${msg.chat.first_name} start using bot\n${objectToString(msg.from)}`,
    );
  });

  /*Callbacks controller*/
  bot.on("callback_query", async (msg) => {
    const chat_id = msg.message.chat.id;
    const user = msg.message.chat.first_name;

    switch (msg.data) {
      case "man":
        userStorage[chat_id] = { gender: msg.data };
        await gender_option(bot, msg, userStorage);
        logger.info(`${user} select ${userStorage[chat_id].gender}`);
        break;

      case "woman":
        userStorage[chat_id] = { gender: msg.data };
        await gender_option(bot, msg, userStorage);
        logger.info(`${user} select ${userStorage[chat_id].gender}`);
        break;

      case "home":
        bot.deleteMessage(chat_id, msg.message.message_id);
        bot.sendMessage(
          chat_id,
          `<b>✌🏼 Yo <i>${msg.message.chat.first_name}</i></b>! Я помогу тебе подобрать кроссовки по твоему запросу.\n\n<i>💭 Давай для начала выберем твой пол.</i>`,
          {
            parse_mode: "HTML",
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  { text: "Мужские", callback_data: "man" },
                  { text: "Женские", callback_data: "woman" },
                ],
              ],
            }),
          },
        );
        break;

      case "prev_btn":
        userStorage[chat_id].currentIndex =
          (userStorage[chat_id].currentIndex -
            1 +
            userStorage[chat_id].sneakers.length) %
          userStorage[chat_id].sneakers.length;
        await updateSneakerInfo(
          chat_id,
          userStorage[chat_id].currentIndex,
          bot,
          userStorage,
          msg.message.message_id,
        );
        break;

      case "next_btn":
        userStorage[chat_id].currentIndex =
          (userStorage[chat_id].currentIndex + 1) %
          userStorage[chat_id].sneakers.length;
        await updateSneakerInfo(
          chat_id,
          userStorage[chat_id].currentIndex,
          bot,
          userStorage,
          msg.message.message_id,
        );
        break;
    }
  });

  bot.on("text", async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (userStorage[chatId]) {
      switch (userStorage[chatId].state) {
        case "awaitText":
          userStorage[chatId] = {
            search: msg.text,
            gender: userStorage[chatId].gender,
          };

          const result = await basketshop(
            bot,
            chatId,
            userStorage,
            messageId,
            msg,
          );

          if (result === false) {
            await bot.deleteMessage(chatId, messageId);
            await bot.editMessageText(
              `<b>${msg.chat.first_name}</b>, я ничего не нашел по твоему запросу 😔`,
            );
          } else {
            await bot.deleteMessage(chatId, messageId - 1);
            await bot.deleteMessage(chatId, messageId);

            userStorage[chatId].currentIndex = 0;
            await sendSneakerInfo(
              chatId,
              userStorage[chatId].currentIndex,
              bot,
              userStorage,
            );
          }

          break;
      }
    }
  });
};

main();
