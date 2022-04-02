<template>
  <div class="columns is-multiline is-mobile vertical">
    <picto
      class="
        column
        is-full-mobile
        is-full-tablet
        is-half-desktop
        is-half-widescreen
        is-half-fullhd
        centeredImage
        smallPadding
      "
      v-for="picto in pictos"
      :key="picto.id + Math.random()"
      :picto="picto"
      :publicMode="publicMode"
      :sidebarMode="true"
    ></picto>
    <div class="column is-full" style="padding: 2rem"></div>
  </div>
</template>
<script>
import picto from "@/components/pictos/picto";
export default {
  components: { picto: picto },
  props: {
    publicMode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    pictos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
};
</script>
<style scoped>
.smallPadding {
  padding: 5%;
}
.centeredImage {
  align-items: center;
  justify-content: center;
}
.vertical {
  overflow-y: scroll;
  position: fixed;
  left: 75%;
  align-items: center;
}
</style>