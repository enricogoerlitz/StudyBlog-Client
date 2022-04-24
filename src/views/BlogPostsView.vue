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
    <div
      v-for="blogPost in blogPosts"
      :key="blogPost.id"
      class="blogpost-container"
    >
      <div class="blogpost-container__header">
        <span class="blogpost-container__title">{{ blogPost.title }}</span>
        <div class="blogpost-container__title__buttons">
          <button
            v-if="
              blogPost.creatorId === this.currentUser.id ||
              this.currentUser.role === 'ADMIN'
            "
            @click="() => this.onShowEditOverlay(blogPost)"
            type="button"
          >
            <i class="bi bi-pencil-square"></i>
          </button>
          <button
            v-if="
              blogPost.creatorId === this.currentUser.id ||
              this.currentUser.role === 'ADMIN'
            "
            @click="() => this.onDeleteBlogPost(blogPost.id)"
            type="button"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
          <button
            v-if="!isVisitor && blogPost.creatorId !== this.currentUser.id"
            @click="() => this.onEditFavorite(blogPost.id, blogPost.favorite)"
            type="button"
          >
            <i v-if="!blogPost.favorite" class="bi bi-heart"></i>
            <i v-if="blogPost.favorite" class="bi bi-heart-fill"></i>
          </button>
        </div>
      </div>
      <div class="blogpost-container__content">
        <p class="">
          {{ blogPost.content }}
        </p>
      </div>
      <div class="blogpost-container__footer">
        <span>{{ blogPost.username }} | {{ blogPost.creationDate }}</span>
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
  <button
    class="floating-action-button btn btn-success"
    v-if="!isVisitor"
    @click="onShowAddOverlay"
  >
    <i class="bi bi-plus-lg"></i>
  </button>
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
      blogPostsUnfiltered: null,
      showAddEditOverlay: false,
      editBlogPost: null,
      formTitle: "",
      isVisitor: false,
      filterByFavorites: false,
      filterText: "",
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

    onFilterByFavorites() {
      const searchText = this.filterText.trim().toLowerCase();

      this.filterByFavorites = !this.filterByFavorites;
      if (this.filterByFavorites) {
        if (this.blogPostsUnfiltered) {
          this.blogPosts = this.blogPostsUnfiltered.filter(
            (blogPost) => blogPost.favorite
          );
        } else {
          this.blogPostsUnfiltered = [...this.blogPosts];
          this.blogPosts = this.blogPosts.filter(
            (blogPost) => blogPost.favorite
          );
        }
        if (searchText !== "") {
          this.onFilterBySearch();
        }
        return;
      }

      if (searchText === "") {
        this.blogPosts = this.blogPostsUnfiltered;
        this.blogPostsUnfiltered = null;
        return;
      } else {
        this.onFilterBySearch();
      }
    },

    onFilterBySearch() {
      const searchText = this.filterText.trim().toLowerCase();
      if (
        searchText === "" &&
        !this.filterByFavorites &&
        this.blogPostsUnfiltered
      ) {
        this.blogPosts = this.blogPostsUnfiltered;
        this.blogPostsUnfiltered = null;
        return;
      }
      if (searchText === "" && this.filterByFavorites) {
        this.filterByFavorites = false;
        this.onFilterByFavorites();
        return;
      }
      if (searchText !== "" && this.filterByFavorites) {
        this.blogPosts = this.blogPostsUnfiltered
          .filter((blogPost) => blogPost.favorite)
          .filter((blogPost) => {
            // title, content, username
            return (
              blogPost.title.toLowerCase().includes(searchText) ||
              blogPost.content.toLowerCase().includes(searchText) ||
              blogPost.username.toLowerCase().includes(searchText)
            );
          });
      }
      if (searchText !== "" && !this.filterByFavorites) {
        if (!this.blogPostsUnfiltered) {
          this.blogPostsUnfiltered = [...this.blogPosts];
        }
        this.blogPosts = this.blogPostsUnfiltered.filter((blogPost) => {
          // title, content, username
          return (
            blogPost.title.toLowerCase().includes(searchText) ||
            blogPost.content.toLowerCase().includes(searchText) ||
            blogPost.username.toLowerCase().includes(searchText)
          );
        });
      }
    },

    onFilterTimeout() {
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
      this.blogPosts = dbBlogPosts.data.sort(
        (a, b) => b.creationDate - a.creationDate
      );
      if (this.filterByFavorites && this.filterText !== "") {
        this.blogPostsUnfiltered = null;
        this.filterByFavorites = false;
        this.onFilterByFavorites();
        //this.onFilterBySearch();
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

.blogpost-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 1rem 0;
  border: 1px solid rgb(176, 176, 176);
  border-radius: 0.3rem;
  max-height: 18rem;
  min-height: 13rem;
  overflow: hidden;
  box-shadow: -2px 2px 8px -6px rgba(56, 56, 56, 1);
  background-color: #fff;
  margin-block: 3rem;
}

.blogpost-container__header {
  padding: 0.3rem 0.6rem;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  background-color: #eee;
  width: 100%;
  font-size: 1.8rem;
  font-weight: bold;
}

.blogpost-container__title__buttons {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}
.blogpost-container__title__buttons button {
  font-size: 1.4rem;
  background-color: none;
  background: none;
  border: none;
  color: rgb(134, 134, 134);
}
.blogpost-container__title__buttons button:hover {
  cursor: pointer;
}

.bi-heart:hover {
  color: #f64b4b;
}

.bi-heart-fill {
  color: #f64b4b;
}

.bi-heart-fill:hover {
  color: rgb(83, 83, 83);
}

.bi-trash-fill:hover {
  color: red;
}

.bi-pencil-square:hover {
  color: rgb(40, 40, 40);
}

.blogpost-container__content {
  text-align: start;
  padding: 0.3rem 0.6rem;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.blogpost-container__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  text-align: end;
  width: 100%;
  height: 2.4rem;
  background-color: rgb(250, 250, 250);
  border-top: 1px solid rgb(240, 240, 240);
  padding-right: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
}

.floating-action-button {
  position: fixed;
  font-size: 2rem;
  right: 2rem;
  bottom: 2rem;
}
</style>
