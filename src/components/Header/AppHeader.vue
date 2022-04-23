<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">StudyBlog</a>
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
        <div class="navbar-nav">
          <router-link class="nav-link" to="/blogposts">BlogPosts</router-link>
          <router-link class="nav-link" to="/usermanagement"
            >User Management</router-link
          >
        </div>
        <router-link class="btn btn-primary ml-auto" to="/login"
          >Login | Register | UserIcon</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.ml-auto {
  margin-left: auto;
}
</style>
