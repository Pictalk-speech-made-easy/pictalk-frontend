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
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        ...i18nHead.htmlAttrs,
        title: `Pictalk AAC: ${this.$t("TitleCompleteKeywords")}`,
      },
      title: `Pictalk AAC: ${this.$t("TitleCompleteKeywords")}`,
      meta: [
      ...i18nHead.meta,
        {
          hid: "description",
          name: "description",
          content: this.$t("DescriptionSEO"),
        },
        {
          hid: "title",
          name: "title",
          content: `Pictalk AAC: ${this.$t("TitleCompleteKeywords")}`
        },
        { 
          hid: 'og-title', 
          property: 'og:title', 
          content: `Pictalk AAC: ${this.$t("TitleCompleteKeywords")}`
        },
        { 
          hid: 'og-desc', 
          property: 'og:description', 
          content: this.$t("DescriptionSEO")
        },
        {
          hid: 'twitter-title',
          property: 'twitter:title',
          content: `Pictalk AAC: ${this.$t("TitleCompleteKeywords")}`
        },
        {
          hid: 'twitter-desc',
          property: 'twitter:description',
          content: this.$t("DescriptionSEO")
        }
        
      ],
    };
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

