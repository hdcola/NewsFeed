const config = require("./config");
const { loadFeed } = require("./feedLoader");
const crypto = require("crypto");
const { sendPostItem, sendFeedItemToAdmin } = require("./sendPost.js");

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

const sendPreview = async (bot, hash) => {
  const feed = await loadFeed(config.rssFeedUrl, true);
  const item = feed.find((item) => {
    return crypto.createHash("md5").update(item.link).digest("hex") === hash;
  });

  if (item) {
    await sendPostItem(item, [config.adminChatId], { sendAdmin: false });
  } else {
    bot.sendMessage(config.adminChatId, "Item not found");
  }
};

// /start
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

  // /showfeed
  bot.onText(/showfeed/, async (msg) => showAllFeeds(bot, msg));

  // /post imgurl posurl
  bot.onText(/\/post (.+) (.+)/, async (msg, match) => {
    const imgUrl = match[1];
    const postUrl = match[2];
    const item = {
      link: postUrl,
      pubDate: Date.now(),
      enclosure: { url: imgUrl },
    };
    await sendPostItem(item, [config.adminChatId], { sendAdmin: false });
  });

  bot.on("callback_query", async (query) => {
    const msg = query.message;
    const [action, para] = query.data.split(" ");
    if (action === "preview") {
      await sendPreview(bot, para);
    }
  });
};

module.exports = { startAdminBot };
