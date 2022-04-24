<template>
  <div class="container">
    <div class="filter-area">
      FilterArea
      <button type="button" @click="() => this.onShowUserOverlay()">
        Add User
      </button>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Username</th>
          <th scope="col">Password</th>
          <th scope="col">Role</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th scope="row">{{ user.id }}</th>
          <td>{{ user.username }}</td>
          <td>*********</td>
          <td>{{ user.role }}</td>
          <td>
            <button type="button" @click="() => this.onShowUserOverlay(user)">
              🐼 Edit
            </button>
          </td>
          <td>
            <button type="button" @click="() => this.onDeleteUser(user.id)">
              🐼 Delete
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
    />
  </UserFromOverlay>
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
      filteredUsers: [],
      editUser: null,
      showUserForm: false,
      userFromTitle: "",
    };
  },
  methods: {
    onShowUserOverlay(user) {
      if (user) {
        this.editUser = user;
        this.userFromTitle = "Edit User";
      } else {
        this.userFromTitle = "Add User";
      }
      this.toggleShowUserFrom();
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
      this.users = dbUsers.data;
    },
  },
  async mounted() {
    // TODO: source out
    const currentUser = await Auth.fetchCurrentUser();
    if (!currentUser) {
      this.$router.push("/login");
      return;
    }
    if (currentUser.role !== "ADMIN") {
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
</style>
