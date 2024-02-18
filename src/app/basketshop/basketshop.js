const cheerio = require("cheerio");
const { logger } = require("../components/logger");

async function basketshop(bot, chatId, userStorage, messageId, msg) {
  userStorage[chatId].link =
    `https://www.basketshop.ru/catalog/shoes/krossovki/${userStorage[chatId].search}/${userStorage[chatId].gender == "man" ? "men" : "women"}/oncourt/`;

  try {
    const response = await fetch(userStorage[chatId].link);

    if (response.status === 200) {
      const html = await response.text();
      const $ = cheerio.load(html);

      const sneakers = [];

      $(".product-card").each((index, element) => {
        const id = $(element).data("id");
        let title = $(element).find(".product-card__name").text().trim();
        const imageUrl = $(element)
          .find(".product-card__image img")
          .attr("data-src");
        const price = parseFloat(
          $(element).find(".product-card__price").text().trim(),
        );

        title = title.replace(/мужские кроссовки |Кроссовки /i, "");
        sneakers.push({ id, title, imageUrl, price });
      });

      userStorage[chatId].sneakers = sneakers;

      return userStorage;
    } else {
      return false;
    }
  } catch (error) {
    logger.info(error);
    return false;
  }
}

module.exports = {
  basketshop,
};

module.exports = {
  basketshop,
};
