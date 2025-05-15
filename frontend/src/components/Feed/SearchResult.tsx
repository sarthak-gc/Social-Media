import type { UserI } from "@/pages/types/types";
import { useNavigate } from "react-router-dom";

const SearchResult = ({ searchResults }: { searchResults: UserI[] }) => {
  const navigate = useNavigate();
  return (
    searchResults.length > 0 && (
      <div className="absolute z-10 w-full max-w-md mt-1 bg-white rounded-md shadow-lg border">
        {searchResults.map((user) => (
          <div
            key={user.userId}
            onClick={() => navigate(`/user/${user.userId}`)}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {user.firstName} {user.lastName}
          </div>
        ))}
      </div>
    )
  );
};

export default SearchResult;
