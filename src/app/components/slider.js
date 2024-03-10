async function sendOrUpdatePhoto(
  chatId,
  bot,
  messageId,
  photo,
  caption,
  currentIndex,
  totalItems,
  item,
) {
  const replyMarkup = JSON.stringify({
    inline_keyboard: [
      [
        { text: '<<', callback_data: 'prev_btn' },
        { text: `${currentIndex}/${totalItems}`, callback_data: 'total' },
        { text: '>>', callback_data: 'next_btn' },
      ],
      [
        {
          text: `🔗 Ссылка (${item.title})`,
          web_app: { url: `https://basketshop.ru${item.href}` },
        },
      ],
      [{ text: '🏠 Выход в главное меню', callback_data: 'home' }],
    ],
  })

  if (messageId) {
    await bot.editMessageMedia(
      { type: 'photo', media: photo, caption, parse_mode: 'HTML' },
      { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup },
    )
  } else {
    await bot.sendPhoto(chatId, photo, {
      caption,
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
    })
  }
}

async function sendProductInfo(chatId, i, bot, userStorage, variant) {
  const currentIndex = i + 1
  let product, totalItems, caption
  console.log(variant)

  if (variant === 'cloth') {
    product = userStorage[chatId].clothes[i]
    totalItems = userStorage[chatId].clothes.length

    caption = `<b>${product.title}</b>\n\n<i>➖ Размеры: ${product.clothes_size.join(', ')}</i>`
  } else if (variant === 'sneaker') {
    product = userStorage[chatId].sneakers[i]
    totalItems = userStorage[chatId].sneakers.length

    caption =
      `<b>👟 Кроссовки:</b> <i>${product.title}</i>\n\n` +
      `<i>➖ Бренд:</i> ${userStorage[chatId].search}\n` +
      `<i>➖ Пол:</i> ${userStorage[chatId].gender}\n<i>` +
      `➖ Доступные размеры:</i> ${product.size.join(', ')} us\n\n` +
      `<i>💸 Цена:</i> <code>${product.price}</code> руб\n\n`
  }

  userStorage[chatId].variant = variant
  await sendOrUpdatePhoto(
    chatId,
    bot,
    null,
    product.imageUrl,
    caption,
    currentIndex,
    totalItems,
    product,
  )
}

async function updateProductInfo(
  chatId,
  i,
  bot,
  userStorage,
  messageId,
  variant,
) {
  const currentIndex = i + 1
  let product, totalItems, caption

  if (variant === 'cloth') {
    product = userStorage[chatId].clothes[i]
    totalItems = userStorage[chatId].clothes.length

    caption = `<b>${product.title}</b>\n\n<i>➖ Размеры: ${product.clothes_size.join(', ')}</i>`
  } else if (variant === 'sneaker') {
    product = userStorage[chatId].sneakers[i]
    totalItems = userStorage[chatId].sneakers.length

    caption =
      `<b>👟 Кроссовки:</b> <i>${product.title}</i>\n\n` +
      `<i>➖ Бренд:</i> ${userStorage[chatId].search}\n` +
      `<i>➖ Пол:</i> ${userStorage[chatId].gender}\n<i>` +
      `➖ Доступные размеры:</i> ${product.size.join(', ')} us\n\n` +
      `<i>💸 Цена:</i> <code>${product.price}</code> руб\n\n`
  }

  await sendOrUpdatePhoto(
    chatId,
    bot,
    messageId,
    product.imageUrl,
    caption,
    currentIndex,
    totalItems,
    product,
  )
}

module.exports = {
  sendProductInfo,
  updateProductInfo,
}
