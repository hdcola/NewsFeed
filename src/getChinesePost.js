const ollama = require("ollama").default;
const config = require("./config.js");
const { domToNode } = require("./telegraph.js");

const getPost = async ({ title, summary, content }) => {
  try {
    const postTitle = await getTitle({ title, summary, content });
    const postSummary = await getSummary({ title, summary, content });
    const postHtmlContent = await getContent({ title, summary, content });
    const postContent = domToNode(postHtmlContent).children;

    return {
      title: postTitle,
      summary: postSummary,
      content: postContent,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getTitle = async ({ title, summary, content }) => {
  try {
    return aiGenerate([
      "请使用以下新闻帮我生成一个中文的新闻标题,在10字左右,不要带有任何格式，不要让我选择:",
      "",
      title,
      summary,
      content,
    ]);
  } catch (err) {
    throw new Error(err.message);
  }
};

const getSummary = async ({ title, summary, content }) => {
  try {
    return aiGenerate([
      "请使用以下新闻帮我生成一段纯文本格式的中文新闻简介,在50字上下:",
      "",
      title,
      summary,
      content,
    ]);
  } catch (err) {
    throw new Error(err.message);
  }
};

const getContent = async ({ title, summary, content }) => {
  try {
    return aiGenerate([
      content,
      "",
      "",
      "请使用以上内容帮我翻译为一篇HTML格式的中文新闻,请保留新闻中的图片和图片描述:",
    ]);
  } catch (err) {
    throw new Error(err.message);
  }
};

const aiGenerate = async (promptLines) => {
  try {
    // const promptLines = [
    //   `${prompt}`,
    //   "",
    //   `${title}`,
    //   `${summary}`,
    //   `${content}`,
    // ];

    const promptStr = promptLines.join("\n");

    const model = config.model;
    const res = await ollama.generate({ model, prompt: promptStr });
    const response = res.response.trim();
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getTitle, getContent, getSummary, getPost };
