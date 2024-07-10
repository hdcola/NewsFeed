const ollama = require("ollama").default;

module.exports = async ({ model, title, description, content }) => {
  try {
    const promptLines = [
      "Please provide the Chinese translation for the following text:",
      `${title}`,
      `${description}`,
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
