#!/usr/bin/env node

const readRSSFeed = require("./readRSSFeed.js");
const { getContent, getTitle } = require("./getChinesePost.js");
const fetchContent = require("./fetchContent.js");
const config = require("./config.js");
const { startBot } = require("./telegram.js");

const replyMsg = async (bot, chatId) => {
  const url = config.rssFeedUrl;
  const feed = await readRSSFeed(url);
  feed.map(async (item) => {
    const { title, summary, content } = await fetchContent(item.link);

    console.log("Sending a post...");
    console.log(item.link);
    console.log(markdown);
    console.log(item.enclosure.url);

    const postTitle = await getTitle({
      title,
      summary: summary,
      content,
    });

    const postContent = await getContent({
      title,
      summary: summary,
      content,
    });

    await bot.sendPhoto(chatId, item.enclosure.url, {
      caption: markdown,
      parse_mode: "MarkdownV2",
    });
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
