<template>
  <div class="container mt-5">
    <UserForm
      formName="Sign In"
      :onSubmit="onSubmit"
      buttonText="Login"
      :showVisitorLogin="true"
    />
  </div>
</template>

<script>
import UserForm from "@/components/UserForm/UserForm.vue";
import axios from "axios";
import AuthJWTCookie from "@/authentication/classes/AuthJWTCookie";
import UserFromOverlay from "@/components/UserForm/UserFromOverlay.vue";
import { createAPIRoute } from "../utilities/modules/backend";

export default {
  components: { UserForm, UserFromOverlay },
  name: "LoginView",
  methods: {
    async onSubmit(username, password) {
      const res = await axios.post(createAPIRoute("/api/v1/auth/login"), {
        username,
        password,
      });
      if (res.status == 200) {
        new AuthJWTCookie(res.data).set();
        document.location.href = "/blogposts";
        return;
      }
    },
  },
};
</script>

<style scoped></style>
