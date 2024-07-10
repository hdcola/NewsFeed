#!/usr/bin/env node

const readRSSFeed = require("./readRSSFeed.js");
const getChinesePost = require("./getChinesePost.js");
const fetchContent = require("./fetchContent.js");

const main = async () => {
  // const url = "https://www.lapresse.ca/actualites/rss";
  // const feed = await readRSSFeed(url);
  // feed.map(async (item) => {
  //   // console.log(item.link);
  //   // const post = await getChinesePost({
  //   //   model: "gemma2:9b",
  //   //   title: item.title,
  //   //   description: item.description,
  //   // });
  //   // console.log(post);
  // });

  const url =
    "https://www.lapresse.ca/actualites/justice-et-faits-divers/2024-07-09/quebec/un-signaleur-routier-meurt-frappe-par-un-vehicule-lourd.php";
  const { title, summary, content } = await fetchContent(url);
  const post = await getChinesePost({
    model: "gemma2:9b",
    title,
    description: summary,
    content,
  });
  console.log(post);
};

main();
