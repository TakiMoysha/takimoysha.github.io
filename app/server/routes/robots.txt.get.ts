import { defineEventHandler, getRequestURL } from 'h3';

export default defineEventHandler((event) => {
  const siteUrl = getRequestURL(event).origin;
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  event.node.res.setHeader('Content-Type', 'text/plain');
  return robotsTxt;
});
