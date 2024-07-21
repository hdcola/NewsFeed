const { fetchContent } = require("./fetchContent");
const { getPost } = require("./getChinesePost");
const { createPage } = require("./telegraph");

const main = async () => {
  const url =
    "https://www.lapresse.ca/actualites/2024-07-16/programme-cycliste-averti/quand-l-ecole-fait-pedaler-les-jeunes.php";
  const { title, summary, content } = await fetchContent(url);
  // console.log(content);
  const post = await getPost({ title, summary, content });
  console.log(content);
  // const pageUrl = await createPage(post.title, post.content);
  // console.log(pageUrl);
};

main();
