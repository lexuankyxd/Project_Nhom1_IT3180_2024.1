import fetch from "node-fetch";

export async function downloadImageToBuffer(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get Content-Type
    const contentType = response.headers.get("content-type");

    // Get Content-Disposition
    const contentDisposition = response.headers.get("content-disposition");
    let filename = "unknown";

    if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        contentDisposition,
      );
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, ""); // Remove quotes if present
      }
    }
    const type = contentType.split("/")[1];

    // You can also read the file data as a buffer if needed
    const buffer = await response.arrayBuffer();
    return { buffer, filename, type };
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
