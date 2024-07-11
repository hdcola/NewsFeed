const ollama = require("ollama").default;
const config = require("./config.js");

const getTitle = async (title, summary, content) => {
  try {
    const promptLines = [
      "请使用以下新闻帮我生成一篇中文的新闻标题:",
      `Title: ${title}`,
      `Summary: ${summary}`,
    ];

    if (content) {
      promptLines.push("", `Content: ${content}`);
    }

    const prompt = promptLines.join("\n");

    const model = config.model;
    const res = await ollama.generate({ model, prompt });
    const post = res.response.trim();
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getContent = async (title, summary, content) => {
  try {
    const promptLines = [
      "请使用以下新闻帮我生成一篇中文的新闻内容:",
      `Title: ${title}`,
      `Summary: ${summary}`,
    ];

    if (content) {
      promptLines.push("", `Content: ${content}`);
    }

    const prompt = promptLines.join("\n");

    const model = config.model;
    const res = await ollama.generate({ model, prompt });
    const post = res.response.trim();
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getTitle, getContent };
