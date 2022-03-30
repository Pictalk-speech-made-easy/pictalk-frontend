<template>
  <div class="columns is-multiline is-mobile notification vertical">
    <picto
      class="column is-full-mobile centeredImage smallPadding"
      v-for="picto in pictos"
      :key="picto.id + Math.random()"
      :picto="picto"
      :adminMode="adminMode"
      :publicMode="publicMode"
      :sidebarMode="true"
    />
  </div>
</template>
<script>
import picto from "@/components/pictos/picto";
export default {
  components: { picto: picto },
  props: {
    adminMode: {
      type: Boolean,
      required: true,
    },
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
  flex-direction: row;
  overflow-y: scroll;
}
</style>