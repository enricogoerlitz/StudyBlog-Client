<template>
  <div class="container d-flex-col justify-content-center align-items-center">
    <div class="filter-area">
      FilterArea
      <button v-if="!isVisitor" @click="onShowAddOverlay">Add</button>
    </div>
    <div
      v-for="blogPost in blogPosts"
      :key="blogPost.id"
      class="blogpost-container"
    >
      <div class="blogpost-container__header">
        <span class="blogpost-container__title">{{ blogPost.title }}</span>
        <button
          v-if="
            blogPost.creatorId === this.currentUser.id ||
            this.currentUser.role === 'ADMIN'
          "
          @click="() => this.onShowEditOverlay(blogPost)"
          type="button"
        >
          Edit
        </button>
        <button
          v-if="
            blogPost.creatorId === this.currentUser.id ||
            this.currentUser.role === 'ADMIN'
          "
          @click="() => this.onDeleteBlogPost(blogPost.id)"
          type="button"
        >
          Del
        </button>
        <button
          v-if="!isVisitor"
          @click="() => this.onEditFavorite(blogPost.id, blogPost.favorite)"
          type="button"
        >
          Fav
        </button>
        <span>IsFav: {{ blogPost.favorite }}</span>
      </div>
      <p class="blogpost-container__content">
        {{ blogPost.content }}
      </p>
      <div class="blogpost-container__footer-container">
        <span class="blogpost-container__footer-container__creator"
          >{{ blogPost.username }} - {{ blogPost.creationDate }}</span
        >
      </div>
    </div>
  </div>
  <AddEditBlogPostOverlay
    v-if="showAddEditOverlay"
    :formTitle="formTitle"
    :onToggleShowBlogPostOverlay="toggleAddEditOverlay"
    :onSubmit="onAddEditBlogPost"
    :blogPost="editBlogPost"
  />
</template>

<script>
import Auth from "../authentication/Auth";
import axios from "axios";
import getAxiosConfig from "../authentication/getAxiosConfig";
import AddEditBlogPostOverlay from "@/components/BlogPosts/AddEditBlogPostOverlay.vue";

export default {
  components: { AddEditBlogPostOverlay },
  name: "UserManagementView",
  data() {
    return {
      currentUser: null,
      blogPosts: [],
      filteredBlogPosts: [],
      showAddEditOverlay: false,
      editBlogPost: null,
      formTitle: "",
      isVisitor: false,
    };
  },
  props: {},
  methods: {
    onShowAddOverlay() {
      this.formTitle = "Add Blogpost";
      this.toggleAddEditOverlay();
    },

    onShowEditOverlay(blogPost) {
      this.formTitle = "Edit Blogpost";
      this.editBlogPost = blogPost;
      this.toggleAddEditOverlay();
    },

    async onAddEditBlogPost(title, content) {
      const res = this.editBlogPost
        ? await this.onEditBlogPost(title, content)
        : await this.onAddBlogPost(title, content);
      if (res.status === 201 || res.status === 202) {
        this.fetchBlogPosts();
        this.toggleAddEditOverlay();
        return;
      }
      // TODO: error handling
    },

    async onAddBlogPost(title, content) {
      const blogPostData = { title, content };
      const res = await axios.post(
        "http://localhost:8080/api/v1/blogposts",
        blogPostData,
        getAxiosConfig()
      );
      console.log(res);
      return res;
    },

    async onEditBlogPost(title, content) {
      const id = this.editBlogPost.id;
      const blogPostObj = {
        id,
        title,
        content,
      };
      const route =
        this.currentUser.role === "ADMIN"
          ? `http://localhost:8080/api/v1/admin/blogposts`
          : `http://localhost:8080/api/v1/blogposts`;
      const res = await axios.put(route, blogPostObj, getAxiosConfig());
      console.log(res);
      return res;
    },

    async onDeleteBlogPost(id) {
      const route =
        this.currentUser.role === "ADMIN"
          ? `http://localhost:8080/api/v1/admin/blogposts/${id}`
          : `http://localhost:8080/api/v1/blogposts/${id}`;
      const res = await axios.delete(route, getAxiosConfig());
      if (res.status === 202) {
        this.fetchBlogPosts();
      }
      console.log(res);
    },

    async onEditFavorite(id, isFavorite) {
      if (!isFavorite) {
        await this.addFavorite(id);
      } else {
        await this.deleteFavorite(id);
      }
      this.fetchBlogPosts();
    },

    async addFavorite(id) {
      const res = await axios.post(
        `http://localhost:8080/api/v1/favorites/${id}`,
        {},
        getAxiosConfig()
      );
      console.log(res);
    },

    async deleteFavorite(id) {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/favorites/${id}`,
        getAxiosConfig()
      );
      console.log(res);
    },

    async fetchBlogPosts() {
      const dbBlogPosts = await axios.get(
        "http://localhost:8080/api/v1/blogposts",
        getAxiosConfig()
      );
      this.blogPosts = dbBlogPosts.data;
    },

    toggleAddEditOverlay() {
      this.showAddEditOverlay = !this.showAddEditOverlay;
      if (!this.showAddEditOverlay) {
        this.editBlogPost = null;
        this.formTitle = "";
      }
    },
  }, // here new obj
  async mounted() {
    // TODO: source out
    this.currentUser = await Auth.fetchCurrentUser();
    if (!this.currentUser) {
      this.$router.push("/login");
      return;
    } else if (this.currentUser.role === "VISITOR") {
      this.isVisitor = true;
    }
    this.fetchBlogPosts();
  },
};
</script>

<style scoped>
.blogpost-container {
  border: 2px solid black;
  height: 10rem;
  width: 80%;
}
</style>
