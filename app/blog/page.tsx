import { title } from "@/components/primitives";

import { getPosts } from './sanity';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p>Henüz blog yazısı yok.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post: any) => (
            <li key={post._id} className="border rounded p-6 bg-white shadow">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-2">{post.body?.slice(0, 120)}...</p>
              <span className="text-xs text-gray-500">{new Date(post._createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
