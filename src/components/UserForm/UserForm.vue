<template>
  <!-- https://mdbootstrap.com/docs/standard/extended/login/ -->
  <form autocomplete="off" class="auth-form">
    <button
      v-if="showCancelButton"
      type="button"
      @click.prevent="onCloseOverlay"
      class="auth-form__cancel-btn"
    >
      <i class="bi bi-x-circle"></i>
    </button>
    <span class="auth-form__header">{{ formName }}</span>
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        class="form-control"
        autocomplete="off"
        spellcheck="false"
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
        autocomplete="off"
        spellcheck="false"
        id="password"
        placeholder="Enter Password"
        v-model="password"
      />
    </div>
    <div v-if="showRoleSelect" class="form-group">
      <label for="role">Role</label>
      <select
        v-model="role"
        class="form-select"
        id="role"
        aria-label="Default select"
      >
        <option selected>Open this select menu</option>
        <option value="ADMIN">Admin</option>
        <option value="STUDENT">Student</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary" @click.prevent="onSubmitForm">
      {{ buttonText }}
    </button>
    <form v-if="showVisitorLogin">
      <button
        class="btn btn-link"
        type="submit"
        @click.prevent="onSubmitVisitor"
      >
        Sign In as Visitor
      </button>
    </form>
  </form>
</template>

<script>
import axios from "axios";
import AuthJWTCookie from "../../authentication/AuthJWTCookie";
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
    showVisitorLogin: {
      type: Boolean,
      required: false,
    },
    user: {
      type: Object,
      required: false,
    },
    onCloseOverlay: {
      type: Function,
      required: false,
    },
    showRoleSelect: {
      type: Boolean,
      required: false,
    },
    showCancelButton: {
      type: Boolean,
      required: false,
    },
    buttonText: {
      type: String,
      required: false,
    },
  },
  methods: {
    async onSubmitForm() {
      await this.onSubmit(this.username, this.password, this.role);
    },

    async onSubmitVisitor() {
      console.log("Execution");
      const res = await axios.get("http://localhost:8080/api/v1/auth/visitor");
      if (res.status == 200) {
        new AuthJWTCookie(res.data).set();
        document.location.href = "/blogposts";
      }
    },
  },
  mounted() {
    if (this.user) {
      const { username, role } = this.user;
      (this.username = username), (this.role = role);
      this.password = "";
    }
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

.auth-form__cancel-btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(134, 134, 134);
  top: 0.8rem;
  right: 0.6rem;
  font-size: 1.2rem;
  background: none;
  background-color: none;
  border: none;
  border-radius: 100rem;
  padding: 0.25rem 0.5rem 0 0.5rem;
}
.auth-form__cancel-btn:hover {
  cursor: pointer;
  background-color: rgb(236, 236, 236);
  color: rgb(40, 40, 40);
}
</style>
