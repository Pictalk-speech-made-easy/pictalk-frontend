<template>
  <div class="wrapper">
    <pictalkNavbar />
    <hr />
    <nuxt />
    <br />
  </div>
</template>
<script>
import pictalkNavbar from "@/components/navigation/pictalk-navbar";
export default {
  components: {
    pictalkNavbar,
  },
  data() {
    return {
      intervalId: null,
    };
  },
  async created() {
    await this.$store.dispatch("getUser");
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
  async mounted() {
    this.intervalId = setInterval(async function () {
      if (window.navigator.onLine) {
        try {
          await this.$nuxt.$store.dispatch("downloadCollections");
          await this.$nuxt.$store.dispatch("getUser");
        } catch (err) {
          console.log(err);
        }
      }
    }, 300000);
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
};
</script>
<style scoped>
.wrapper {
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

