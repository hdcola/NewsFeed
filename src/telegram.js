const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const { startAdminBot } = require("./adminBot.js");

const sendMessage = async (chatId, message, imgUrl) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption: message });
};

const sendPhoto = async (chatId, imgUrl, { caption, parse_mode = "HTML" }) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption, parse_mode });
};

const startBot = async () => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: true });

  await startAdminBot(bot);

  bot.on("polling_error", (error) => {
    console.log(error);
  });
};

module.exports = { sendMessage, startBot, sendPhoto };
