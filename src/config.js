require("dotenv").config();

module.exports = {
  rssFeedUrl: process.env.RSS_FEED_URL,
  model: process.env.MODEL,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegraphAccessToken: process.env.TELEGRAPH_ACCESS_TOKEN,
};
