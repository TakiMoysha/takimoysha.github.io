import { defineEventHandler, getRequestURL } from 'h3';

export default defineEventHandler(async (event) => {
  const siteUrl = getRequestURL(event).origin;

  // TODO: use nuxt content api
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TakiMoysha | Feed</title>
    <description>Blog, notes and reports about development.</description>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`;

  event.node.res.setHeader('Content-Type', 'application/xml');
  return rssXml;
});
