require("dotenv").config();

module.exports = {
  rssFeedUrl: process.env.RSS_FEED_URL,
  model: process.env.MODEL,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegraphAccessToken: process.env.TELEGRAPH_ACCESS_TOKEN,
  author_name: process.env.AUTHOR_NAME,
  author_url: process.env.AUTHOR_URL,
};
