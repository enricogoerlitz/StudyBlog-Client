import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import UserManagementView from "../views/UserManagementView.vue";
import BlogPostsView from "../views/BlogPostsView.vue";

const routes = [
    {
        path: "/login",
        name: "login",
        component: LoginView,
    },
    {
        path: "/register",
        name: "register",
        component: RegisterView,
    },
    {
        path: "/blogposts",
        name: "blogposts",
        component: BlogPostsView,
    },
    {
        path: "/user-management",
        name: "UserManagementView",
        component: UserManagementView,
    },
    {
        path: "/:pathMatch(.*)*",
        component: BlogPostsView,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
