export const handleChange = async (e, setIsLoadingMesh, setFileUrl) => {
  try {
    const file = e.target.files[0];
    console.log(file);

    setIsLoadingMesh(true);
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
      setIsLoadingMesh(false);
    }
  } catch (error) {
    console.error("Error Uploading the Image onto the backend", error);
  }
};

export const handleSubmit = async (
  e,
  fileUrl,
  authToken,
  streamName,
  setIsLoadingAddingToSpeckle,
  setIsCompleted,
  setError,
  setStreamID,
  setStreamName
) => {
  e.preventDefault();
  try {
    setIsLoadingAddingToSpeckle(true);

    if (streamName == null) {
      setError({ stream: "Did Not Enter Stream Name" });
      return;
    }

    const send = await fetch(
      `http://127.0.0.1:5000/add/speckle/${fileUrl}/${authToken}/${streamName}`,
      {
        method: "POST",
      }
    );
    if (send.ok) {
      const data = await send.json();
      setStreamID(data.stream_id);
      setStreamID(data.stream_name);
      setIsLoadingAddingToSpeckle(false);
      setIsCompleted(true);
    }
  } catch (error) {
    console.error("Error adding the 3d mesh into speckle", error);
  }
};

export const handleReceiveSubmit = async (
  e,
  streamID,
  setIsLoadingReceive,
  setIsCompleted,
  authToken,
  setData
) => {
  e.preventDefault();
  try {
    setIsLoadingReceive(true);
    setData(null);
    const response = await fetch(
      `http://127.0.0.1:5000/get/speckle/${authToken}/${streamID}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setIsLoadingReceive(false);
      setIsCompleted(true);
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleDownloadAllData = (e, data) => {
  e.preventDefault();
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "data.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
};
