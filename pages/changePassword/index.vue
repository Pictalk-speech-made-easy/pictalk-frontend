<template>
  <div style="margin: 1rem">
    <div class="container">
      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">{{ $t("ResetPassword") }}</h1>
          </div>
        </div>
      </section>
      <b-field :label="$t('Email')">
        <b-input
          type="email"
          maxlength="64"
          v-model="username"
          :placeholder="$t('PlaceHolderEmail')"
          required
        ></b-input>
      </b-field>
      <b-message type="is-danger" has-icon>
        {{ $t("CheckSpam") }}
      </b-message>
      <b-button class="is-primary" @click="onSubmit(username)">{{
        $t("ResetPassword")
      }}</b-button>
    </div>
  </div>
</template>

<script difer>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
    };
  },
  methods: {
    async onSubmit(username) {
      if (username == "") {
        const notif = this.$buefy.toast.open({
          duration: 5000,
          message: this.$t("EmailPlease"),
          type: "is-info",
          hasIcon: true,
          icon: "account",
        });
        return;
      }
      try {
        const res = await axios.post("/user/resetPassword", {
          username: username,
        });
        if (res.status == 201) {
          const notif = this.$buefy.toast.open({
            duration: 5000,
            message: this.$t("ChangePasswordDemand"),
            type: "is-success",
            hasIcon: true,
          });
          this.$router.push("/");
        } else {
          const notif = this.$buefy.toast.open({
            duration: 5000,
            message: this.$t("SomeThingBadHappened"),
            type: "is-danger",
            hasIcon: true,
            icon: "account",
          });
        }
      } catch (error) {
        console.log("error: ", error);
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("ServerOffline"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          icon: "account",
        });
      }
    },
  },
};
</script>

