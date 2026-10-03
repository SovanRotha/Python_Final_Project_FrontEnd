import { useEffect, useState } from "react";
import authApi from "../../services/api/authapi.js";
import { AuthContext } from "./authContext.js";

const ACCESS_TOKEN_KEY = "accessToken";
const UNAUTHORIZED_EVENT = "tripos:unauthorized";

function readAccessToken() {
  return typeof localStorage === "undefined"
    ? ""
    : localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(readAccessToken);

  useEffect(() => {
    function handleUnauthorized() {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      setAccessToken("");
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  async function signIn(credentials) {
    const result = await authApi.login(credentials);

    if (!result.access_token) {
      throw new Error("The login response did not include an access token.");
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, result.access_token);
    setAccessToken(result.access_token);
  }

  async function signUp(userDetails) {
    await authApi.register(userDetails);
    await signIn({
      email: userDetails.email,
      password: userDetails.password,
    });
  }

  function signOut() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAccessToken("");
  }

  return (
    <AuthContext.Provider value={{ accessToken, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}