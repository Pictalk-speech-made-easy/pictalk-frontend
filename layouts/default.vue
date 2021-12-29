<template>
  <div class="wrapper">
    <navbar />
    <hr />
    <nuxt />
    <hr />
    <CookieControl :locale="retrieveLocale" />
    <footerPictalk />
  </div>
</template>

<script>
import navbar from "@/components/navigation/navbar";
import footerPictalk from "@/components/navigation/footer";
export default {
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true });
  },
  components: {
    navbar,
    footerPictalk,
  },
  computed: {
    retrieveLocale() {
      return this.$i18n.getLocaleCookie();
    },
  },
};
</script>
<style scoped>
.wrapper {
  overflow-x: hidden;
  position: relative;
}
</style>

