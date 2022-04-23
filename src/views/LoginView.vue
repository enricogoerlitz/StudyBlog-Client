<template>
  <UserForm formName="Login" :onSubmit="onSubmit" />
</template>

<script>
import UserForm from "@/components/UserForm/UserForm.vue";
import axios from "axios";
export default {
  components: { UserForm },
  name: "LoginView",
  methods: {
    async onSubmit(username, password, role) {
      const userLogin = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { username, password }
      );
      console.log(userLogin.status);
    },
  },
};
</script>

<style scoped></style>
