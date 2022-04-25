import Cookie from "../../utilities/classes/Cookie";

class AuthJWTCookie extends Cookie {
  constructor(jwt) {
    super("studyblog_jwt", jwt, 90);
  }
}

export default AuthJWTCookie;
