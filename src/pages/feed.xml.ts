import rss from "@astrojs/rss";
import type { BlogDocType } from "@/content.config";
import { getBlogCollection } from "@/utils/content";

const tags = [
  "<language>en-us</language>",
  "<language>ru-RU</language>"
];

export async function GET(context: any) {
  const content: BlogDocType[] = [
    // ...(await getCollection("notes")),
    ...(await getBlogCollection()),
  ];
  return rss({
    title: "TakiMoysha | Feed",
    description: "Blog, notes and reports about development.",
    site: context.site,
    items: content.map((doc) => ({
      title: doc.data.title,
      date: doc.data.date,
      tags: doc.data.tags,
      link: `/content/${doc.id}`,
    })),
    customData: tags.join(""),
  });
}
