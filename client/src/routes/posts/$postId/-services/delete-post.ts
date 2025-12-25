import type { Post } from "./fetch-post";

type DeletePostResponse = {
  message: string;
  id: Post["id"];
};

export async function deletePost(id: Post["id"]): Promise<DeletePostResponse> {
  const response = await fetch(`http://localhost:3000/posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok && [404, 408].includes(response.status)) {
    const errorJson = await response.json();
    throw new Error(errorJson.error);
  }
  return await response.json();
}
