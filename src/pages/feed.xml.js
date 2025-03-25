import rss, { rssSchema } from "@astrojs/rss";
import { getCollection, defineCollection } from "astro:content";

const tags = ["<language>en-us</language>", "<language>ru</language>"];

export async function GET(context) {
  const content = [
    // ...(await getCollection("notes")),
    ...(await getCollection("devlog")),
  ];
  return rss({
    title: "TakiMoysha | Feed",
    description: "Blog, notes and reports about development.",
    site: context.site,
    items: content.map((doc) => ({
      title: doc.data.title,
      date: doc.data.date,
      tags: doc.data.tags,
      link: `/content/${doc.slug}`,
    })),
    customData: tags.join(""),
  });
}
