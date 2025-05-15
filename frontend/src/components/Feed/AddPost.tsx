import { uploadPost } from "@/services/posts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const AddPost = ({
  onPostAdded,
  setShowAddPost,
}: {
  onPostAdded: () => void;
  setShowAddPost: (val: boolean) => void;
}) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Post title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      if (image) {
        formData.append("image", image);
      }
      await uploadPost(formData);

      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      setTitle("");
      setImage(null);
      setError("");
      onPostAdded();
      setShowAddPost(false);
      toast.success("Uploaded", {
        style: {
          color: "green",
          border: "2px solid green",
        },
        position: "top-right",
      });
    } catch (err) {
      console.error("Failed to add post:", err);
      toast.success("Upload failed try again", {
        style: {
          color: "red",
          border: "2px solid red",
        },
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-md mb-6 bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Create a new post</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <Textarea
        placeholder="What's on your mind?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={4}
        className="mb-3"
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-3"
      />
      {image && <PreviewImage image={image} />}
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </Button>
    </div>
  );
};

export default AddPost;

const PreviewImage = ({ image }: { image: File }) => {
  return (
    <div className="mb-3">
      <img
        src={URL.createObjectURL(image)}
        alt="Selected preview"
        className="max-h-60 rounded"
      />
    </div>
  );
};
