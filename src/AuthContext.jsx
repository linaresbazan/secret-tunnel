import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async (username) => {

    try {
      const response = await fetch(API + '/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken); // Persist token
        setLocation('TABLET'); // Set location to "TABLET" after successful signup
      } else {
        // Handle API errors here
        const errorData = await response.json();
        console.error('Signup failed:', errorData.message);
      }
    } catch (error) {
      // Handle network or other errors here
      console.error('There was an error during signup:', error);
    }
  }

  // TODO: authenticate
  const authenticate = async () => {

    if (!token) {
      console.error("There is no token.");
      return;
    }

    try {
      const response = await fetch(API + "/authenticate", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        setLocation('TUNNEL');
      } else {
        // Handle API errors here
        const errorData = await response.json();
        console.error('Authentication failed:', errorData.message);
      }
    } catch (error) {
      // Handle network or other errors here
      console.error('There was an error authenticating:', error);
    }
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
