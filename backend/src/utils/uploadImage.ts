import { encodeBase64 } from "hono/utils/encode";

export const uploadImage = async (formDataToSend: FormData) => {
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/deljnxufx/upload`;

  const response = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formDataToSend,
  });

  const result = (await response.json()) as {
    secure_url: string;
    url: string;
  };

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }
  return result;
};

export const validateImage = async (image: File) => {
  
  const imageByteArrayBuffer = await image.arrayBuffer();
  const imageBase64 = encodeBase64(imageByteArrayBuffer);
  const base64Image = `data:${image.type};base64,${imageBase64}`;
  const formDataToSend = new FormData();
  formDataToSend.append("file", base64Image);
  formDataToSend.append("upload_preset", "unsigned");

  return formDataToSend;
};
