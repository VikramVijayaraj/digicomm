"use client";

export default function FileDownloader({ fileUrls, fileName }) {
  async function handleDownload() {
    try {
      // Download all files
      for (const fileUrl of fileUrls) {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // You can customize the name
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      console.log("All files downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      throw new Error("Failed to download files");
    }
  }

  return (
    <p className="font-normal w-full h-full" onClick={handleDownload}>
      Download
    </p>
  );
}
