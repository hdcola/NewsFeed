#!/usr/bin/env node

const { loadFeed } = require("./feedLoader.js");
const config = require("./config.js");
const { startBot } = require("./telegram.js");
const { format } = require("date-fns");
const { sendPostItem } = require("./sendPost.js");

const feedToTelegram = async () => {
  const feed = await loadFeed(config.rssFeedUrl);

  for (const [index, item] of feed.entries()) {
    await sendPostItem(item, config.sendChatIds, { sendAdmin: false, index });
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
