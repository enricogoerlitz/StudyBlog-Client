<template>
  <div class="blogpost-overlay">
    <form class="blogpost-overlay__form">
      <button
        type="button"
        @click.prevent="onToggleShowBlogPostOverlay"
        class="blogpost-overlay__form__cancel-btn"
      >
        <i class="bi bi-x-circle"></i>
      </button>
      <span class="blogpost-overlay__form__header">{{ formTitle }}</span>
      <label for="title">Title</label>
      <input
        type="text"
        class="form-control"
        id="title"
        placeholder="Title"
        v-model="title"
      />
      <div :class="titleValid">Enter a Title (min 5, max 255)</div>
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
      <div :class="contentValid">Enter a Username (min 5, max 3000)</div>

      <button
        @click.prevent="onSubmitForm"
        type="submit"
        class="btn btn-primary"
      >
        Submit
      </button>
    </form>
    <div :class="formValid">{{ formErrorMsg }}</div>
  </div>
</template>

<script>
import { validateBlogPost } from "../../utilities/modules/validation";

export default {
  name: "AddBlogPostOverlay",
  data() {
    return {
      title: "",
      content: "",
      titleValid: "invalid",
      contentValid: "invalid",
      formValid: "invalid",
      formErrorMsg: "",
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
      if (!this.validateFormInputs()) return;
      try {
        this.onSubmit(this.title, this.content);
      } catch (err) {
        this.printResponseError(err.response.status);
      }
    },

    validateFormInputs() {
      const { title, content } = this;
      const [isTitleValid, isContentValid] = validateBlogPost({
        title,
        content,
      });
      this.setInvalidCssClass(isTitleValid, isContentValid);

      return isTitleValid && isContentValid;
    },

    setInvalidCssClass(isTitleValid, isContentValid) {
      const baseInvalidCssClass = "invalid";
      const showInvalidCssClass = "invalid show";
      const titleClass = isTitleValid
        ? baseInvalidCssClass
        : showInvalidCssClass;
      const contentClass = isContentValid
        ? baseInvalidCssClass
        : showInvalidCssClass;

      this.titleValid = titleClass;
      this.contentValid = contentClass;
    },

    printResponseError(statusCode) {
      switch (statusCode) {
        case 401:
          this.formErrorMsg = `You are not allowed to change this resource! (${statusCode})`;
          break;
        case 500:
        default:
          this.formErrorMsg = `Unexpected Error with Statuscode: ${statusCode}!`;
          break;
      }
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(134, 134, 134);
  top: 0.8rem;
  right: 0.6rem;
  font-size: 1.2rem;
  background: none;
  background-color: none;
  border: none;
  border-radius: 100rem;
  padding: 0.25rem 0.5rem 0 0.5rem;
}
.blogpost-overlay__form__cancel-btn:hover {
  cursor: pointer;
  background-color: rgb(236, 236, 236);
  color: rgb(40, 40, 40);
}

.blogpost-overlay__form__header {
  font-weight: bold;
  font-size: 1.8rem;
}
</style>
