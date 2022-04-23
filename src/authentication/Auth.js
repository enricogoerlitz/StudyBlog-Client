import CurrentUserModel from "../models/CurrentUserModel";
import axios from "axios";
import getAxiosConfig from "./getAxiosConfig";

const auth = {
  async fetchCurrentUser() {
    try {
      console.log("config:", getAxiosConfig());
      const dbUser = await axios.get(
        "http://localhost:8080/api/v1/auth/user",
        getAxiosConfig()
      );
      console.log("USER: ", dbUser);
      if (dbUser.status == 200) return new CurrentUserModel(dbUser.data);
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};

export default auth;
