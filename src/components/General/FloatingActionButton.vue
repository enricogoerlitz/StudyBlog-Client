<template>
  <button
    class="floating-action-button btn btn-success"
    v-if="showButton"
    @click="() => this.onShowOverlay()"
  >
    <i class="bi bi-plus-lg"></i>
  </button>
</template>

<script>
export default {
  name: "FloatingActionButton",
  props: {
    showButton: {
      type: Boolean,
      required: true,
    },
    onShowOverlay: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.floating-action-button {
  position: fixed;
  font-size: 2rem;
  right: 2rem;
  bottom: 2rem;
}
</style>
