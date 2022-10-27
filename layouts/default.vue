<template>
  <div class="wrapper">
    <navbar />
    <hr style="margin: 20px" />
    <nuxt />
    <hr style="margin: 1.2rem 0" />
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
};
</script>
<style scoped>
.wrapper {
  overflow-x: hidden;
  position: relative;
  bottom: 0%;
  height: calc(100vh - 32px);
}
</style>

