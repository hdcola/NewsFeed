const fetchContent = require("./fetchContent.js");
const { createPage } = require("./telegraph.js");
const { format } = require("date-fns");
const { getPost } = require("./getChinesePost.js");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config.js");

const sendMessage = async (chatId, message, imgUrl) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption: message });
};

const sendPhoto = async (chatId, imgUrl, { caption, parse_mode = "HTML" }) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendPhoto(chatId, imgUrl, { caption, parse_mode });
};

const sentMessageToAdmin = async (message, form = {}) => {
  const bot = new TelegramBot(config.telegramBotToken, { polling: false });
  await bot.sendMessage(config.adminChatId, message, { form });
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
    await sendPhoto(chatId, item.enclosure.url, {
      caption: `<a href="${telegraphUrl}">${postTitle}</a>\n${pubDate}\n\n${postSummary}\n\n👉<a href="${telegraphUrl}"><b>继续浏览后续</b></a>`,
    });
  }
};

module.exports = { sendPostItem };
