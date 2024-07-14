const readRSSFeed = require("./readRSSFeed.js");
const fs = require("fs");
const config = require("./config.js");

const saveFeed = async (feed) => {
  fs.writeFileSync("feed.json", JSON.stringify(feed, null, 2), "utf-8");
};

const loadFeed = async (url, all = false) => {
  const currentFeed = await readRSSFeed(url);
  console.log("currentFeed:", currentFeed.length);

  if (all) {
    return currentFeed;
  }

  if (!fs.existsSync("feed.json")) {
    await saveFeed(currentFeed);
    return currentFeed;
  }

  const savedFeed = JSON.parse(fs.readFileSync("feed.json", "utf-8"));

  const newFeed = currentFeed.filter(
    (currentItem) =>
      !savedFeed.some(
        (savedItem) =>
          new Date(currentItem.pubDate) <= new Date(savedItem.pubDate)
      )
  );

  // sort bye date asc
  newFeed.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

  await saveFeed(currentFeed);

  return newFeed;
};

module.exports = { saveFeed, loadFeed };
