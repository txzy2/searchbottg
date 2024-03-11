const cheerio = require('cheerio')
const {logger, objectToString} = require('../components/logger')

let links = {
  link: 'https://www.basketshop.ru/catalog/shoes/krossovki',
  cloth_link: 'https://www.basketshop.ru/catalog/clothes',
}

async function basketshop(chatId, userStorage) {
  userStorage[chatId].link =
    `${links.link}` +
    `/${userStorage[chatId].search.toLowerCase()}` +
    `/${userStorage[chatId].gender == 'man' ? 'men' : 'women'}/${
      userStorage[chatId].style
    }/`

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
          $(element).find('.product-card__price').text().trim()
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

async function clothPush(userStorage, id) {
  try {
    const response = await fetch(
      `${links.cloth_link}/${userStorage[id].gender == 'man' ? 'men' : 'women'}`
    )
    if (response.status === 200) {
      const html = await response.text()
      const $ = cheerio.load(html)
      const clothes = []

      $('.product-card').each((index, e) => {
        const title = $(e)
          .find('.product-card__name')
          .find('span')
          .text()
          .trim()
        const imageUrl = $(e).find('.product-card__image img').attr('data-src')
        let clothes_size = $(e)
          .find('.size-grid__i')
          .text()
          .trim()
          .split('\n')
          .map(item => item.replace(/\t/g, ''))
          .filter(item => item !== '')
        clothes_size = [...new Set(clothes_size)]
        const price = parseFloat(
          $(e).find('.product-card__price').text().trim()
        )
        const href = $(e).find('.product-card__image-link').attr('href').trim()

        clothes.push({title, imageUrl, price, clothes_size, href})
      })

      userStorage[id].clothes = clothes
      logger.info(objectToString(userStorage[id]))
      return userStorage
    }
  } catch (error) {
    logger.info(error)
    return false
  }
}

module.exports = {
  basketshop,
  clothPush,
}
