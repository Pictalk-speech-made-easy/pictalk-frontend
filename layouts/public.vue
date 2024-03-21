<template>
  <div class="wrapper">
    <client-only>
      <navbar />
      <hr style="margin: 20px" />
      <nuxt />
      <br />
    </client-only>
  </div>
</template>

<script>
import navbar from "@/components/navigation/navbar";
import popupModal from "@/components/auth/popupModal";
import Cookie from "js-cookie";
import axios from "axios";
import signupModal from "../components/auth/signupModal.vue";
export default {
  middleware: ["check-auth", "axios"],
  components: {
    navbar,
    popupModal
  },
  destroyed() {
    clearTimeout(this.showPopupTimeout);
  },
  data() {
    return {
      popupTimeout: null,
    };
  },
  async created() {
    if (process.client) {
      var _mtm = window._mtm = window._mtm || [];
      _mtm.push({ 'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start' });
      var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      g.async = true; g.src = 'https://analytics.picmind.org//js/container_V1sL8eXl.js'; s.parentNode.insertBefore(g, s);
    }

    // Check if the user is authenticated with Keycloak and has an account in Pictalk
    try {
      await axios.get("/user/details/");
      this.$store.commit('setUserInitialized', true);
    } catch (err) {
      if (err?.response?.status === 403) {
        this.$store.commit('setUserInitialized', false);
        // Open the signup modal if the user isn't authenticated
        this.$buefy.modal.open({
          parent: this,
          component: signupModal,
          hasModalCard: true,
          trapFocus: true,
          canCancel: false,
          onCancel: () => {
            this.$buefy.modal.close();
          },
        });
      }
    }


    // If the user isn't authenticated and the popup cookie isn't set or hasn't expired, show the popup
    this.popupTimeout = setTimeout(() => {
      if (!Cookie.get('popup') && !this.$store.getters.getUser?.username) {
        this.$buefy.modal.open({
          parent: this,
          component: popupModal,
          hasModalCard: true,
          trapFocus: true,
          canCancel: false,
          onCancel: () => {
            this.$buefy.modal.close();
          },
        });
        Cookie.set('popup', true, { expires: 3 });
      }
    }, 30000);
    if (
      this.$keycloak.authenticated &&
      this.$store.getters.getUser &&
      this.$store.getters.getUser?.displayLanguage?.match(/[a-z]{2}/g)
    ) {
      if (
        this.$i18n.locale.code != this.$store.getters.getUser.displayLanguage
      ) {
        this.$i18n.setLocale(this.$store.getters.getUser.displayLanguage);
      }
    }
  },
  destroyed() {
    clearTimeout(this.popupTimeout);
  },
};
</script>

<style scoped>
.wrapper {
  overflow-x: hidden;
  position: relative;
  width: 100%;
  bottom: 0%;
  height: calc(100vh - 32px);
}
</style>
