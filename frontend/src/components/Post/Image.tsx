import { useLocation } from "react-router-dom";

const Image = () => {
  const location = useLocation();
  console.log(location,"hjhjh");

  const image = location.state?.image;
  console.log(image,"hjhj");

  if (!image) {
    return (
      <div className="bg-black text-white flex justify-center items-center h-screen w-screen">
        <h1>404: Media Not Found</h1>
      </div>
    );
  }

  return (
    <div className="bg-red-50 flex justify-center items-center h-screen w-screen">
      <img src={image} alt="Full Size" className="max-w-[90%] max-h-[90%]" />
    </div>
  );
};

export default Image;
