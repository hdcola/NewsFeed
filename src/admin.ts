
const config = require('./config');
const TelegramBot = require("node-telegram-bot-api");

const sentMessageToAdmin = async (message, form = {}) => {
    const bot = new TelegramBot(config.telegramBotToken, { polling: false });
    await bot.sendMessage(config.adminChatId, message, { form });
}

module.exports = { sentMessageToAdmin };
