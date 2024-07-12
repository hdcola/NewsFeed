const ollama = require("ollama").default;
const config = require("./config.js");

const getTitle = async ({ title, summary, content }) => {
  try {
    const promptLines = [
      "请使用以下新闻帮我生成一个中文的新闻标题,在10字左右,不要带有任何格式，不要让我选择:",
      "",
      `${title}`,
      `${summary}`,
      `${content}`,
    ];

    const prompt = promptLines.join("\n");

    const model = config.model;
    const res = await ollama.generate({ model, prompt });
    const post = res.response.trim();
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getSummary = async ({ title, summary, content }) => {
  try {
    const promptLines = [
      "请使用以下新闻帮我生成一段纯文本格式的中文新闻简介,在50字上下:",
      "",
      `${title}`,
      `${summary}`,
      `${content}`,
    ];

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
      "请使用以下新闻帮我生成一篇纯文本格式的中文新闻内容:",
      "",
      `${title}`,
      `${summary}`,
      `${content}`,
    ];

    const prompt = promptLines.join("\n");

    const model = config.model;
    const res = await ollama.generate({ model, prompt });
    const post = res.response.trim();
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getTitle, getContent, getSummary };
