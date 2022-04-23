<template>
  <!-- // for login, register, editUser, addUserByAdmin, editUserByAdmin -->
  <!-- Login + Register + EditUser => Username, Password | unterschiedliche Bezeichnung  -->
  <!-- EditUserByAdmin + AddUserByAdmin => Username, Password, Role | unterschiedliche Bezeichnung  -->
  <!-- https://mdbootstrap.com/docs/standard/extended/login/ -->
  <h1>{{ formName }}</h1>
  <form class="auth-form">
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        class="form-control"
        id="username"
        placeholder="Enter Username"
        v-model="username"
      />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        class="form-control"
        id="password"
        placeholder="Enter Password"
        v-model="password"
      />
    </div>
    <button type="submit" class="btn btn-primary" @click.prevent="onSubmitForm">
      Submit
    </button>
  </form>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      role: "",
    };
  },
  props: {
    formName: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  methods: {
    async onSubmitForm() {
      await this.onSubmit(this.username, this.password, this.role);
    },
  },
};
</script>

<style scoped>
.auth-form {
  max-width: 30rem;
}
</style>
