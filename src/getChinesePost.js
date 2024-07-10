const ollama = require("ollama").default;

module.exports = async ({ model, title, summary, content }) => {
  try {
    const promptLines = [
      "请使用以下新闻帮我生成一篇中文的新闻:",
      `Title: ${title}`,
      `Summary: ${summary}`,
    ];

    if (content) {
      promptLines.push("", `Content: ${content}`);
    }

    const prompt = promptLines.join("\n");

    const res = await ollama.generate({ model, prompt });
    const post = res.response.trim();
    return post;
  } catch (err) {
    throw new Error(err.message);
  }
};
