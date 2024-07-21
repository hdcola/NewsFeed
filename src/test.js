const { fetchContent } = require("./fetchContent");
const {
  getPost,
  getContent,
  getTitle,
  getSummary,
} = require("./getChinesePost");
const { createPage } = require("./telegraph");

const main = async () => {
  const url =
    "https://www.lapresse.ca/actualites/2024-07-16/programme-cycliste-averti/quand-l-ecole-fait-pedaler-les-jeunes.php";
  const { title, summary, content } = await fetchContent(url);
  // console.log(content);
  // const post = await getTitle({ title, summary: "", content: "" });
  // const post = await getSummary({ title: "", summary, content: "" });
  // const post = await getContent({ title: "", summary: "", content });
  const post = await getPost({ title, summary, content });
  // console.log(post);
  const pageUrl = await createPage(post.title, `<body>${post.content}</body>`);
  console.log(pageUrl);
};

main();
