<template>
  <div class="mt-5">
    <UserForm
      formName="Register"
      buttonText="Register"
      :onSubmit="onSubmit"
      :showVisitorLogin="true"
    />
  </div>
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
      const userObj = { username, password };
      const res = await axios.post(createAPIRoute("/api/v1/users"), userObj);
      if (res.status == 201) {
        console.log(res.data);
        new AuthJWTCookie(res.data).set();
        document.location.href = "/blogposts";
        return;
      }
    },
  },
};
</script>

<style scoped></style>
