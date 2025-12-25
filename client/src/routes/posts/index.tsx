import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import "./-styles/posts.css";
import { fetchPosts, postsOptions } from "./-services/fetch-posts";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { deletePost } from "./$postId/-services/delete-post";

type RouteSearch = {
  page: number;
};

export const Route = createFileRoute("/posts/")({
  component: RouteComponent,
  pendingComponent() {
    return <div>게시글 목록 로딩중... in pendingComponent</div>;
  },
  errorComponent() {
    return <div>게시글 목록 로딩 실패: in errorComponent</div>;
  },
  validateSearch: (search: Record<string, unknown>): RouteSearch => {
    return {
      page: search?.page ? Number(search.page) : 1,
    };
  },
  beforeLoad() {
    return {
      bar: 10,
    };
  },
  loaderDeps(opts) {
    return {
      page: opts.search.page,
    };
  },
  async loader({ context, deps }) {
    return context.queryClient.ensureQueryData(postsOptions(deps.page));
  },
});

function RouteComponent() {
  const { page } = Route.useSearch();
  const { data } = useSuspenseQuery({
    queryKey: ["posts", { page }],
    queryFn({ signal }) {
      return fetchPosts(page, signal);
    },
    retry(failureCount, error) {
      if (error.message.includes("페이지를 찾을 수 없습니다.")) {
        return false;
      }
      if (failureCount >= 3) {
        return false;
      }
      return true;
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["posts", { page }],
      });
    },
    onError(error) {
      alert((error as Error).message);
    },
  });

  return (
    <div className="posts-container">
      <ul className="posts">
        {data.posts.map((post) => (
          <li className="post" key={post.id}>
            <Link to="/posts/$postId" params={{ postId: post.id }}>
              {post.title}
            </Link>
            <button
              onClick={async () => {
                deletePostMutation.mutate(post.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <ol style={{ listStyle: "none", display: "flex", gap: 4 }}>
        {Array.from({ length: data.totalPages }).map((_, index) => (
          <li key={index}>
            <button
              onClick={() => {
                navigate({
                  to: "/posts",
                  search: {
                    page: index + 1,
                  },
                });
              }}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
