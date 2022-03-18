<template>
  <div class="wrapper">
    <navbar />
    <hr />
    <nuxt />
    <br />
  </div>
</template>
<script >
import navbar from "@/components/navigation/navbar";
export default {
  components: {
    navbar,
  },
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
  width: 100%;
  height: 100%;
}
</style>

