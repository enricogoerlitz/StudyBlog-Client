<template>
  <!-- // for login, register, editUser, addUserByAdmin, editUserByAdmin -->
  <!-- Login + Register + EditUser => Username, Password | unterschiedliche Bezeichnung  -->
  <!-- EditUserByAdmin + AddUserByAdmin => Username, Password, Role | unterschiedliche Bezeichnung  -->
  <!-- https://mdbootstrap.com/docs/standard/extended/login/ -->
  <form class="auth-form">
    <span class="auth-form__header">{{ formName }}</span>
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
label {
  text-align: left;
  width: 100%;
  margin-top: 0.9rem;
  margin-bottom: 0.1rem;
}

.btn {
  width: 100%;
  margin-top: 1.3rem;
}

.auth-form {
  position: relative;
  width: 95%;
  max-width: 25rem;
  padding: 0.8rem 1.1rem 1.2rem 1.1rem;
  margin: auto;
  border: 1px solid rgb(176, 176, 176);
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0px 1px 5px 0px rgba(240, 240, 240, 0.5);
}

.auth-form__header {
  font-weight: bold;
  font-size: 1.8rem;
}
</style>
