<template>
  <div class="container">
    <UserForm formName="Login" :onSubmit="onSubmit" />
  </div>
</template>

<script>
import UserForm from "@/components/UserForm/UserForm.vue";
import axios from "axios";
import AuthJWTCookie from "@/authentication/AuthJWTCookie";

export default {
  components: { UserForm },
  name: "LoginView",
  methods: {
    async onSubmit(username, password, role) {
      const userLogin = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { username, password }
      );
      if (userLogin.status == 200) {
        console.log(userLogin.data);
        new AuthJWTCookie(userLogin.data).set();
        this.$router.push("/blogposts");
        return;
      }
      console.log(userLogin);
    },
  },
};
</script>

<style scoped></style>
