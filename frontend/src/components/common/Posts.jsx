import { useQuery } from "@tanstack/react-query";

import Post from "./Post";
import LoadingSpinner from "./LoadingSpinner";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    if (username && feedType === "posts") return `/api/posts/user/${username}`;
    if (userId && feedType === "likes") return `/api/posts/likes/${userId}`;
    return feedType === "following" ? "/api/posts/following" : "/api/posts/all";
  };

  const {
    data: posts,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", feedType, username, userId],
    queryFn: async () => {
      const res = await fetch(getPostEndpoint());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
      return data;
    },
  });

  if (isLoading || isRefetching) {
    return (
      <div className='flex justify-center py-10'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='alert alert-error m-4'>
        <span>{error.message}</span>
        <button className='btn btn-sm' onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className='text-center py-8 text-base-content/70'>
        No posts to show.
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
