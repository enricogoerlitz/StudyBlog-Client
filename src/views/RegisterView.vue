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
import axios from "axios";

import AuthJWTCookie from "@/authentication/classes/AuthJWTCookie";
import { createAPIRoute } from "../authentication/modules/backend";

import UserForm from "../components/UserForm/UserForm.vue";

export default {
    components: { UserForm },
    name: "RegisterView",
    methods: {
        async onSubmit(username, password, role) {
            const userObj = { username, password };
            const res = await axios.post(
                createAPIRoute("/api/v1/users"),
                userObj
            );
            if (res.status == 201) {
                new AuthJWTCookie(res.data).set();
                document.location.href = "/blogposts";
            }
        },
    },
};
</script>

<style scoped></style>
