import { Button } from "../ui/button";

const Blocked = ({
  status,
  handleUnblock,
}: {
  status: "BLOCKED_BY_YOU" | "BLOCKED_YOU";
  handleUnblock: () => void;
}) => {
  return (
    <div>
      {status === "BLOCKED_BY_YOU" ? (
        <>
          <Button variant="destructive" disabled>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user-x"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="18" x2="22" y1="6" y2="2" />
              <line x1="22" x2="18" y1="6" y2="2" />
            </svg>
            Blocked
          </Button>
          <Button variant="secondary" onClick={handleUnblock}>
            Unblock
          </Button>
        </>
      ) : (
        <Button variant="destructive" disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-x"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="18" x2="22" y1="6" y2="2" />
            <line x1="22" x2="18" y1="6" y2="2" />
          </svg>
          Blocked
        </Button>
      )}
    </div>
  );
};

export default Blocked;
