<template>
  <div class="wrapper">
    <navbar />
    <hr />
    <nuxt />
    <hr />
    <footerPictalk />
  </div>
</template>

<script >
import navbar from "@/components/navigation/navbar";
import footerPictalk from "@/components/navigation/footer";
export default {
  components: {
    navbar,
    footerPictalk,
  },
  computed: {
    retrieveLocale() {
      return this.$i18n.getLocaleCookie();
    },
  },
  middleware: ["axios"],
  created() {
    if (
      this.$store.getters.isAuthenticated &&
      this.$store.getters.getUser &&
      this.$store.getters.getUser.displayLanguage.match(/[a-z]{2}/g)
    ) {
      if (
        this.$i18n.locale.code != this.$store.getters.getUser.displayLanguage
      ) {
        this.$i18n.setLocale(this.$store.getters.getUser.displayLanguage);
      }
    }
  },
  mounted() {
    if (!this.$store.getters.isAuthenticated) {
      const notif = this.$buefy.notification.open({
        duration: 6000,
        message: this.$t("CookiePolicie"),
        position: "is-bottom-right",
        type: "is-dark",
        pauseOnHover: true,
        progressBar: true,
      });
    }
  },
};
</script>
<style scoped>
.wrapper {
  overflow-x: hidden;
  position: relative;
  height: 100%;
}
</style>

