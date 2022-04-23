<template>
  <UserForm formName="Register" :onSubmit="onSubmit" />
</template>

<script>
import UserForm from "@/components/UserForm/UserForm.vue";
import axios from "axios";
import AuthJWTCookie from "@/authentication/AuthJWTCookie";

export default {
  components: { UserForm },
  name: "RegisterView",
  methods: {
    async onSubmit(username, password, role) {
      const userLogin = await axios.post("http://localhost:8080/api/v1/users", {
        username,
        password,
      });
      if (userLogin.status == 201) {
        new AuthJWTCookie(userLogin.data).set();
        this.$router.push("/blogposts");
        return;
      }
    },
  },
};
</script>

<style scoped></style>
