#!/usr/bin/env node

const readRSSFeed = require("./readRSSFeed.js");
const getChinesePost = require("./getChinesePost.js");
const fetchContent = require("./fetchContent.js");
const config = require("./config.js");

const main = async () => {
  const url = config.rssFeedUrl;
  const feed = await readRSSFeed(url);
  feed.map(async (item) => {
    const { title, summary, content } = await fetchContent(item.link);
    const post = await getChinesePost({
      model: config.model,
      title,
      summary: summary,
      content,
    });
    console.log(post);
    console.log(item.pubDate);
    console.log(item.enclosure.url);
    console.log("====================================");
  });
};

main();
