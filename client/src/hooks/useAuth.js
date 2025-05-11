import { useState } from "react";
const BASE_URL = "http://localhost:5000";

export const useAuth = () => {
  const [error, setError] = useState("");
  const [flag, setFlag] = useState(false);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const authActions = {
    checkExistingUser: async (email, password, verifyPassword) => {
      if (password !== verifyPassword) {
        setError("The password is incorrect");
        return false;
      }
      try {
        const response = await fetch(
          `${BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );
        if (response.ok) throw new Error("Error");
        setFlag(true);
        return true;
      } catch (error) {
        setError(error.message);
        return false;
      }
    },
    finalregister: async (data, password) => {
      try {
        const response = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
          }),
        });
        if (!response.ok) throw new Error("Error");
        const newUser = await response.json();

        localStorage.setItem("currentUser", JSON.stringify(newUser));
        setUserData(newUser);
        return newUser;
      } catch (error) {
        setError(error.message);
        return null;
      }
    },
    login: async (data) => {
      try {
        const response = await fetch(
          `${BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error("Error");
        const user = await response.json();

        localStorage.setItem("currentUser", JSON.stringify(user));
        setUserData(user);
        return user;
      } catch (error) {
        setError(error.message);
        return null;
      }
    },
    logout: () => {
      localStorage.removeItem("currentUser");
      setUserData(null);
    },
    getToken: () => {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const { token } = JSON.parse(currentUser);
        return token;
      }
      return null;
    }
  };

  return {
    error,
    setError,
    flag,
    setFlag,
    userData,
    setUserData,
    ...authActions,
  };
};