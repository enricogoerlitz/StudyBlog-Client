<template>
  <!-- https://mdbootstrap.com/docs/standard/extended/login/ -->
  <form autocomplete="off" class="auth-form">
    <button
      v-if="showCancelButton"
      type="button"
      @click.prevent="onCloseOverlay"
      class="auth-form__cancel-btn"
    >
      <i class="bi bi-x-circle"></i>
    </button>
    <span class="auth-form__header">{{ formName }}</span>
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        class="form-control"
        autocomplete="off"
        spellcheck="false"
        id="username"
        placeholder="Enter Username"
        v-model="username"
      />
      <div :class="usernameValid">Enter a Username (min 3, max 50)</div>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        class="form-control"
        autocomplete="off"
        spellcheck="false"
        id="password"
        placeholder="Enter Password"
        v-model="password"
      />
      <div :class="passwordValid">Enter a Password (min 4, max 50)</div>
    </div>
    <div v-if="showRoleSelect" class="form-group">
      <label for="role">Role</label>
      <select
        v-model="role"
        class="form-select"
        id="role"
        aria-label="Default select"
      >
        <option selected>Open this select menu</option>
        <option value="ADMIN">Admin</option>
        <option value="STUDENT">Student</option>
      </select>
      <div :class="roleValid">Enter a valid Role!</div>
    </div>
    <button type="submit" class="btn btn-primary" @click.prevent="onSubmitForm">
      {{ buttonText }}
    </button>
    <form v-if="showVisitorLogin">
      <button
        class="btn btn-link mt-1"
        type="submit"
        @click.prevent="onSubmitVisitor"
      >
        Sign In as Visitor
      </button>
    </form>
    <div :class="formValid">{{ formErrorMsg }}</div>
  </form>
</template>

<script>
import axios from "axios";
import AuthJWTCookie from "../../authentication/AuthJWTCookie";
import { createAPIRoute } from "../../utilities/modules/backend";
import {
  validateUsername,
  validatePassword,
  validateRole,
} from "../../utilities/modules/validation";
export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      role: "",
      usernameValid: "invalid",
      passwordValid: "invalid",
      roleValid: "invalid",
      formValid: "invalid",
      formErrorMsg: "",
    };
  },
  props: {
    formName: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    showVisitorLogin: {
      type: Boolean,
      required: false,
    },
    user: {
      type: Object,
      required: false,
    },
    onCloseOverlay: {
      type: Function,
      required: false,
    },
    showRoleSelect: {
      type: Boolean,
      required: false,
    },
    showCancelButton: {
      type: Boolean,
      required: false,
    },
    buttonText: {
      type: String,
      required: false,
    },
  },
  methods: {
    async onSubmitForm() {
      if (!this.validateFormInputs()) return;

      try {
        await this.onSubmit(this.username, this.password, this.role);
      } catch (err) {
        console.log(err.response);
        this.printResponseError(err.response.status);
      }
    },

    async onSubmitVisitor() {
      try {
        const res = await axios.get(createAPIRoute("/api/v1/auth/visitor"));
        if (res.status == 200) {
          new AuthJWTCookie(res.data).set();
          document.location.href = "/blogposts";
        }
      } catch (err) {
        this.printResponseError(err.response.status);
      }
    },

    validateFormInputs() {
      const isUsernameValid = validateUsername(this.username);
      const isPasswordValid = validatePassword(this.password);
      const isRoleValid = validateRole(this.role);

      if (this.showVisitorLogin) {
        // without role => login/register  ==> showVisitorLogIn
        this.validateLoginRegisterInputs(isUsernameValid, isPasswordValid);
        return isUsernameValid && isPasswordValid;
      } else if (this.user && this.showRoleSelect) {
        // without password => updateUserByAdmin ==> user !== null && showRoleSelect
        this.validateUpdateUserByAdminInputs(isUsernameValid, isRoleValid);
        return isUsernameValid && isRoleValid;
      } else if (this.user && !this.showRoleSelect) {
        // without role and password => updateMe ==> user!== null && !showSelect
        this.validateUpdateUserSelf(isUsernameValid);
        return isUsernameValid;
      }

      // add by admin
      this.validateAddUserByAdmin(
        isUsernameValid,
        isPasswordValid,
        isRoleValid
      );

      return isUsernameValid && isPasswordValid && isRoleValid;
    },

    validateLoginRegisterInputs(isUsernameValid, isPasswordValid) {
      const [usernameValid, passwordValid] = this.getValidationCssClasses(
        isUsernameValid,
        isPasswordValid
      );
      this.usernameValid = usernameValid;
      this.passwordValid = passwordValid;
    },

    validateUpdateUserByAdminInputs(isUsernameValid, isRoleValid) {
      const [usernameValid, roleValid] = this.getValidationCssClasses(
        isUsernameValid,
        isRoleValid
      );
      this.usernameValid = usernameValid;
      this.roleValid = roleValid;
    },

    validateUpdateUserSelf(isUsernameValid) {
      const [usernameValid] = this.getValidationCssClasses(isUsernameValid);
      this.usernameValid = usernameValid;
    },

    validateAddUserByAdmin(isUsernameValid, isPasswordValid, isRoleValid) {
      const [usernameValid, passwordValid, roleValid] =
        this.getValidationCssClasses(
          isUsernameValid,
          isPasswordValid,
          isRoleValid
        );
      this.usernameValid = usernameValid;
      this.passwordValid = passwordValid;
      this.roleValid = roleValid;
    },

    getValidationCssClasses(...validStatus) {
      return validStatus.map((status) => (status ? "invalid" : "invalid show"));
    },

    printResponseError(statusCode) {
      console.log("ERRORCODE: ", statusCode);
      switch (statusCode) {
        case 400:
          this.formErrorMsg = `This username is still existing! (${statusCode})`;
          break;
        case 403:
          this.formErrorMsg = `Could not find this User! (${statusCode})`;
          break;
        default:
          this.formErrorMsg = `Unexpected Error with Statuscode: ${statusCode}!`;
          break;
      }
      this.formValid = "invalid show";
    },
  },
  mounted() {
    if (this.user) {
      const { username, role } = this.user;
      (this.username = username), (this.role = role);
      this.password = "";
    }
  },
};
</script>

<style scoped>
label {
  text-align: left;
  width: 100%;
  margin-top: 0.9rem;
  margin-bottom: 0.1rem;
}

.btn {
  width: 100%;
  margin-top: 1.3rem;
}

.auth-form {
  position: relative;
  width: 95%;
  max-width: 25rem;
  padding: 0.8rem 1.1rem 1.2rem 1.1rem;
  margin: auto;
  border: 1px solid rgb(176, 176, 176);
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0px 1px 5px 0px rgba(240, 240, 240, 0.5);
}

.auth-form__header {
  font-weight: bold;
  font-size: 1.8rem;
}

.auth-form__cancel-btn {
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
.auth-form__cancel-btn:hover {
  cursor: pointer;
  background-color: rgb(236, 236, 236);
  color: rgb(40, 40, 40);
}
</style>
