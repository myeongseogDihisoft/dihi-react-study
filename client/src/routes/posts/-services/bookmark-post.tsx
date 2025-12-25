import type { Post } from "../$postId/-services/fetch-post";

export type BookmarkPostResponse = Post;

export async function bookmarkPost(id: Post["id"]): Promise<Post> {
  const response = await fetch(`http://localhost:3000/posts/${id}/bookmark`, {
    method: "PUT",
  });
  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(errorJson.error);
  }
  return await response.json();
}
