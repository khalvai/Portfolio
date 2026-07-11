import type { APIRoute } from 'astro';
import fileContent from '../../public/hexagonal-bio.txt?raw';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const userAgent = request.headers.get('user-agent') || '';
  const isCurl = userAgent.toLowerCase().includes('curl');

  if (isCurl) {
    return new Response(fileContent, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/home' },
  });
};
