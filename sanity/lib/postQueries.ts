import { groq } from "next-sanity";
import { client } from "./client";
import { Post } from "@/types/sanityTypes";

export async function getAllPosts(): Promise<{
  message: string | unknown;
  data: null | Post[];
}> {
  const postsQuery = groq`
  *[_type == "post"]
  {
    body,
    title,
    "slug": slug.current,
    "author": author -> {
        name,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        bio
    },
    "imageUrl": mainImage.asset->url,
    "alt": mainImage-> { 
        alt
    },
    "categories": categories[] -> {
        title,
        "slug": slug.current,
        description
    },
  }
    `;

  try {
    const posts = await client.fetch(postsQuery);

    if (!posts) {
      return {
        message: "Herhangi bir post bulunamadı",
        data: null,
      };
    }

    return { message: "Başarılı", data: posts };
  } catch (error) {
    return { message: error, data: null };
  }
}

export async function getSinglePost(slug: string): Promise<{
  message: string | unknown;
  data: null | Post;
}> {
  const postsQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    body,
    title,
    "slug": slug.current,
    "author": author -> {
        name,
        "slug": slug.current,
        "imageUrl": image.asset->url,
        bio
    },
    "imageUrl": mainImage.asset->url,
    "alt": mainImage-> { 
        alt
    },
    "categories": categories[] -> {
        title,
        "slug": slug.current,
        description
    },
  }
    `;

  try {
    const post = await client.fetch(postsQuery, {slug});

    if (!post) {
      return {
        message: "Herhangi bir post bulunamadı",
        data: null,
      };
    }

    return { message: "Başarılı", data: post };
  } catch (error) {
    return { message: error, data: null };
  }
}