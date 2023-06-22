<template>
  <div class="vertical smallPadding">
    <div class="columns is-multiline is-mobile" style="padding: 5%">
      <picto
        class="
          column
          is-full-mobile
          is-full-tablet
          is-half-desktop
          is-half-widescreen
          is-half-fullhd
          centeredImage
        "
        v-for="(picto, index) in pictos"
        :key="index"
        :picto="picto"
        :publicMode="publicMode"
        :sidebarMode="true"
      ></picto>
      <div class="column is-full" style="padding: 2rem"></div>
    </div>
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
  methods: {
    returnWithoutDelete() {
      const pictoSpeech = this.$store.getters.getSpeech;
        if (this.publicMode) {
          this.$router.push("/public/");
        } else {
          if (this.$store.getters.getSidebarId) {
            this.$router.push({
              path: "/pictalk/" + this.$store.getters.getRootId,
              query: {
                isAdmin: this.$route.query.isAdmin,
              },
            });
          } else {
            this.$router.push({
              path: "/pictalk",
              query: {
                isAdmin: this.$route.query.isAdmin,
              },
            });
          }
        }
        return;
    },
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
  overflow-x: hidden;
  position: fixed;
  left: 75%;
  align-items: center;
}
</style>