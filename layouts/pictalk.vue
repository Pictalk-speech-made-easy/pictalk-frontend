<template>
  <div class="wrapper">
    <pictalkNavbar />
    <hr />
    <nuxt />
    <br />
  </div>
</template>
<script difer>
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
    if (!this.$store.getters.getUser.username) {
      try {
        await this.$store.dispatch("getUser");
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
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
  destroyed() {
    clearInterval(this.intervalId);
  },
  mounted() {
    this.intervalId = setInterval(async () => {
      if (window.navigator.onLine) {
        try {
          await this.$nuxt.$store.dispatch("getUser");
        } catch (err) {
          clearInterval(this.intervalId);
          console.log(err);
        }
      }
    }, 1200000); // 20 minutes
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

