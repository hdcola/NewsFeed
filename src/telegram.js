const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");

const sendMessage = async (chatId, message, imgUrl) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption: message });
};

const startBot = (replyMsg) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: true });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `Welcome ${chatId} to the Chinese Post Bot. Send me a RSS feed URL and I will send you a Chinese post.`
    );
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    await replyMsg(bot, chatId);
  });

  bot.on("polling_error", (error) => {
    console.log(error);
  });
};

module.exports = { sendMessage, startBot };
