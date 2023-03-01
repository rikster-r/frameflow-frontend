import usePosts from "../hooks/usePosts";
import { PostImage } from "./";
import useUser from "../hooks/useUser";

type Props = {
  pageOwner: IUser;
};

const PostImagesGrid = ({ pageOwner }: Props) => {
  const { user } = useUser();
  const { posts, error } = usePosts(pageOwner.username);

  if (error || !posts) return <></>;

  return (
    <>
      {posts.map((post) => {
        return (
          <PostImage
            post={post}
            key={post._id}
            user={user}
            postOwner={pageOwner}
          />
        );
      })}
    </>
  );
};

export default PostImagesGrid;
