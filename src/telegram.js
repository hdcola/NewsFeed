const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");

const sendMessage = async (chatId, message, imgUrl) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption: message });
};

const sendPhoto = async (chatId, imgUrl, { caption, parse_mode = "HTML" }) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption, parse_mode });
};

const startBot = () => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: true });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (config.adminChatId === chatId) {
      bot.sendMessage(
        chatId,
        `Welcome ${chatId} to the Chinese Post Bot. Send me a RSS feed URL and I will send you a Chinese post.`,
        {
          reply_markup: {
            keyboard: [["showfeed"]],
          },
        }
      );
    }
  });

  bot.on("polling_error", (error) => {
    console.log(error);
  });
};

module.exports = { sendMessage, startBot, sendPhoto };
