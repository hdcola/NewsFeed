const api = require("telegraph-node");
const ph = new api();
const config = require("./config.js");

const createPage = async (title, content) => {
  const page = {
    title: title,
    content: content,
  };

  const result = await ph.createPage(config.telegraphAccessToken, page);
  return result.url;
};

module.exports = { createPage };
