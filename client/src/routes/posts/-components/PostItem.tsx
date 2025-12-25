import { Link } from "@tanstack/react-router";
import type { Post } from "../$postId/-services/fetch-post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../$postId/-services/delete-post";

type PostItemProps = {
  id: Post["id"];
  title: Post["title"];
};
export function PostItem({ id, title }: PostItemProps) {
  const queryClient = useQueryClient();
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onError(error) {
      console.log("onError");
      console.log({
        error,
      });
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess(data, variables, onMutateResult, context) {
      console.log("onSuccess");
      console.log({
        data,
        variables,
        onMutateResult,
        context,
      });
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSettled(data, error, variables, onMutateResult, context) {
      console.log("onSettled");
      console.log({
        data,
        error,
        variables,
        onMutateResult,
        context,
      });
    },
  });
  return (
    <li className="post" key={id}>
      <Link to="/posts/$postId" params={{ postId: id }}>
        {title}
      </Link>
      <button
        disabled={deletePostMutation.isPending}
        onClick={async () => {
          deletePostMutation.mutate(id, {
            onError(error, variables, onMutateResult, context) {
              console.log("onError in mutate");
            },
            onSuccess(data, variables, onMutateResult, context) {
              console.log("onSuccess in mutate");
            },
            onSettled(data, error, variables, onMutateResult, context) {
              console.log("onSettled in mutate");
            },
          });
        }}
      >
        {deletePostMutation.isPending ? "loading..." : "Delete"}
      </button>
    </li>
  );
}
