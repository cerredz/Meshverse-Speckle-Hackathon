export const checkUser = async (email, image, dispatch, setUser) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/check/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, image: image }),
    });
    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem("meshverse-user", JSON.stringify(userData));
      // Dispatch the user information to the Redux store
      dispatch(setUser({ user: userData }));
    }
  } catch (error) {
    console.log(error);
  }
};
