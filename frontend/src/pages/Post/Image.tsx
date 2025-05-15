import { getImage } from "@/services/posts";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Image = () => {
  const location = useLocation();
  const image = location.state?.image;
  const [imageUrl, setImageUrl] = useState<string>();
  const imageId = useParams().imageId || null;

  useEffect(() => {
    (async () => {
      if (!image && imageId) {
        try {
          const { status, data } = await getImage(imageId);
          console.log(status, data);
          if (status == "success") {
            setImageUrl(data.imageUrl);
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        setImageUrl(image);
      }
    })();
  }, [image, imageId]);
  if (!image && !imageId) {
    return (
      <div className="bg-black text-white flex justify-center items-center h-screen w-screen">
        <h1>404: Media Not Found</h1>
      </div>
    );
  }

  return (
    <div className="bg-red-50 flex justify-center items-center h-screen w-screen">
      <img src={imageUrl} alt="Full Size" className="max-w-[90%] max-h-[90%]" />
    </div>
  );
};

export default Image;
