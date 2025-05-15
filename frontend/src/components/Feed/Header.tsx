import { Plus } from "lucide-react";
import { Button } from "../ui/button";

const Header = ({
  setShowAddPost,
  showAddPost,
}: {
  setShowAddPost: (val: boolean) => void;
  showAddPost: boolean;
}) => {
  return (
    <div>
      {" "}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Feed</h1>
        <Button onClick={() => setShowAddPost(!showAddPost)}>
          <Plus className="mr-2 h-4 w-4" />
          {showAddPost ? "Cancel" : "Add Post"}
        </Button>
      </div>
    </div>
  );
};

export default Header;
