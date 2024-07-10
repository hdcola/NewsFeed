#!/usr/bin/env node

const readRSSFeed = require("./readRSSFeed.js");
const getChinesePost = require("./getChinesePost.js");

const main = async () => {
  const url = "https://www.lapresse.ca/actualites/rss";
  const feed = await readRSSFeed(url);
  feed.map(async (item) => {
    const post = await getChinesePost({
      model: "gemma2:9b",
      title: item.title,
      description: item.description,
    });
    console.log(post);
  });
};

main();
