const { fetchContent } = require("./fetchContent.js");
const { createPage } = require("./telegraph.js");
const { format } = require("date-fns");
const { getPost } = require("./getChinesePost.js");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config.js");
const crypto = require("crypto");

const sendPhoto = async (chatId, imgUrl, { caption, parse_mode = "HTML" }) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption, parse_mode });
};

const sendMessage = async (chatId, message, { parse_mode = "HTML" }) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendMessage(chatId, message, { parse_mode });
};

const sentMessageToAdmin = async (message, form = {}) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendMessage(config.adminChatId, message, { form });
};

const sendFeedItemToAdmin = async (index, item) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  const hash = crypto.createHash("md5").update(item.link).digest("hex");
  bot.sendMessage(
    config.adminChatId,
    `${index} ${item.title}\n${item.enclosure.url} ${item.link}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "发送", callback_data: `send ${hash}` },
            { text: "预览", callback_data: `preview ${hash}` },
          ],
        ],
      },
    }
  );
};

const sendPostItem = async (item, chatIds, { sendAdmin = true, index = 1 }) => {
  const { title, summary, content } = await fetchContent(item.link);
  console.log("Sending a post...");
  console.log(item.link);
  console.log(item.enclosure.url);

  if (sendAdmin) {
    await sendFeedItemToAdmin(index, item);
  }

  const {
    title: postTitle,
    summary: postSummary,
    content: postContent,
  } = await getPost({
    title,
    summary,
    content,
  });

  console.log("Title:", postTitle);
  console.log("Summary:", postSummary);

  const telegraphUrl = await createPage(postTitle, postContent);
  console.log("url:", telegraphUrl);

  const pubDate = format(new Date(item.pubDate), "yyyy-MM-dd HH:mm:ss");

  for (const chatId of chatIds) {
    await sendMessage(
      chatId,
      `<a href="${telegraphUrl}">${postTitle}</a> | <a href="${item.link}">来源</a>\n${pubDate}`,
      { parse_mode: "HTML" }
    );
  }
};

module.exports = { sendPostItem, sendFeedItemToAdmin };
