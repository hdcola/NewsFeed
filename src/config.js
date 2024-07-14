require("dotenv").config();
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const envConfig = {
  rssFeedUrl: process.env.RSS_FEED_URL,
  model: process.env.MODEL,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegraphAccessToken: process.env.TELEGRAPH_ACCESS_TOKEN,
  authorName: process.env.AUTHOR_NAME,
  authorUrl: process.env.AUTHOR_URL,
  adminChatId: parseInt(process.env.ADMIN_CHATID, 0),
  sendChatIds: process.env.SEND_CHATIDS
    ? process.env.SEND_CHATIDS.split(",").map(Number)
    : [],
};
const argvConfig = yargs(hideBin(process.argv))
  .option("rssFeedUrl", {
    alias: "r",
    describe: "RSS feed URL",
    type: "string",
  })
  .option("model", {
    alias: "m",
    describe: "Model",
    type: "string",
  })
  .option("telegramBotToken", {
    alias: "t",
    describe: "Telegram bot token",
    type: "string",
  })
  .option("telegraphAccessToken", {
    alias: "a",
    describe: "Telegraph access token",
    type: "string",
  })
  .option("authorName", {
    alias: "n",
    describe: "Author name",
    type: "string",
  })
  .option("authorUrl", {
    alias: "u",
    describe: "Author URL",
    type: "string",
  })
  .option("sendChatIds", {
    alias: "c",
    describe: "Send chat IDs",
    type: "array",
  })
  .option("serverMode", {
    alias: "s",
    describe: "Server mode",
    type: "boolean",
    default: false,
  })
  .option("adminChatId", {
    alias: "i",
    describe: "Admin chat ID",
    type: "number",
  })
  .help().argv;

if (argvConfig.help) {
  yargs.showHelp();
  process.exit(0);
}

// 合并配置，命令行参数优先
const config = {
  ...envConfig,
  ...argvConfig,
  // 特殊处理sendChatIds，因为命令行参数可能不是数组
  sendChatIds: argvConfig.sendChatIds
    ? argvConfig.sendChatIds.map(Number)
    : envConfig.sendChatIds,
};

module.exports = config;
