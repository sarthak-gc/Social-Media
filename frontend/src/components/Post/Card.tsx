import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PostCardProps {
  postId: string;
  title: string;
  createdAt: string;
  images: {
    imageId: string;
    url: string;
  }[];
  user: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
}

const PostCard = ({ post }: { post: PostCardProps }) => {
  const fullName = `${post.user.firstName} ${post.user.middleName || ""} ${
    post.user.lastName
  }`.trim();
  const formattedDate = new Date(post.createdAt).toLocaleString();

  return (
    <Card className="max-w-xl mx-auto shadow-md my-2">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-300" />
          <div>
            <p className="font-semibold text-sm">{fullName}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {post.title && <p className="mb-2 text-sm">{post.title}</p>}

        {post.images.length > 0 ? (
          <Link
            to={`/image/${post.images[0].imageId}`}
            // target="_blank"
            state={{
              image: post.images[0].url,
            }}
          >
            <img
              src={post.images[0].url}
              alt="Post"
              className="rounded max-h-[400px] w-full object-cover"
            />
          </Link>
        ) : (
          "HI"
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
