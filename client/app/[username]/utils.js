export const getUser = async (username, setUser) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/get/user/${username}`);
    if (response.ok) {
      const data = await response.json();
      setUser(data);
    }
  } catch (error) {
    console.log(error);
  }
};
