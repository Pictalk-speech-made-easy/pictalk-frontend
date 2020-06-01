<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-navbar-item tag="nuxt-link" to="/">
        <img
          src="~/assets/logo.png"
          alt="A web app that help speach-disabled people"
          style="height: 100px;"
        />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="nuxt-link" to="/">Home</b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/getstarted">Get Started !</b-navbar-item>
      <b-navbar-dropdown label="Info">
        <b-navbar-item tag="nuxt-link" to="/about">About</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/contact">Contact</b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button @click="signUp()" type="is-primary">Sign Up</b-button>
          <b-button @click="signIn()" type="is-light">Log In</b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import signin from "@/components/auth/signinModal";
import signup from "@/components/auth/signupModal";
export default {
  components: {
    signin,
    signup
  },
  methods: {
    signIn() {
      this.$buefy.modal.open({
        parent: this,
        component: signin,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true
      });
    },
    signUp() {
      this.$buefy.modal.open({
        parent: this,
        component: signup,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true
      });
    }
  }
};
</script>




