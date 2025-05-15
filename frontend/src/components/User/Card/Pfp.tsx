import { useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import type { PfpPropI } from "@/pages/types/types";
import { changePfp } from "@/services/user";

const ProfileImage = ({ pfp, name, editable }: PfpPropI) => {
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [newProfilePicToShow, setNewProfilePicToShow] = useState<string | null>(
    null
  );
  const [uploadStatus, setUploadStatus] = useState<
    "UPLOADING" | null | "UPLOADED" | "FAILED"
  >(null);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newProfilePic) return;

    try {
      setUploadStatus("UPLOADING");
      toast.info("Uploading....", {
        style: {
          color: "#E3A857",
          border: "2px solid #E3A857",
        },
        position: "top-right",
      });

      const formData = new FormData();
      formData.append("image", newProfilePic);

      await changePfp(formData);

      setUploadStatus("UPLOADED");
      toast.success("Uploaded", {
        style: {
          color: "green",
          border: "2px solid green",
        },
        position: "top-right",
      });
      setNewProfilePic(null);
    } catch (err) {
      console.error(err);
      setUploadStatus("FAILED");
      toast.error("Failed", {
        style: {
          color: "red",
          border: "2px solid red",
        },
        position: "top-right",
      });
    }
  };

  return (
    <div>
      <div className="relative group w-32 h-32">
        <Image
          pfp={pfp}
          name={name}
          newProfilePicToShow={newProfilePicToShow}
          labelText={labelText}
          editable={editable}
        />
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex justify-center">
        <input
          id="pfp-upload"
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />

        {newProfilePicToShow && (
          <Button type="submit" variant="secondary" size="icon">
            {uploadStatus === "UPLOADING" && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {uploadStatus === "UPLOADED" && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {uploadStatus === "FAILED" && (
              <X className="w-4 h-4 text-red-500" />
            )}
            {!uploadStatus && <Upload className="w-4 h-4" />}
          </Button>
        )}
      </form>
    </div>
  );
};

export default ProfileImage;

const Image = ({
  pfp,
  newProfilePicToShow,
  name,
  labelText,
  editable,
}: {
  pfp?: string | null;
  newProfilePicToShow?: string | null;
  name: string;
  editable: boolean;
  labelText: string;
}) => {
  return (
    <div className=" h-full w-full rounded-full">
      {pfp || newProfilePicToShow ? (
        <img
          src={newProfilePicToShow || pfp || ""}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-black  flex items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {editable && (
        <>
          <label
            htmlFor="pfp-upload"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          >
            <span className="text-xs text-white text-center">{labelText}</span>
          </label>
        </>
      )}
    </div>
  );
};
