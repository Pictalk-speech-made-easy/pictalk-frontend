<template>
  <div>
    <div
      class="taggbox"
      style="width: 100%; height: 100%"
      data-widget-id="110606"
      data-tags="false"
    ></div>
    <script
      src="https://widget.taggbox.com/embed-lite.min.js"
      type="text/javascript"
    ></script>
  </div>
</template>
<script >
export default {
  data() {
    return {
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
