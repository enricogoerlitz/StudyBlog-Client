<template>
  <div class="container">
    <div class="filter-area">FilterArea</div>
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
          <td>🐼 Edit</td>
          <td>🐼 Delete</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import getAxiosConfig from "../authentication/getAxiosConfig";
import Auth from "../authentication/Auth";

export default {
  name: "UserManagementView",
  data() {
    return {
      users: [],
      filteredUsers: [],
    };
  },
  methods: {},
  async mounted() {
    const currentUser = await Auth.fetchCurrentUser();
    console.log("USER: ", currentUser);
    if (!currentUser) {
      this.$router.push("/login");
      return;
    }
    // if (currentUser.role !== "ADMIN") {
    //   this.$router.push("/blogposts");
    //   return;
    // }
    const dbUsers = await axios.get(
      "http://localhost:8080/api/v1/admin/users",
      getAxiosConfig()
    );
    console.log(dbUsers);
    this.users = dbUsers.data;
    console.log(this.users);
  },
};
</script>

<style scoped>
tr {
  text-align: left;
}
</style>
