const axios = require("axios");
const cheerio = require("cheerio");

const fetchContent = async (url) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const title = $("h1.headlines.titleModule .title.titleModule__main").text();
  const summary = $(
    "div.articleBody .lead.textModule.textModule--type-lead"
  ).text();
  const preContent = $(
    "p.paragraph.textModule.textModule--type-paragraph,figure[itemscope][itemprop='associatedMedia']"
  ).clone();

  preContent.find("source").remove();
  // move <img> to <figure> and remove <picture>
  preContent.find("picture").each(function () {
    const img = $(this).find("img");
    $(this).replaceWith(img);
  });
  // remove clas and style attributes
  // preContent.find("p,img,figcaption").each(function () {
  //   $(this).removeAttr("class").removeAttr("style").removeAttr("itemprop");
  // });

  let content = $.html(preContent);
  // content = content.replace(/\s+/g, " ").trim();
  return { title, summary, content };
};

module.exports = { fetchContent };
