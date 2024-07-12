#!/usr/bin/env node

const readRSSFeed = require("./readRSSFeed.js");
const {
  getContent,
  getTitle,
  getSummary,
  getPost,
} = require("./getChinesePost.js");
const fetchContent = require("./fetchContent.js");
const config = require("./config.js");
const { startBot } = require("./telegram.js");

const replyMsg = async (bot, chatId) => {
  const url = config.rssFeedUrl;
  const feed = await readRSSFeed(url);

  const item = feed[0];

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

  await bot.sendPhoto(chatId, item.enclosure.url, {
    caption: `${postTitle}\n\n${postSummary}`,
  });
};

const main = async () => {
  if (config.telegramBotToken) {
    startBot(replyMsg);
  } else {
    console.log("Please provide a Telegram bot token.");
  }
};

main();
