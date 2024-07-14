const config = require("./config");
const TelegramBot = require("node-telegram-bot-api");
const { loadFeed } = require("./feedLoader");
const crypto = require("crypto");

const sentMessageToAdmin = async (message, form = {}) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendMessage(config.adminChatId, message, { form });
};

function callbackWrapper(asyncFn) {
  return function (...args) {
    asyncFn(...args).catch((err) => {
      console.error("Error in async function:", err);
    });
  };
}

const showAllFeeds = async (bot, msg) => {
  console.log("showFeed");
  const chatId = msg.chat.id;
  if (config.adminChatId === chatId) {
    const feed = await loadFeed(config.rssFeedUrl, true);
    for (const [index, item] of feed.entries()) {
      await sendFeedItemToAdmin(index, item);
    }
  }
};

const sendFeedItemToAdmin = async (index, item) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  const hash = crypto.createHash("md5").update(item.link).digest("hex");
  bot.sendMessage(config.adminChatId, `${index} ${item.title}\n${item.link}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "发送", callback_data: `send ${hash}` },
          { text: "预览", callback_data: `preview ${hash}` },
        ],
      ],
    },
  });
};

const startAdminBot = async (bot) => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (config.adminChatId === chatId) {
      bot.sendMessage(
        chatId,
        `Welcome ${chatId} to the Chinese Post Bot. Send me a RSS feed URL and I will send you a Chinese post.`,
        {
          reply_markup: {
            keyboard: [["showfeed", "stop"]],
            resize_keyboard: true,
          },
        }
      );
    }
  });

  bot.onText(
    /showfeed/,
    callbackWrapper((msg) => showAllFeeds(bot, msg))
  );
};

module.exports = { sentMessageToAdmin, startAdminBot, sendFeedItemToAdmin };
