<template>
  <div class="container d-flex justify-content-center">
    <div class="blogpost-container">
      <div class="blogpost-container__header">
        <span class="blogpost-container__title">Title</span>
        <span class="blogpost-container__button">✅ | ❌</span>
      </div>
      <p class="blogpost-container__content">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
        officiis facere vero, cumque quibusdam iste blanditiis accusantium
        similique eaque accusamus consequuntur quaerat delectus, maiores, eos
        culpa asperiores fugiat rem mollitia?
      </p>
      <div class="blogpost-container__footer-container">
        <span class="blogpost-container__footer-container__creator"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserManagementView",
};
</script>

<style scoped>
.blogpost-container {
  border: 2px solid black;
  height: 10rem;
  width: 80%;
}
</style>
