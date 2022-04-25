<template>
  <div class="container d-flex-col justify-content-center align-items-center">
    <h1 class="mt-4">Blogposts</h1>
    <div class="filter-area d-flex-col mt-4 mb-4">
      <label for="search-blogpost">Find Post</label>
      <div class="d-flex">
        <input
          class="form-control"
          type="search"
          @keyup="() => this.onFilterBySearch()"
          @mouseup="() => this.onFilterTimeout()"
          v-model="filterText"
          placeholder="Search for Post"
          aria-label="Search"
          id="search-blogpost"
        />
        <input
          v-if="!isVisitor"
          type="checkbox"
          class="btn-check"
          id="cb-favorites"
          autocomplete="off"
          @change="onFilterByFavorites"
        />
        <label
          v-if="!isVisitor"
          class="btn btn-outline-secondary"
          for="cb-favorites"
          >Favorites</label
        ><br />
      </div>
    </div>
    <BlogPostList
      :blogPosts="blogPosts"
      :currentUser="currentUser"
      :onShowEditOverlay="onShowEditOverlay"
      :onEditFavorite="onEditFavorite"
      :onDeleteBlogPost="onDeleteBlogPost"
      :isVisitor="isVisitor"
    />
  </div>
  <AddEditBlogPostOverlay
    v-if="showAddEditOverlay"
    :formTitle="formTitle"
    :onToggleShowBlogPostOverlay="toggleAddEditOverlay"
    :onSubmit="onAddEditBlogPost"
    :blogPost="editBlogPost"
  />
  <FloatingActionButton
    :onShowOverlay="onShowAddOverlay"
    :showButton="!isVisitor"
  />
</template>

<script>
import Auth from "../authentication/Auth";
import axios from "axios";
import getAxiosConfig from "../authentication/getAxiosConfig";
import AddEditBlogPostOverlay from "@/components/BlogPosts/AddEditBlogPostOverlay.vue";
import BlogPostList from "../components/BlogPosts/BlogPostList.vue";
import FloatingActionButton from "../components/General/FloatingActionButton.vue";
import { createAPIRoute } from "../utilities/modules/backend";

export default {
  components: { AddEditBlogPostOverlay, BlogPostList, FloatingActionButton },
  name: "UserManagementView",
  data() {
    return {
      currentUser: null,
      blogPosts: [],
      blogPostsUnfiltered: null,
      showAddEditOverlay: false,
      editBlogPost: null,
      formTitle: "",
      isVisitor: false,
      filterByFavorites: false,
      filterText: "",
    };
  },
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

    onFilterByFavorites() {
      const searchText = this.getPrepSearchText();

      this.filterByFavorites = !this.filterByFavorites;
      if (this.filterByFavorites) {
        if (this.blogPostsUnfiltered) {
          this.filterBlogPostsByFavorites();
        } else {
          this.setBlogPostsUnfiltered();
          this.filterBlogPostsByFavorites();
        }
        if (searchText !== "") {
          this.onFilterBySearch();
        }
        return;
      }

      if (searchText === "") {
        this.resetBlogPostSearch();
      } else {
        this.onFilterBySearch();
      }
    },

    onFilterBySearch() {
      const searchText = this.getPrepSearchText();
      if (
        searchText === "" &&
        !this.filterByFavorites &&
        this.blogPostsUnfiltered
      ) {
        this.resetBlogPostSearch();
      } else if (searchText === "" && this.filterByFavorites) {
        this.filterByFavorites = false;
        this.onFilterByFavorites();
        return;
      } else if (searchText !== "" && this.filterByFavorites) {
        this.blogPosts = this.blogPostsUnfiltered
          .filter((blogPost) => blogPost.favorite)
          .filter((blogPost) =>
            this.getFilterBySearchText(blogPost, searchText)
          );
      } else if (searchText !== "" && !this.filterByFavorites) {
        if (!this.blogPostsUnfiltered) {
          this.setBlogPostsUnfiltered();
        }
        this.blogPosts = this.blogPostsUnfiltered.filter((blogPost) =>
          this.getFilterBySearchText(blogPost, searchText)
        );
      }
    },

    onFilterTimeout() {
      // because, by clicking on the "x" in a search-input, the input-clearing needs some time
      setTimeout(() => {
        if (this.filterText === "") {
          this.onFilterBySearch();
        }
      }, 100);
    },

    async onAddEditBlogPost(title, content) {
      const res = this.editBlogPost
        ? await this.onEditBlogPost(title, content)
        : await this.onAddBlogPost(title, content);
      if (res.status === 201 || res.status === 202) {
        this.fetchBlogPosts();
        this.toggleAddEditOverlay();
      }
    },

    async onAddBlogPost(title, content) {
      const blogPostData = { title, content };
      const res = await axios.post(
        createAPIRoute("/api/v1/blogposts"),
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
      const route = this.getBlogPostRouteByRole();
      const res = await axios.put(route, blogPostObj, getAxiosConfig());
      console.log(res);
      return res;
    },

    async onDeleteBlogPost(id) {
      const route = `${this.getBlogPostRouteByRole()}/${id}`;
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
      await axios.post(
        createAPIRoute(`/api/v1/favorites/${id}`),
        {},
        getAxiosConfig()
      );
    },

    async deleteFavorite(id) {
      await axios.delete(
        createAPIRoute(`/api/v1/favorites/${id}`),
        getAxiosConfig()
      );
    },

    async fetchBlogPosts() {
      const dbBlogPosts = await axios.get(
        createAPIRoute("/api/v1/blogposts"),
        getAxiosConfig()
      );
      this.blogPosts = dbBlogPosts.data.sort(
        (a, b) => b.creationDate - a.creationDate
      );
      if (this.filterByFavorites && this.filterText !== "") {
        this.blogPostsUnfiltered = null;
        this.filterByFavorites = false;
        this.onFilterByFavorites();
      }
      if (this.filterByFavorites && this.filterText === "") {
        this.blogPostsUnfiltered = null;
        this.filterByFavorites = false;
        this.onFilterByFavorites();
      }
      if (!this.filterByFavorites && this.filterText !== "") {
        this.blogPostsUnfiltered = null;
        this.onFilterBySearch();
      }
    },

    getPrepSearchText() {
      return this.filterText.trim().toLowerCase();
    },

    filterBlogPostsByFavorites() {
      this.blogPosts = this.blogPostsUnfiltered.filter(
        (blogPost) => blogPost.favorite
      );
    },

    getFilterBySearchText(blogPost, searchText) {
      return (
        blogPost.title.toLowerCase().includes(searchText) ||
        blogPost.content.toLowerCase().includes(searchText) ||
        blogPost.username.toLowerCase().includes(searchText)
      );
    },

    setBlogPostsUnfiltered() {
      this.blogPostsUnfiltered = [...this.blogPosts];
    },

    resetBlogPostSearch() {
      this.blogPosts = this.blogPostsUnfiltered;
      this.blogPostsUnfiltered = null;
    },

    getBlogPostRouteByRole() {
      return this.currentUser.role === "ADMIN"
        ? createAPIRoute("/api/v1/admin/blogposts")
        : createAPIRoute("/api/v1/blogposts");
    },

    toggleAddEditOverlay() {
      this.showAddEditOverlay = !this.showAddEditOverlay;
      if (!this.showAddEditOverlay) {
        this.editBlogPost = null;
        this.formTitle = "";
      }
    },
  },
  async mounted() {
    this.currentUser = await Auth.fetchCurrentUser();
    if (!this.currentUser) {
      this.$router.push("/login");
      return;
    }
    if (this.currentUser.role === "VISITOR") {
      this.isVisitor = true;
    }

    this.fetchBlogPosts();
  },
};
</script>

<style scoped>
.filter-area,
h1 {
  text-align: left;
}
.form-check {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  font-size: 1.3rem;
}

#search-blogpost {
  max-width: 15rem;
  margin-right: 2rem;
}
</style>
