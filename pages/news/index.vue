<template>
  <div class="container">
    <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
    <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
    <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
    <iframe
      src="https://widget.taggbox.com/110606"
      style="width: 100%; height: 600px; border: none"
    ></iframe>
  </div>
</template>
<script >
export default {
  mounted() {
    document.querySelector("iframe").onload = () => {
      this.newsCharged = true;
    };
  },
  data() {
    return {
      newsCharged: false,
      done: true,
    };
  },
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        title: this.$t("TitleNews"),
        ...i18nHead.htmlAttrs,
      },
      title: this.$t("TitleNews"),
      meta: [
        {
          hid: "descriptionNews",
          name: "description",
          content: this.$t("DescriptionNews"),
        },
        ...i18nHead.meta,
      ],
    };
  },
};
</script>
