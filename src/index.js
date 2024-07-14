#!/usr/bin/env node

const { loadFeed } = require("./feedLoader.js");
const { getPost } = require("./getChinesePost.js");
const fetchContent = require("./fetchContent.js");
const config = require("./config.js");
const { sendPhoto, startBot } = require("./telegram.js");
const { format } = require("date-fns");
const { createPage } = require("./telegraph.js");
const { sendFeedItemToAdmin } = require("./adminBot.js");

const feedToTelegram = async () => {
  const feed = await loadFeed(config.rssFeedUrl);

  for (const [index, item] of feed.entries()) {
    const { title, summary, content } = await fetchContent(item.link);
    console.log("Sending a post...");
    console.log(item.link);
    console.log(item.enclosure.url);

    await sendFeedItemToAdmin(index, item);

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

    for (const chatId of config.sendChatIds) {
      await sendPhoto(chatId, item.enclosure.url, {
        caption: `<a href="${telegraphUrl}">${postTitle}</a>\n${pubDate}\n\n${postSummary}\n\n👉<a href="${telegraphUrl}"><b>继续浏览后续</b></a>`,
      });
    }
  }
};

const main = async () => {
  if (config.telegramBotToken) {
    if (config.serverMode) {
      console.log("Starting the bot in server mode...");
      await startBot();
    } else {
      console.log(
        format(Date.now(), "yyyy-MM-dd HH:mm:ss"),
        "Checking for new posts..."
      );
      await feedToTelegram();
    }
  } else {
    console.log("Please provide a Telegram bot token.");
  }
};

main();
