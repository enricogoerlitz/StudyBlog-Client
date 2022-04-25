<template>
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
</template>

<script>
export default {
  name: "UserManagementTable",
  props: {
    users: {
      type: Array,
      required: true,
    },
    onShowUserOverlay: {
      type: Function,
      required: true,
    },
    onDeleteUser: {
      type: Function,
      required: true,
    },
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
  margin-bottom: 3rem;
}

table tbody tr {
  height: 3rem;
  border-bottom: 1px solid rgb(228, 228, 228);
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
