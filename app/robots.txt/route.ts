export function GET(): Response {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: https://wrightaisolutions.com/sitemap.xml`

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}