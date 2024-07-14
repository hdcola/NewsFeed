const config = require("./config");
const TelegramBot = require("node-telegram-bot-api");
const { loadFeed } = require("./feedLoader");
const crypto = require("crypto");
const fetchContent = require("./fetchContent.js");
const { getPost } = require("./getChinesePost.js");
const { createPage } = require("./telegraph.js");
const { format } = require("date-fns");

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

const sendPreview = async (bot, hash) => {
  const feed = await loadFeed(config.rssFeedUrl, true);
  const item = feed.find((item) => {
    return crypto.createHash("md5").update(item.link).digest("hex") === hash;
  });

  if (item) {
    const { title, summary, content } = await fetchContent(item.link);
    const {
      title: postTitle,
      summary: postSummary,
      content: postContent,
    } = await getPost({
      title,
      summary,
      content,
    });

    const telegraphUrl = await createPage(postTitle, postContent);

    const pubDate = format(new Date(item.pubDate), "yyyy-MM-dd HH:mm:ss");

    bot.sendPhoto(config.adminChatId, item.enclosure.url, {
      caption: `<a href="${telegraphUrl}">${postTitle}</a>\n${pubDate}\n\n${postSummary}\n\n👉<a href="${telegraphUrl}"><b>继续浏览后续</b></a>`,
      parse_mode: "HTML",
    });
  } else {
    bot.sendMessage(config.adminChatId, "Item not found");
  }
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

  bot.on("callback_query", async (query) => {
    const msg = query.message;
    const [action, para] = query.data.split(" ");
    if (action === "preview") {
      await sendPreview(bot, para);
    }
  });
};

module.exports = { sentMessageToAdmin, startAdminBot, sendFeedItemToAdmin };
