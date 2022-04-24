<template>
  <div class="blogpost-overlay">
    <form class="blogpost-overlay__form">
      <button
        type="button"
        @click.prevent="onToggleShowBlogPostOverlay"
        class="blogpost-overlay__form__cancel-btn"
      >
        X
      </button>
      <span class="blogpost-overlay__form__header">{{ formTitle }}</span>
      <label for="title">Titel</label>
      <input
        type="text"
        class="form-control"
        id="title"
        placeholder="Titel"
        v-model="title"
      />
      <label for="content">Post Content</label>
      <textarea
        type="text"
        class="form-control"
        id="content"
        placeholder="Post content"
        rows="4"
        maxlength="1500"
        v-model="content"
      />
      <button
        @click.prevent="onSubmitForm"
        type="submit"
        class="btn btn-primary"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddBlogPostOverlay",
  data() {
    return {
      title: "",
      content: "",
    };
  },
  props: {
    blogPost: {
      type: Object,
      required: false,
    },
    formTitle: {
      type: String,
      required: true,
    },
    onToggleShowBlogPostOverlay: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  methods: {
    onSubmitForm() {
      this.onSubmit(this.title, this.content);
    },
  },
  mounted() {
    if (this.blogPost) {
      this.title = this.blogPost.title;
      this.content = this.blogPost.content;
    }
  },
};
</script>

<style scoped>
textarea {
  max-height: 13rem;
  min-height: 4rem !important;
}

label {
  text-align: left;
  width: 100%;
  margin-top: 1.1rem;
  margin-bottom: 0.1rem;
}

.btn {
  width: 100%;
  margin-top: 1.3rem;
}

.blogpost-overlay {
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

.blogpost-overlay__form {
  position: relative;
  width: 95%;
  max-width: 40rem;
  padding: 2rem 1rem 1.2rem 1rem;
  margin: auto;
  border: 1px solid rgb(176, 176, 176);
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0px 1px 5px 0px rgba(240, 240, 240, 0.5);
}

.blogpost-overlay__form__cancel-btn {
  position: absolute;
  top: 1.1rem;
  right: 2rem;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 100%;
}
.blogpost-overlay__form__cancel-btn:hover {
  cursor: pointer;
}

.blogpost-overlay__form__header {
  font-weight: bold;
  font-size: 1.8rem;
}
</style>
