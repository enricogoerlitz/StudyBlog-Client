const JWT_COOKIE_NAME = "studyblog_jwt";
function getJWTCookie() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key == JWT_COOKIE_NAME) return value;
  }

  return "";
}

function getAxiosConfig() {
  return {
    headers: {
      Authorization: getJWTCookie(),
    },
  };
}

export default getAxiosConfig;
