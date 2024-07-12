const readRSSFeed = require("./readRSSFeed.js");
const fs = require("fs");
const config = require("./config.js");

const saveFeed = async (feed) => {
  fs.writeFileSync("feed.json", JSON.stringify(feed, null, 2), "utf-8");
};

const loadFeed = async (url) => {
  const currentFeed = await readRSSFeed(url);
  if (!fs.existsSync("feed.json")) {
    return currentFeed;
  }
  const savedFeed = JSON.parse(fs.readFileSync("feed.json", "utf-8"));

  const newFeed = currentFeed.filter(
    (currentItem) =>
      // currentItem.pubDate should > any saved item pubDate
      !savedFeed.some(
        (savedItem) =>
          new Date(currentItem.pubDate) <= new Date(savedItem.pubDate)
      )
  );

  return newFeed;
};

module.exports = { saveFeed, loadFeed };
