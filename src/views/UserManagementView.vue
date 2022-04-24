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
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Username</th>
          <th scope="col">Password</th>
          <th scope="col">Role</th>
          <th class="icon-col" scope="col">Edit</th>
          <th class="icon-col" scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th scope="row">{{ user.id }}</th>
          <td>{{ user.username }}</td>
          <td>*********</td>
          <td>{{ user.role }}</td>
          <td class="icon-col">
            <button
              v-if="user.role !== 'ADMIN'"
              class="table-icon-button"
              type="button"
              @click="() => this.onShowUserOverlay(user)"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
          </td>
          <td class="icon-col">
            <button
              v-if="user.role !== 'ADMIN'"
              class="table-icon-button"
              type="button"
              @click="() => this.onDeleteUser(user.id)"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
  <button
    class="floating-action-button btn btn-success"
    @click="() => this.onShowUserOverlay()"
  >
    <i class="bi bi-plus-lg"></i>
  </button>
</template>

<script>
import axios from "axios";
import getAxiosConfig from "../authentication/getAxiosConfig";
import Auth from "../authentication/Auth";
import UserFromOverlay from "@/components/UserForm/UserFromOverlay.vue";
import UserForm from "../components/UserForm/UserForm.vue";

export default {
  components: { UserFromOverlay, UserForm },
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
        this.users = this.usersUnfiltered.filter((user) => {
          return (
            user.username.toLowerCase().includes(searchText) ||
            user.role.toLowerCase().includes(searchText) ||
            user.id.toString().toLowerCase().includes(searchText)
          );
        });
        return;
      }
      if (searchText !== "" && this.usersUnfiltered) {
        this.users = this.usersUnfiltered.filter((user) => {
          return (
            user.username.toLowerCase().includes(searchText) ||
            user.role.toLowerCase().includes(searchText)
          );
        });
        return;
      }
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
          "http://localhost:8080/api/v1/admin/users",
          userObj,
          getAxiosConfig()
        );
        console.log(res);
      } else {
        const userObj = { username, password, role };
        const res = await axios.put(
          `http://localhost:8080/api/v1/admin/users/${this.editUser.id}`,
          userObj,
          getAxiosConfig()
        );
        console.log(res);
      }
      // TODO: res.status === 202?
      this.fetchUsers();
      this.toggleShowUserFrom();
    },

    async onDeleteUser(id) {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/admin/users/${id}`,
        getAxiosConfig()
      );
      console.log(res);
      this.fetchUsers();
    },

    toggleShowUserFrom() {
      this.showUserForm = !this.showUserForm;
      if (!this.showUserForm) {
        this.editUser = null;
      }
    },
    async fetchUsers() {
      const dbUsers = await axios.get(
        "http://localhost:8080/api/v1/admin/users",
        getAxiosConfig()
      );
      this.users = dbUsers.data.sort((a, b) => a.id - b.id);
      this.filterText = "";
    },
  },
  async mounted() {
    // TODO: source out
    this.currentUser = await Auth.fetchCurrentUser();
    console.log("curr:", this.currentUser);
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
tr {
  text-align: left;
}

table {
  overflow: hidden;
  background-color: #fff;
  padding: 0.3rem 0.4rem;
  border-radius: 0.3rem;
  border: 2px solid rgb(255, 255, 255);
}

table tbody tr {
  height: 3rem;
  border-bottom: 1px solid rgb(228, 228, 228);
}

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

.floating-action-button {
  position: fixed;
  font-size: 2rem;
  right: 2rem;
  bottom: 2rem;
}

.table-icon-button {
  background: none;
  background-color: none;
  font-size: 1.2rem;
  border-radius: 100%;
  padding-top: 0.25rem;
  padding: 0.25rem 0.5rem 0 0.5rem;
  color: rgb(134, 134, 134);

  border: none;
}
.table-icon-button:hover {
  cursor: pointer;
  color: rgb(40, 40, 40);
}

.icon-col {
  text-align: center;
  max-width: 2rem !important;
}
</style>
