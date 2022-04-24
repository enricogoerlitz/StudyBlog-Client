<template>
  <div class="container">
    <UserForm formName="Login" :onSubmit="onSubmit" :showVisitorLogin="true" />
  </div>
</template>

<script>
import UserForm from "@/components/UserForm/UserForm.vue";
import axios from "axios";
import AuthJWTCookie from "@/authentication/AuthJWTCookie";
import UserFromOverlay from "@/components/UserForm/UserFromOverlay.vue";

export default {
  components: { UserForm, UserFromOverlay },
  name: "LoginView",
  methods: {
    async onSubmit(username, password, role) {
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        username,
        password,
      });
      if (res.status == 200) {
        new AuthJWTCookie(res.data).set();
        document.location.href = "/blogposts";
      }
    },
  },
};
</script>

<style scoped></style>
