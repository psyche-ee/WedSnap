const CLOUD_NAME = "dlhbjqz8g";
const UPLOAD_PRESET = "wedsnap_uploads";

export const uploadToCloudinary = async (asset) => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri: asset.uri,
      type: asset.mimeType || "image/jpeg",
      name: asset.fileName || "upload.jpg",
    });

    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log("Cloudinary response:", data);

    return data;
  } catch (error) {
    console.log("Cloudinary error:", error);
    throw error;
  }
};