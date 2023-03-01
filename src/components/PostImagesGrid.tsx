import usePosts from "../hooks/usePosts";
import { PostImage } from "./";
import useUser from "../hooks/useUser";

type Props = {
  pageOwner: IUser;
  path: "saved" | "posts";
};

const PostImagesGrid = ({ pageOwner, path }: Props) => {
  const { user } = useUser();
  const { posts, error } = usePosts(pageOwner.username, path);

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
            path={path}
          />
        );
      })}
    </>
  );
};

export default PostImagesGrid;
