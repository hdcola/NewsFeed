const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const { startAdminBot } = require("./adminBot.js");

const startBot = async () => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: true });

  await startAdminBot(bot);

  bot.on("polling_error", (error) => {
    console.log(error);
  });
};

module.exports = { startBot };
