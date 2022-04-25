import CurrentUserModel from "../models/CurrentUserModel";
import axios from "axios";
import getAxiosConfig from "./getAxiosConfig";
import { createAPIRoute } from "../utilities/modules/backend";

const auth = {
  async fetchCurrentUser() {
    try {
      const dbUser = await axios.get(
        createAPIRoute("/api/v1/auth/user"),
        getAxiosConfig()
      );
      if (dbUser.status == 200) return new CurrentUserModel(dbUser.data);
    } catch (err) {
      return null;
    }
  },
};

export default auth;
