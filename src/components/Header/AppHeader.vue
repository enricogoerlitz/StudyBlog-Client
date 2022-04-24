<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/blogposts">StudyBlog</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div v-if="!isLogin && !isRegister" class="navbar-nav">
          <router-link class="nav-link" to="/blogposts">BlogPosts</router-link>
          <router-link v-if="isAdmin" class="nav-link" to="/user-management"
            >User Management</router-link
          >
        </div>

        <button
          v-if="isLogin"
          class="btn btn-primary ml-auto"
          @click="() => this.changeRoute('/register')"
        >
          Register
        </button>
        <button
          type="button"
          v-if="isRegister"
          class="btn btn-primary ml-auto"
          @click="() => this.changeRoute('/login')"
        >
          Login
        </button>

        <button
          v-if="!isLogin && !isRegister && !isVisitor"
          type="button"
          class="btn btn-secondary ml-auto"
          @click="toggleShowUserFrom"
        >
          UpdateMe
        </button>
        <button
          v-if="!isLogin && !isRegister"
          type="button"
          class="btn btn-primary ml-auto"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>

  <UserFromOverlay v-if="showUserForm && !isVisitor">
    <UserForm
      formName="Update your User"
      :onSubmit="onSubmitUserFrom"
      :onCloseOverlay="toggleShowUserFrom"
      :user="currentUser"
      :showCancelButton="true"
    />
  </UserFromOverlay>
</template>

<script>
import AuthJWTCookie from "@/authentication/AuthJWTCookie";
import Auth from "../../authentication/Auth";
import axios from "axios";
import getAxiosConfig from "../../authentication/getAxiosConfig";
import UserFromOverlay from "../UserForm/UserFromOverlay.vue";
import UserForm from "../UserForm/UserForm.vue";

export default {
  name: "AppHeader",
  components: { UserFromOverlay, UserForm },

  data() {
    return {
      isLogin: false,
      isRegister: false,
      isAdmin: false,
      name: this.$route,
      currentUser: null,
      showUserForm: false,
      isVisitor: false,
    };
  },
  methods: {
    async logout() {
      new AuthJWTCookie().remove();
      await this.$router.push("/login");
      this.checkRoute();
    },
    async changeRoute(route) {
      await this.$router.push(route);
      this.checkRoute();
    },

    async checkRoute() {
      switch (document.location.pathname) {
        case "/login":
          this.isLogin = true;
          this.isRegister = false;
          break;
        case "/register":
          this.isRegister = true;
          this.isLogin = false;
          break;

        default:
          this.isRegister = false;
          this.isLogin = false;
          break;
      }

      this.currentUser = await Auth.fetchCurrentUser();
      if (this.currentUser && (this.isLogin || this.isRegister)) {
        await this.$router.push("/blogposts");
        this.isLogin = false;
        this.isRegister = false;
      }
      if (this.currentUser && this.currentUser.role === "ADMIN") {
        this.isAdmin = true;
      } else if (this.currentUser && this.currentUser.role === "VISITOR") {
        this.isVisitor = true;
      }
    },

    async onSubmitUserFrom(username, password) {
      const userObj = { username, password };
      const res = await axios.put(
        "http://localhost:8080/api/v1/users/edit",
        userObj,
        getAxiosConfig()
      );
      if (res.status === 202) {
        new AuthJWTCookie(res.data).set();
        this.toggleShowUserFrom();
      }
      console.log(res);
    },

    toggleShowUserFrom() {
      this.showUserForm = !this.showUserForm;
    },
  },
  mounted() {
    this.checkRoute();
    console.log(this.isLogin, this.isRegister);
  },
};
</script>

<style scoped>
.ml-auto {
  margin-left: auto;
}
</style>
