<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head" style="padding: 2%">
        <b-button
          class="button"
          type="is-danger"
          icon-left="arrow-left"
          @click="$parent.close()"
        />
        <p align="center" class="modal-card-title">{{ $t("LogIn") }}</p>
      </header>
      <section class="modal-card-body">
        <b-field :label="$t('Email')">
          <b-input
            type="email"
            maxlength="64"
            v-model="username"
            :placeholder="$t('PlaceHolderEmail')"
            required
          ></b-input>
        </b-field>

        <b-field :label="$t('Password')">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            :placeholder="$t('PlaceHolderPassword')"
            required
          ></b-input>
        </b-field>
        <a href="/changePassword">{{ $t("ForgotPswd") }}</a>
      </section>
      <footer class="modal-card-foot" style="padding: 2%">
        <b-button class="is-primary" @click="onSubmit">{{
          $t("LogIn")
        }}</b-button>
      </footer>
    </div>
  </form>
</template>
<script>
import signup from "@/components/auth/signupModal";
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async onSubmit() {
      try {
        const res = await this.$store.dispatch("authenticateUser", {
          username: this.username,
          password: this.password,
          isLogin: true,
        });
        if (res.status == 201) {
          this.$parent.close();
          this.$router.push("/pictalk");
          const notif = this.$buefy.toast.open({
            duration: 5000,
            message: this.$t("Welcome"),

            type: "is-info",
            hasIcon: true,
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status == 400 || error.response.status == 401) {
            const notif = this.$buefy.toast.open({
              duration: 5000,
              message: this.$t("WrongCredentials"),
              type: "is-danger",
              hasIcon: true,
              icon: "account",
            });
          } else if (error.response.status == 403) {
            const notif = this.$buefy.toast.open({
              duration: 5000,
              message: this.$t("MustVerifyEmail"),
              type: "is-danger",
              hasIcon: true,
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
            });
          } else {
            const notif = this.$buefy.notification.open({
              duration: 5000,
              message: this.$t("ServerOffline"),
              position: "is-top-right",
              type: "is-danger",
              hasIcon: true,
              icon: "account",
            });
          }
        } else {
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: this.$t("ServerOffline"),
            position: "is-top-right",
            type: "is-danger",
            hasIcon: true,
            icon: "account",
          });
        }
      }
    },
  },
};
</script>
