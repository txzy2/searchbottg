const TelegramApi = require("node-telegram-bot-api");
const { config } = require("dotenv");

const { gender_option } = require("./src/app/components/gender_func");
const { logger, objectToString } = require("./src/app/components/logger");
const { basketshop } = require("./src/app/basketshop/basketshop");
const {
  sendSneakerInfo,
  updateSneakerInfo,
} = require("./src/app/components/slider");
const { mainMessage } = require("./src/app/components/main-message");

config();
const bot = new TelegramApi(process.env.TOKEN, { polling: true });
const userStorage = {};

async function sendMessage(bot, chat_id, msg) {
  bot.editMessageText(
    `✌🏼 <b><i>${msg.message.chat.first_name}</i></b> ты выбрал ${userStorage[msg.message.chat.id].gender == "man" ? "мужской" : "женский"} стиль кроссовок.\n\n` +
    `💭 Теперь напиши мне пожалуйста какие кроссовки будем искать <i>(Например: nike или adidas)</i>`,
    {
      chat_id: chat_id,
      message_id: msg.message.message_id,
      parse_mode: "HTML",
    },
  );
}

const main = async () => {
  console.log("Bot create by Anton Kamaev");

  bot.onText(/\/start/, async (msg) => {
    await mainMessage(bot, msg.chat.id, msg.chat.first_name);
    logger.info(
      `${msg.chat.first_name} start using bot\n${objectToString(msg.from)}`,
    );
  });

  /*Callbacks controller*/
  bot.on("callback_query", async (msg) => {
    const {
      chat: { id: chat_id, first_name: username },
      message_id: msg_id,
    } = msg.message;

    switch (msg.data) {
      case "man":
        userStorage[chat_id] = { gender: msg.data };
        await gender_option(bot, msg, userStorage);
        logger.info(`${username} select ${userStorage[chat_id].gender}`);
        break;

      case "woman":
        userStorage[chat_id] = { gender: msg.data };
        await gender_option(bot, msg, userStorage);
        logger.info(`${username} select ${userStorage[chat_id].gender}`);
        break;

      case "life":
        userStorage[chat_id] = {
          state: "awaitText",
          gender: userStorage[chat_id].gender,
          style: "lifestyle",
        };
        await sendMessage(bot, chat_id, msg);

        break;

      case "court":
        userStorage[chat_id] = {
          state: "awaitText",
          gender: userStorage[chat_id].gender,
          style: "oncourt",
        };

        await sendMessage(bot, chat_id, msg);
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
          msg_id,
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
          msg_id,
        );
        break;

      case "home":
        bot.deleteMessage(chat_id, msg_id);
        await mainMessage(bot, chat_id, username);
        break;
    }
  });

  bot.on("text", async (msg) => {
    let { chat, message_id: messageId } = msg;
    const chatId = chat.id;

    if (userStorage[chatId]) {
      switch (userStorage[chatId].state) {
        case "awaitText":
          userStorage[chatId] = {
            search: msg.text,
            gender: userStorage[chatId].gender,
            style: userStorage[chatId].style,
          };

          let result = await basketshop(chatId, userStorage);

          if (result === false) {
            await bot.deleteMessage(chatId, messageId);
            await bot.editMessageText(
              `<b>${msg.chat.first_name}</b>, я ничего не нашел по твоему запросу 😔`,
              {
                chat_id: chatId,
                message_id: messageId - 1,
                parse_mode: "HTML",
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [
                      {
                        text: "🏠 Выход в главное меню",
                        callback_data: "home",
                      },
                    ],
                  ],
                }),
              },
            );
          } else {
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
