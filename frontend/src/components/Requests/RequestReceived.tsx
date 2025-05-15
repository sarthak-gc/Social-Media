import { Button } from "../ui/button";

const RequestReceived = ({
  rejectRequest,
  acceptRequest,
}: {
  rejectRequest: () => void;
  acceptRequest: () => void;
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={acceptRequest}>
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
          className="lucide lucide-user-plus"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="1" y2="7" />
          <line x1="16" x2="22" y1="4" y2="4" />
        </svg>
        Accept
      </Button>
      <Button variant="outline" onClick={rejectRequest}>
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
          className="lucide lucide-user-minus"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="2" x2="10" y1="15" y2="15" />
        </svg>
        Reject
      </Button>
    </div>
  );
};

export default RequestReceived;
