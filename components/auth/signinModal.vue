<template>
  <client-only>
  <form action @keyup.enter="onSubmit()">
    <div class="modal-card" style="min-height: 30vh">
      <header class="modal-card-head">
        <b-button
          class="button"
          type="is-danger"
          icon-left="close"
          @click="$parent.close()"
        />
        <p align="center" class="modal-card-title">{{ $t("LogIn") }}</p>
      </header>
      <section class="modal-card-body">
        <b-field :label="$t('Email')">
          <b-input
            data-cy="signin-email"
            type="email"
            lazy
            maxlength="64"
            v-model="username"
            :placeholder="$t('PlaceHolderEmail')"
            required
          ></b-input>
        </b-field>

        <b-field :label="$t('Password')">
          <b-input
            data-cy="signin-password"
            type="password"
            lazy
            v-model="password"
            password-reveal
            :placeholder="$t('PlaceHolderPassword')"
            required
          ></b-input>
        </b-field>
        <a href="/changePassword">{{ $t("ForgotPswd") }}</a>
      </section>
      <footer class="modal-card-foot">
        <b-button data-cy="signin-signin" class="is-primary" :loading="loading" @click="onSubmit">{{
          $t("LogIn")
        }}</b-button>
      </footer>
    </div>
  </form>
</client-only>
</template>
<script >
import signup from "@/components/auth/signupModal";
export default {
  data() {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },
  middleware: ["axios"],
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        const res = await this.$store.dispatch("authenticateUser", {
          username: this.username,
          password: this.password,
          isLogin: true,
        });
        if (res.status == 201) {
          await this.$store.dispatch("getUser");

          this.$parent.close();
          this.$router.push({
            path: "/pictalk/" + this.$store.getters.getRootId,
            query: {
              sidebarPictoId: this.$store.getters.getSidebarId,
            },
          });
          if (this.$store.getters.getUser.notifications.length != 0) {
            this.$buefy.notification.open({
              message: this.$t("UnreadNotifications"),
              type: "is-info",
            });
          }
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status == 400 || error.response.status == 401) {
            const notif = this.$buefy.toast.open({
              message: this.$t("WrongCredentials"),
              type: "is-danger",
              hasIcon: true,
              iconSize: "is-small",
              icon: "account",
            });
          } else if (error.response.status == 403) {
            const notif = this.$buefy.toast.open({
              message: this.$t("MustVerifyEmail"),
              type: "is-danger",
              hasIcon: true,
              iconSize: "is-small",
              icon: "account",
            });
            this.$parent.close();
            this.$buefy.modal.open({
              parent: this,
              component: signup,
              props: {
                recoverCode: true,
                credentials: {
                  username: this.username,
                  password: this.password,
                },
              },
              hasModalCard: true,
              customClass: "custom-class custom-class-2",
              trapFocus: true,
              canCancel: ["escape", "x"],
            });
          } else {
            console.log(error);
            const notif = this.$buefy.notification.open({
              duration: 4500,
              message: this.$t("ServerOffline"),
              position: "is-top-right",
              type: "is-danger",
              hasIcon: true,
              iconSize: "is-small",
              iconSize: "medium",
              icon: "account",
            });
          }
        } else {
          console.log(error);
          const notif = this.$buefy.notification.open({
            duration: 4500,
            message: this.$t("ServerOffline"),
            position: "is-top-right",
            type: "is-danger",
            hasIcon: true,
            iconSize: "is-small",
            icon: "account",
          });
        }
        this.loading = false;
      }
    },
  },
};
</script>
