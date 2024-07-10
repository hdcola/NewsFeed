const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function fetchContent(url) {
  try {
    const response = await axios.get(url);
    const content = response.data;

    const $ = cheerio.load(content);

    const titleText = $("h1.headlines .title.titleModule__main").text().trim();
    const summaries = $(
      "div.articleBody .lead.textModule.textModule--type-lead"
    )
      .text()
      .trim();

    const paragraphs = $(
      "div.articleBody p.paragraph.textModule.textModule--type-paragraph"
    )
      .map((_, element) => $(element).text().trim())
      .get();
    return {
      title: titleText,
      summary: summaries,
      content: paragraphs.join("\n"),
    };
  } catch (error) {
    console.error(error);
  }
};
