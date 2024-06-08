export const getModelUrls = async (setModels) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/get/urls", {
      method: "GET",
    });
    // extract the urls found from the MongoDB database
    if (response.ok) {
      const data = await response.json();
      const urls = data.urls;
      setModels(urls);
      console.log(urls);
    }
  } catch (error) {
    console.error("Error getting the image urls from the backend", error);
  }
};
