<template>
  <div class="container">
    <h1 class="mt-4">User Management</h1>
    <div class="filter-area d-flex-col mt-4 mb-4">
      <label for="search-user">Find User</label>
      <input
        class="form-control"
        type="search"
        @keyup="() => this.onFilterBySearch()"
        @mouseup="() => this.onFilterTimeout()"
        v-model="filterText"
        placeholder="Search"
        aria-label="Search"
        id="search-user"
      />
    </div>
    <UserManagementTable
      :users="users"
      :onDeleteUser="onDeleteUser"
      :onShowUserOverlay="onShowUserOverlay"
    />
  </div>
  <UserFromOverlay v-if="showUserForm">
    <UserForm
      :formName="userFromTitle"
      :onSubmit="onSubmitUserFrom"
      :onCloseOverlay="toggleShowUserFrom"
      :showRoleSelect="true"
      :user="editUser"
      :showCancelButton="true"
      :buttonText="userFromButtonText"
    />
  </UserFromOverlay>
  <FloatingActionButton :showButton="true" :onShowOverlay="onShowUserOverlay" />
</template>

<script>
import axios from "axios";

import { getAxiosConfig } from "../authentication/modules/auth";
import { fetchCurrentUser } from "../authentication/modules/auth";
import { createAPIRoute } from "@/authentication/modules/backend";

import UserForm from "../components/UserForm/UserForm.vue";
import UserFromOverlay from "@/components/UserForm/UserFromOverlay.vue";
import UserManagementTable from "../components/UserManagement/UserManagementTable.vue";
import FloatingActionButton from "../components/General/FloatingActionButton.vue";

export default {
  components: {
    UserFromOverlay,
    UserForm,
    FloatingActionButton,
    UserManagementTable,
  },
  name: "UserManagementView",
  data() {
    return {
      users: [],
      usersUnfiltered: null,
      editUser: null,
      showUserForm: false,
      userFromTitle: "",
      filterText: "",
      userFromButtonText: "",
      currentUser: null,
    };
  },
  methods: {
    onShowUserOverlay(user) {
      if (user) {
        this.editUser = user;
        this.userFromTitle = "Edit User";
        this.userFromButtonText = "Update";
      } else {
        this.userFromTitle = "Add User";
        this.userFromButtonText = "Add";
      }
      this.toggleShowUserFrom();
    },

    onFilterBySearch() {
      const searchText = this.filterText.trim().toLowerCase();
      if (searchText === "" && this.usersUnfiltered) {
        this.users = [...this.usersUnfiltered];
        this.usersUnfiltered = null;
        return;
      }
      if (searchText !== "" && !this.usersUnfiltered) {
        this.usersUnfiltered = [...this.users];
      }
      this.filterUsersBySearch(searchText);
    },

    onFilterTimeout() {
      setTimeout(() => {
        if (this.filterText === "") {
          this.onFilterBySearch();
        }
      }, 100);
    },

    async onSubmitUserFrom(username, password, role) {
      if (!this.editUser) {
        const userObj = { username, password, role };
        const res = await axios.post(
          createAPIRoute("/api/v1/admin/users"),
          userObj,
          getAxiosConfig()
        );
      } else {
        const userObj = { username, password, role };
        const res = await axios.put(
          createAPIRoute(`/api/v1/admin/users/${this.editUser.id}`),
          userObj,
          getAxiosConfig()
        );
      }

      this.fetchUsers();
      this.toggleShowUserFrom();
    },

    async onDeleteUser(id) {
      const res = await axios.delete(
        createAPIRoute(`/api/v1/admin/users/${id}`),
        getAxiosConfig()
      );
      this.fetchUsers();
    },

    async fetchUsers() {
      const dbUsers = await axios.get(
        createAPIRoute("/api/v1/admin/users"),
        getAxiosConfig()
      );
      this.users = dbUsers.data.sort((a, b) => a.id - b.id);
      this.filterText = "";
    },

    filterUsersBySearch(searchText) {
      this.users = this.usersUnfiltered.filter((user) => {
        return (
          user.username.toLowerCase().includes(searchText) ||
          user.role.toLowerCase().includes(searchText) ||
          user.id.toString().toLowerCase().includes(searchText)
        );
      });
    },

    toggleShowUserFrom() {
      this.showUserForm = !this.showUserForm;
      if (!this.showUserForm) {
        this.editUser = null;
      }
    },
  },
  async mounted() {
    this.currentUser = await fetchCurrentUser();
    if (!this.currentUser) {
      this.$router.push("/login");
      return;
    }
    if (this.currentUser.role !== "ADMIN") {
      this.$router.push("/blogposts");
      return;
    }
    this.fetchUsers();
  },
};
</script>

<style scoped>
.filter-area,
h1 {
  text-align: left;
}

label {
  text-align: left;
}

#search-user {
  max-width: 15rem;
  margin-right: 2rem;
}
</style>
