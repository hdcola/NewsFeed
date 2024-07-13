const api = require("telegraph-node");
const ph = new api();
const config = require("./config.js");

const createPage = async (title, content) => {
  const formattedContent = Array.isArray(content)
    ? content
    : [{ tag: "p", children: [content] }];

  const result = await ph.createPage(
    config.telegraphAccessToken,
    title,
    formattedContent,
    {
      author_name: config.authorName,
      author_url: config.authorUrl,
    }
  );
  return result.url;
};

module.exports = { createPage };
