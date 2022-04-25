<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/blogposts"
                >StudyBlog</router-link
            >
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
                    <router-link class="nav-link" to="/blogposts"
                        >BlogPosts</router-link
                    >
                    <router-link
                        v-if="isAdmin"
                        class="nav-link"
                        to="/user-management"
                        >User Management</router-link
                    >
                    <button
                        v-if="!isLogin && !isRegister && !isVisitor"
                        type="button"
                        class="update-button btn btn-secondary btn-sm"
                        @click.prevent="toggleShowUserFrom"
                    >
                        Profile
                    </button>
                </div>

                <button
                    v-if="isLogin"
                    class="btn btn-primary ml-auto"
                    @click="() => this.onChangeRoute('/register')"
                >
                    Register
                </button>
                <button
                    type="button"
                    v-if="isRegister"
                    class="btn btn-primary ml-auto"
                    @click="() => this.onChangeRoute('/login')"
                >
                    Login
                </button>
                <button
                    v-if="!isLogin && !isRegister && currentUser"
                    type="button"
                    class="btn btn-primary ml-auto"
                    @click="onLogout"
                >
                    Logout
                </button>
            </div>
        </div>
    </nav>
    <UserFromOverlay v-if="showUserForm && !isVisitor">
        <UserForm
            formName="Update Your User"
            :onSubmit="onSubmitUserFrom"
            :onCloseOverlay="toggleShowUserFrom"
            :user="currentUser"
            :showCancelButton="true"
            buttonText="Update Me"
        />
    </UserFromOverlay>
</template>

<script>
import axios from "axios";

import AuthJWTCookie from "@/authentication/classes/AuthJWTCookie";
import { createAPIRoute } from "../../authentication/modules/backend";
import { fetchCurrentUser } from "../../authentication/modules/auth";
import { getAxiosConfig } from "../../authentication/modules/auth";

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
        async onLogout() {
            new AuthJWTCookie().remove();
            await this.$router.push("/login");
            this.checkRoute();
        },
        async onChangeRoute(route) {
            await this.$router.push(route);
            this.checkRoute();
        },
        async onSubmitUserFrom(username, password) {
            const userObj = { username, password };
            const res = await axios.put(
                createAPIRoute("/api/v1/users/edit"),
                userObj,
                getAxiosConfig()
            );

            if (res.status === 202) {
                new AuthJWTCookie(res.data).set();
                this.toggleShowUserFrom();
            }
        },
        async toggleShowUserFrom() {
            this.showUserForm = !this.showUserForm;
            if (!this.showUserForm) {
                this.currentUser = await fetchCurrentUser();
            }
        },
        async checkRoute() {
            switch (document.location.pathname) {
                case "":
                case "/":
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

            this.currentUser = await fetchCurrentUser();
            if (this.currentUser && (this.isLogin || this.isRegister)) {
                await this.$router.push("/blogposts");
                this.isLogin = false;
                this.isRegister = false;
            }
            if (this.currentUser && this.currentUser.role === "ADMIN") {
                this.isAdmin = true;
            } else if (
                this.currentUser &&
                this.currentUser.role === "VISITOR"
            ) {
                this.isVisitor = true;
            }
        },
    },
    mounted() {
        this.checkRoute();
    },
};
</script>

<style scoped>
.ml-auto {
    margin-left: auto;
}

.update-button {
    height: 1.6rem;
    padding: 0rem 0.8rem;
    margin: auto 0.6rem;
}
</style>
