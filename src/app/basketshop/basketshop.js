const cheerio = require('cheerio')
const {logger, objectToString} = require('../components/logger')

async function basketshop(chatId, userStorage) {
  userStorage[chatId].link =
    `https://www.basketshop.ru/catalog/shoes/krossovki` +
    `/${userStorage[chatId].search.toLowerCase()}` +
    `/${userStorage[chatId].gender == 'man' ? 'men' : 'women'}/${userStorage[chatId].style}/`

  try {
    const response = await fetch(userStorage[chatId].link)

    if (response.status === 200) {
      const html = await response.text()
      const $ = cheerio.load(html)
      const sneakers = []

      $('.product-card').each((index, element) => {
        const id = $(element).data('id')
        let title = $(element)
          .find('.product-card__name')
          .text()
          .trim()
          .replace(/мужские кроссовки |Кроссовки /i, '')
        const imageUrl = $(element)
          .find('.product-card__image img')
          .attr('data-src')
        const price = parseFloat(
          $(element).find('.product-card__price').text().trim(),
        )
        const size = $(element)
          .find(".size-grid[data-tab='size-us']")
          .text()
          .trim()
          .split('\n')
          .map(item => item.replace(/\t/g, ''))
          .filter(Boolean)
        const href = $(element).find('.product-card__name').attr('href').trim()

        sneakers.push({id, title, imageUrl, price, size, href})
      })

      userStorage[chatId].sneakers = sneakers
      logger.info(objectToString(userStorage[chatId]))
      return userStorage
    } else {
      return false
    }
  } catch (error) {
    logger.info(error)
    return false
  }
}

//NOTE: Сделать обработку страницы по href

module.exports = {
  basketshop,
}
