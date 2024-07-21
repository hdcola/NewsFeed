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
    "https://www.lapresse.ca/actualites/environnement/une-angoisse-nucleaire-coule-jusqu-a-montreal/2024-07-21/on-met-la-securite-du-public-dans-les-mains-du-prive.php";
  const { title, summary, content } = await fetchContent(url);
  console.log(title);

  const post = await getTitle({ title, summary: "", content: "" });
  // const post = await getSummary({ title: "", summary, content: "" });
  // const post = await getContent({ title: "", summary: "", content });
  console.log(post);

  // const post = await getPost({ title, summary, content });
  // console.log(post.title);

  // const pageUrl = await createPage(post.title, `<body>${post.content}</body>`);
  // console.log(pageUrl);
};

main();
