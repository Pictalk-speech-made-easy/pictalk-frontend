<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-navbar-item tag="nuxt-link" to="/">
        <img
          src="~/assets/logo_compressed.png"
          alt="A web app that help speach-disabled people"
          height="100px"
        />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="nuxt-link" to="/">Home</b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/getstarted"
        >Get Started ! 🚀</b-navbar-item
      >
      <b-navbar-dropdown label="Info">
        <b-navbar-item tag="nuxt-link" to="/about">About</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/contact">Contact 👨‍💻</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item tag="nuxt-link" to="/news"
        >News & Updates &#127881;</b-navbar-item
      >
      <b-navbar-item tag="nuxt-link" to="/makaton"
          >Makaton 👐</b-navbar-item
        >
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            type="is-primary"
            @click="eraseSpeech()"
            icon-right="home"
          />
          <b-button
            v-if="this.$route.path.includes('pictalk')"
            type="is-success"
            icon-right="refresh-circle"
            @click="refreshPictos"
          />
          <b-button
            v-if="this.$route.path.includes('pictalk')"
            type="is-info"
            icon-right="account-circle"
            tag="nuxt-link"
            to="/account"
          />
          <b-button
            v-if="
              !this.$route.query.isAdmin && this.$route.path.includes('pictalk')
            "
            type="is-link"
            @click="toAdmin"
            icon-right="pencil"
          />
          <b-button
            v-else-if="this.$route.path.includes('pictalk')"
            type="is-light"
            tag="nuxt-link"
            :to="homeLink"
            icon-right="pencil"
          />
          <b-button
            type="is-light"
            tag="nuxt-link"
            to="/help"
            icon-right="help-circle"
          />
          <b-button type="is-light" @click="onLogout">Log Out</b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script>
export default {
  computed: {
    homeLink() {
      return this.$route.path;
    }
  },
  methods: {
    refreshPictos(){
      this.$store.dispatch('downloadAll').then(() => {const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Latest pictogramms downloaded successfully`,
            position: "is-top-right",
            type: "is-success",
            hasIcon: true,
            icon: "refresh"
            });}).catch((error) => {const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Server cannot be reached, check your internet connection`,
            position: "is-top-right",
            type: "is-danger",
            hasIcon: true,
            icon: "danger"
            });})
    },
    eraseSpeech() {
      this.$store.commit("eraseSpeech");
      let adminMode=""
        if(this.$route.query.isAdmin){
          adminMode="?isAdmin=true";
        }
      this.$router.push("/pictalk"+adminMode);
    },
    toAdmin() {
      const a = Math.floor(Math.random() * 10 + 1);
      const b = Math.floor(Math.random() * 10 + 1);
      const res = a + b;
      this.$buefy.dialog.prompt({
        message: `How much is ${a} + ${b} ?`,
        inputAttrs: {
          type: "number",
          placeholder: "Type the response",
          value: "0",
          maxlength: 2,
          min: 0,
          max: 20
        },
        trapFocus: true,
        onConfirm: value => {
          if (value == res) {
            if (!this.$route.query.isAdmin) {
              this.$buefy.toast.open(`You are now in supervisor mode, congrats :D`);
            }
            this.$router.push(this.$route.path + "?isAdmin=true");
          }
          return;
        }
      });
    },
    onLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
};
</script>
