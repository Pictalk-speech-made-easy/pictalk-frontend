<template>
  <div class="vertical smallPadding">
    <b-button v-if="$route.query.sidebarPictoId != $store.getters.getSidebarId" icon-left="close" expanded
      class="is-primary" @click="returnWithoutDelete()" />
    <div class="columns is-multiline is-mobile" style="padding: 5%">
      <picto class="
          column
          is-full-mobile
          is-full-tablet
          is-half-desktop
          is-half-widescreen
          is-half-fullhd
          centeredImage
        " v-for="(picto, index) in pictos" :key="index" :picto="picto" :publicMode="publicMode" :sidebarMode="true">
      </picto>
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
      const sidebarSpeech = this.$store.getters.getSpeech.filter(
        (picto) => picto.sidebar && picto.collection
      );
      let prevSidebarPictoIndex = sidebarSpeech.findIndex(
        (picto) => picto.id == this.$route.query.sidebarPictoId
      );
      prevSidebarPictoIndex = sidebarSpeech
        .slice(0, prevSidebarPictoIndex)
        .reverse()
        .findIndex((picto) => picto.collection);
      if (prevSidebarPictoIndex == -1) {
        if (this.publicMode) {
          this.$router.push("/");
        } else {
          if (this.$store.getters.getSidebarId) {
            this.$router.push({
              path: "/pictalk/" + this.$store.getters.getRootId,
              query: {
                isAdmin: this.$route.query.isAdmin,
                sidebarPictoId: this.$store.getters.getSidebarId,
              },
            });
          } else {
            this.$router.push({
              path: "/pictalk",
              query: {
                isAdmin: this.$route.query.isAdmin,
                sidebarPictoId: this.$store.getters.getSidebarId,
              },
            });
          }
        }
        return;
      }
      if (
        sidebarSpeech[sidebarSpeech.length - (prevSidebarPictoIndex + 1)]
          .collection
      ) {
        if (sidebarSpeech[sidebarSpeech.length - 2]?.id) {
          this.$router.push({
            query: {
              ...this.$route.query,
              sidebarPictoId: sidebarSpeech[sidebarSpeech.length - 2].id,
            },
          });
        } else {
          this.$router.push(this.$route.path);
        }
      }
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