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

const htmlToNode = (html) => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const content = [];

  function convertElement(element) {
    const tag = element.tagName;
    let children = $(element)
      .contents()
      .map((_, el) => convertElement(el))
      .get()
      .filter((child) => child !== ""); // 过滤掉空字符串

    const text = $(element).text().trim();

    if (!tag) {
      return text || "";
    }

    switch (tag) {
      case "p":
      case "h3":
      case "figcaption":
      case "figure":
      case "b":
      case "i":
      case "u":
      case "s":
      case "blockquote":
        return {
          tag,
          children: children.length ? children : text ? [text] : [],
        };
      case "img":
        return { tag: "img", attrs: { src: $(element).attr("src") } };
      case "a":
        return {
          tag: "a",
          attrs: { href: $(element).attr("href") },
          children: children.length ? children : text ? [text] : [],
        };
      default:
        return text || "";
    }
  }

  $("body")
    .contents()
    .each((_, element) => {
      const convertedElement = convertElement(element);
      if (convertedElement && convertedElement !== "") {
        content.push(convertedElement);
      }
    });

  return content.filter((item) => item !== ""); // 最后再次过滤掉任何空字符串
};

module.exports = { createPage, htmlToNode };
