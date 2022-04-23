<template>
  <div class="user-form-overlay">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "AddBlogPostOverlay",
  props: {},
};
</script>

<style scoped>
.user-form-overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-content: center;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
