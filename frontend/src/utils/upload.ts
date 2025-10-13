export async function uploadToCloudinary(file: File): Promise<string | null> {
  const cloudName = "dznjfvusx"; // from Cloudinary dashboard
  const uploadPreset = "morph_preset"; // from step 1

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (res.ok) {
    return data.secure_url; // ✅ public image URL
  } else {
    console.error("Cloudinary upload error:", data);
    return null;
  }
}
