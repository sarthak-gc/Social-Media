import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";

const ProfileImage = ({ pfp, name }: { pfp: string; name: string }) => {
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [newProfilePicToShow, setNewProfilePicToShow] = useState<string | null>(
    null
  );

  const labelText = pfp ? "Change Profile Picture" : "Add Profile Picture";
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewProfilePicToShow(reader.result);
      }
    };

    reader.readAsDataURL(file);
    setNewProfilePic(file);
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

  //   const formData = new FormData();
  //   formData.append("image", newProfilePic); // Use the actual File object here

  //   try {
  //     const response = await axios.put(
  //       "http://localhost:8787/user/pfp",
  //       formData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           // Axios will set Content-Type automatically; don't set it yourself
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     console.log("Submitted");
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newProfilePic) return;
    const formData = new FormData();
    formData.append("image", newProfilePic);

    console.log(newProfilePicToShow);
    const pfp = await axios.put("http://localhost:8787/user/pfp", formData, {
      withCredentials: true,
    });
    console.log(pfp);
    console.log("Submitted");
  };
  return (
    <div className="relative group w-32 h-32">
      {pfp || newProfilePicToShow ? (
        <img
          src={newProfilePicToShow || pfp}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <label
        htmlFor="pfp-upload"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
      >
        <span className="text-xs text-white text-center">{labelText}</span>
        {/* <span
          onClick={handlePfpChange}
          className="text-xs text-white text-center"
        >
          Change Pfp
        </span> */}
      </label>
      <form action="" onSubmit={handleSubmit}>
        <input
          id="pfp-upload"
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
        {newProfilePicToShow && <input type="submit" value={"Upload Image"} />}
      </form>
    </div>
  );
};

export default ProfileImage;
