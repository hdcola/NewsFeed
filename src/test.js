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
    "https://www.lapresse.ca/actualites/justice-et-faits-divers/2024-07-31/ville-marie/des-coups-de-feu-tires-durant-la-nuit-n-ont-fait-aucun-blesse.php";
  const { title, summary, content } = await fetchContent(url);
  console.log(content);

  // const post = await getTitle({ title, summary: "", content: "" });
  // const post = await getSummary({ title: "", summary, content: "" });
  const post = await getContent({ title: "", summary: summary, content });
  console.log(post);

  // const post = await getPost({ title, summary, content });
  // console.log(post.content);

  // const pageUrl = await createPage(post.title, `<body>${post.content}</body>`);
  // console.log(pageUrl);
};

main();
