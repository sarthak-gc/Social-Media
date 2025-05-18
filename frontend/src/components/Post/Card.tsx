import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { PostI } from "@/pages/types/types";
import { Link } from "react-router-dom";

const PostCard = ({ post }: { post: PostI }) => {
  const fullName = `${post.user.firstName} ${post.user.middleName || ""} ${
    post.user.lastName
  }`.trim();
  const formattedDate = new Date(post.createdAt).toLocaleString();

  return (
    <Link to={`/post/${post.postId}`}>
      <Card className="max-w-xl mx-auto shadow-md my-2">
        <CardHeader>
          <Link
            to={`/user/${post.user.userId}`}
            className="flex items-center space-x-3"
          >
            <UserImage post={post} fullName={fullName} />
            <PostData formattedDate={formattedDate} fullName={fullName} />
          </Link>
        </CardHeader>

        <CardContent>
          {post.title && <p className="mb-2 text-sm">{post.title}</p>}
          {post.images.length > 0 && (
            <Image url={post.images[0].url} imageId={post.images[0].imageId} />
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;

const UserImage = ({ post, fullName }: { post: PostI; fullName: string }) => {
  return (
    <div
      className={`h-10 w-10 rounded-full ${
        !post.user.pfp && "bg-gray-300 items-center justify-center flex"
      }`}
    >
      {post.user.pfp && <img src={post.user.pfp} alt="a" />}
      {!post.user.pfp && fullName.charAt(0).toUpperCase()}
    </div>
  );
};

const PostData = ({
  fullName,
  formattedDate,
}: {
  fullName: string;
  formattedDate: string;
}) => {
  return (
    <div>
      <p className="font-semibold text-sm">{fullName}</p>
      <p className="text-xs text-gray-500">{formattedDate}</p>
    </div>
  );
};

const Image = ({ imageId, url }: { imageId: string; url: string }) => {
  return (
    <Link
      to={`/image/${imageId}`}
      state={{
        image: url,
      }}
    >
      <img
        src={url}
        alt="Post"
        className="rounded max-h-[400px] w-full object-cover"
      />
    </Link>
  );
};
