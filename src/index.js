#!/usr/bin/env node

const { loadFeed, saveFeed } = require("./feedLoader.js");
const { getPost } = require("./getChinesePost.js");
const fetchContent = require("./fetchContent.js");
const config = require("./config.js");
const { sendPhoto } = require("./telegram.js");
const { format } = require("date-fns");
const { createPage } = require("./telegraph.js");

const replyMsg = async (bot, chatId) => {
  const url = config.rssFeedUrl;
  const feed = await loadFeed(url);
  await saveFeed(feed);

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

const feedToTelegram = async () => {
  const url = config.rssFeedUrl;
  const feed = await loadFeed(url);
  await saveFeed(feed);

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

    const pubDate = format(new Date(item.pubDate), "yyyy-MM-dd HH:mm:ss");

    for (const chatId of config.send_chatids) {
      await sendPhoto(chatId, item.enclosure.url, {
        caption: `<a href="${telegraphUrl}">${postTitle}</a>${pubDate}\n\n${postSummary}`,
      });
    }
  }
};

const main = async () => {
  if (config.telegramBotToken) {
    // startBot(replyMsg);
    feedToTelegram();
  } else {
    console.log("Please provide a Telegram bot token.");
  }
};

main();
