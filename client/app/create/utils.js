import Axios from "axios";

export const handleSubmit = async (
  e,
  email,
  fileUrl,
  setCompleted,
  setIsLoading3D
) => {
  e.preventDefault();
  try {
    setIsLoading3D(true);
    const generate = await fetch(
      `http://127.0.0.1:5000/gen2d/${fileUrl}/${email}`,
      {
        method: "POST",
      }
    );

    setIsLoading3D(false);
    setCompleted(true);
  } catch (error) {
    console.error(
      "Error Handing the Submit Functionality on the Create page",
      error
    );
  }
};

export const handleChange = async (e, setIsLoading2D, setFile, setFileUrl) => {
  try {
    const file = e.target.files[0];
    setFile(file); // triggers the loading spinner
    const formData = new FormData();
    formData.append("image", file);

    // upload the file to the backend
    const upload = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    // extract the url generated from the backend
    if (upload.ok) {
      const data = await upload.json();
      console.log(data);
      setFileUrl(data.file_name);
      //alert("File uploaded successfully: " + data.file_name);
    }
    setIsLoading2D(false);
  } catch (error) {
    console.error("Error Uploading the Image onto the backend", error);
  }
};

export const handleReset = (
  setCompleted,
  setFile,
  setFileUrl,
  setIsLoading2D,
  setIsLoading3D
) => {
  setFile(null);
  setFileUrl(null);
  setIsLoading2D(true);
  setIsLoading3D(false);
  setCompleted(false);
};

export const handleDownload = (
  fileUrl,
  setFile,
  setFileUrl,
  setIsLoading2D,
  setIsLoading3D,
  setCompleted
) => {
  const link = document.createElement("a");
  link.href = `/images/collection/${fileUrl}.glb`; // Assuming this is the correct path
  link.download = `${fileUrl}.glb`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setFile(null);
  setFileUrl(null);
  setIsLoading2D(true);
  setIsLoading3D(false);
  setCompleted(false);
};

export const handleUseCamera = async (
  email,
  setFileUrl,
  setCompleted,
  setIsLoading3D
) => {
  try {
    console.log(email);
    setIsLoading3D(true);
    setCompleted(false);
    const response = await fetch(`http://127.0.0.1:5000/genLive/${email}`, {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setIsLoading3D(false);
      setCompleted(true);
      setFileUrl(data.img_url);
    }
  } catch (error) {
    console.log("Error using the user's camera", error);
  }
};
