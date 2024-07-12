#!/usr/bin/env node

const readRSSFeed = require("./readRSSFeed.js");
const { getPost } = require("./getChinesePost.js");
const fetchContent = require("./fetchContent.js");
const config = require("./config.js");
const { startBot } = require("./telegram.js");
const { createPage } = require("./telegraph.js");

const replyMsg = async (bot, chatId) => {
  const url = config.rssFeedUrl;
  const feed = await readRSSFeed(url);

  for (const item of feed) {
    const { title, summary, content } = await fetchContent(item.link);

    console.log("Sending a post...");
    console.log(item.link);
    console.log(item.enclosure.url);

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

    await bot.sendPhoto(chatId, item.enclosure.url, {
      caption: `<a href="${telegraphUrl}">${postTitle}</a>\n\n${postSummary}`,
      parse_mode: "HTML",
    });
  }
};

const main = async () => {
  if (config.telegramBotToken) {
    startBot(replyMsg);
  } else {
    console.log("Please provide a Telegram bot token.");
  }
};

main();
