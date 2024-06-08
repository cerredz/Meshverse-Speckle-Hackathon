export const getTotalUsers = async (setArtists) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/get/users/size");
    const data = await response.json();
    setArtists(data.users);
  } catch (error) {
    console.error("Error getting the total users", error);
  }
};

export const getTotalUrls = async (setModels) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/get/urls/size");
    const data = await response.json();
    setModels(data.urls);
  } catch (error) {
    console.error("Error getting the total urls", error);
  }
};
