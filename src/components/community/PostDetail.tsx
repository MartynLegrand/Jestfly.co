
import React from "react";
import { useParams } from "react-router-dom";
import { usePostDetail } from "./post/usePostDetail";
import PostDetailSkeleton from "./post/PostDetailSkeleton";
import PostNotFound from "./post/PostNotFound";
import BackToCommunityButton from "./post/BackToCommunityButton";
import PostContent from "./post/PostContent";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { post, isLoading } = usePostDetail(id);

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return <PostNotFound />;
  }

  return (
    <>
      <BackToCommunityButton />
      <PostContent post={post} />
    </>
  );
};

export default PostDetail;
