import CurrentUserModel from "../../models/CurrentUserModel";
import axios from "axios";
import { createAPIRoute } from "./backend";

const JWT_COOKIE_NAME = "studyblog_jwt";

function getJWTCookie() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key == JWT_COOKIE_NAME) return value;
  }

  return "";
}

export function getAxiosConfig() {
  return {
    headers: {
      Authorization: getJWTCookie(),
    },
  };
}

export async function fetchCurrentUser() {
  try {
    const dbUser = await axios.get(
      createAPIRoute("/api/v1/auth/user"),
      getAxiosConfig()
    );
    if (dbUser.status == 200) return new CurrentUserModel(dbUser.data);
  } catch (err) {
    return null;
  }
}
