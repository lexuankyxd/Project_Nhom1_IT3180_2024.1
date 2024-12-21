import fetch from "node-fetch";
import imageType from "image-type";

async function fetchImageAndGetType(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const type = imageType(buffer);

  if (type) {
    console.log(`Image type: ${type.mime}`);
  } else {
    console.log("Could not determine image type");
  }
}

const imageUrl = "https://example.com/image.jpg";
fetchImageAndGetType(imageUrl);
