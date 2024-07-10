const Parser = require("rss-parser");

const parser = new Parser();

module.exports = async (url) => {
  const feed = await parser.parseURL(url);
  return feed.items.map((item) => {
    return {
      title: item.title,
      link: item.link,
      description: item.contentSnippet,
      enclosure: item.enclosure,
      pubDate: item.pubDate,
      guid: item.guid,
    };
  });
};
