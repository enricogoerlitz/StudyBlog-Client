<template>
    <AppHeader />
    <router-view />
</template>

<script>
import AppHeader from "./components/Header/AppHeader.vue";

export default {
    name: "App",
    components: { AppHeader },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

body {
    background-color: #ededed !important;
}

nav {
    padding: 30px;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
}

nav a.router-link-exact-active {
    color: #42b983;
}

.invalid {
    margin-top: 0.6rem;
    color: red;
    text-align: left;
    display: none;
}

.invalid.show {
    display: block;
}
</style>
