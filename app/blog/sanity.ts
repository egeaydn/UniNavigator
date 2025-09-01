import sanityClient from '@/config/sanity';

export async function getPosts() {
  return await sanityClient.fetch(`*[_type == "post"] | order(_createdAt desc){
    _id,
    title,
    slug,
    body,
    mainImage,
    _createdAt
  }`);
}
