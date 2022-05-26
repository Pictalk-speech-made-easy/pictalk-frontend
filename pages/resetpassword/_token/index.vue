<template>
  <div>
    <div class="container">
      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">{{ $t("ResetPassword") }}</h1>
          </div>
        </div>
      </section>
      <b-field :label="$t('NewPassword')">
        <b-input
          type="password"
          v-model="password"
          password-reveal
          :placeholder="$t('PasswordNotice')"
          required
          minlength="8"
          pattern="((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
          :validation-message="$t('PasswordValidationMessage')"
        ></b-input>
      </b-field>
      <b-button class="is-primary" @click="onSubmit(password)">{{
        $t("ChangePassword")
      }}</b-button>
    </div>
  </div>
</template>

<script >
import axios from "axios";
export default {
  data() {
    return {
      password: "",
    };
  },
  methods: {
    async onSubmit(password) {
      if (password == "") {
        const notif = this.$buefy.toast.open({
          duration: 4500,
          message: this.$t("PasswordEmpty"),
          type: "is-info",
          hasIcon: true,
          iconSize: "is-small",
          icon: "account",
        });
        return;
      }
      try {
        const res = await axios.post(
          "/user/changePassword/" + this.$route.params.token,
          {
            password: password,
          }
        );
        if (res.status == 201) {
          const notif = this.$buefy.toast.open({
            duration: 4500,
            message: this.$t("ChangePasswordSuccess"),
            type: "is-success",
            hasIcon: true,
            iconSize: "is-small",
          });
          this.$router.push("/");
        } else {
          const notif = this.$buefy.toast.open({
            duration: 4500,
            message: this.$t("SomeThingBadHappened"),
            type: "is-danger",
            hasIcon: true,
            iconSize: "is-small",
            icon: "account",
          });
        }
      } catch (error) {
        console.log("error: ", error);
        const notif = this.$buefy.toast.open({
          duration: 4500,
          message: this.$t("SomeThingBadHappened"),
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "account",
        });
      }
    },
  },
};
</script>