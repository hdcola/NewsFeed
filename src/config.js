require("dotenv").config();

module.exports = {
  rssFeedUrl: process.env.RSS_FEED_URL,
  model: process.env.MODEL,
};
