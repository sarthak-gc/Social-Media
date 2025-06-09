import { AXIOS_CONTENT } from "@/lib/axios";

const Actions = ({
  toggleReactionOptions,
  postId,
}: {
  toggleReactionOptions: () => void;
  postId: string;
}) => {
  return (
    <div>
      <ul className="flex space-x-4 p-4 rounded-lg absolute -bottom-4 -left-10">
        {[
          {
            icon: "❤️",
            label: "Heart",
            bgColor: "bg-red-500",
            action: "Heart",
          },
          {
            icon: "👍",
            label: "Like",
            bgColor: "bg-blue-600",
            action: "Like",
          },
          {
            icon: "😂",
            label: "Laugh",
            bgColor: "bg-yellow-600",
            action: "Laugh",
          },
          {
            icon: "😡",
            label: "Angry",
            bgColor: "bg-orange-600",
            action: "Angry",
          },
          {
            icon: "👎",
            label: "Dislike",
            bgColor: "bg-gray-600",
            action: "Dislike",
          },
        ].map(({ icon, label, bgColor, action }) => (
          <li className="relative group" key={action}>
            <button
              className={`p-3 rounded-full text-white ${bgColor} transform transition-transform duration-300 ease-in-out hover:scale-110 active:scale-90`}
              onClick={() => {
                const emoji = document.querySelector(`#emoji-${action}`);
                emoji?.classList.add("shatter");
                setTimeout(() => {
                  toggleReactionOptions();
                  AXIOS_CONTENT.post(`${postId}/react`, {
                    type: action,
                  });
                }, 300);
              }}
              id={`emoji-${action}`}
            >
              {icon}
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Actions;
