<template>
  <div @click="downloadImg(webpicto.download)">
    <b-tooltip
      type="is-dark"
      position="is-bottom"
      is-small
      multilined
      :triggers="['hover', 'contextmenu']"
    >
      <b-image lazy :src="webpicto.src"></b-image>
      <b>{{ webpicto.title }}</b>
      <template v-slot:content>
        {{ webpicto.source }}/{{ webpicto.author }}
      </template>
    </b-tooltip>
  </div>
</template>

<script>
export default {
  name: "Webpicto",

  props: {
    webpicto: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async downloadImg(src) {
      this.show = 1;
      let response = await fetch(src);
      response = await response.blob();
      const file = new File(
        [response],
        `${this.webpicto.title.replaceAll(
          /[&\/\\#, +()$~%.'":*?<>{}]/g,
          "-"
        )}.jpg`,
        { type: response.type }
      );
      this.$emit("uploadfile", file);
    },
  },
};
</script>
