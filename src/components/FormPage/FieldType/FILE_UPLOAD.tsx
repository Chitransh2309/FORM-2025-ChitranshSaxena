import { useState } from "react";

export default function FileUpload({
  onUpload,
  disabled = false, // ✅ default to false
}: {
  onUpload: (url: string) => void;
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filetype", file.type);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        onUpload(data.url); // send the uploaded file URL to parent
      }
    } catch (err) {
      console.error("❌ Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <label
      className={`block w-full cursor-pointer border-2 border-dashed border-[#8CC7AA] rounded-lg py-6 px-4 text-center transition
        ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#3b3b3b]" : "hover:bg-[#e8f5f0] dark:hover:bg-[#4a4a4a]"}`}
    >
      <span className="text-[#61A986] font-medium">
        {uploading ? "Uploading..." : fileName || "Click to upload a file"}
      </span>
      <input
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled} // ✅ disables input logic
      />
    </label>
  );
}
