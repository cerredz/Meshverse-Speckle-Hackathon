// functions used in more than one file
export const downloadMesh = (fileUrl) => {
  const link = document.createElement("a");
  link.href = `/images/collection/${fileUrl}.glb`;
  link.download = `${fileUrl}.glb`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
