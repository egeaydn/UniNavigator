import { client } from '@/sanity/lib/client';

export async function getPosts() {
  return await client.fetch(`*[_type == "post"] | order(_createdAt desc)`);
}
