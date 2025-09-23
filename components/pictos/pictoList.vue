<template>
  <div class="margins">
    <div v-if="sidebar
    " style="padding-top: 9px" />
    <transition name="fade" mode="out-in">
      <div :key="getFilteredPictoList.length" class="columns is-multiline is-mobile even picto-container">
        <picto :class="sidebar
          ? 'column is-12'
          : sidebarUsed
            ? 'column is-6-mobile is-4-tablet is-3-desktop is-3-widescreen is-one-fifth-fullhd'
            : customPictoSize
          " v-for="(picto, index) in getFilteredPictoList" :key="picto.id" :picto="picto" :publicMode="publicMode"
          :sidebarMode="sidebar" :ref="picto.collection ? 'dragCollection' : 'dragPictogram'" />
        <div data-cy="cypress-empty-column"
          class="column is-one-third-mobile is-one-quarter-tablet is-one-quarter-desktop is-one-quarter-widescreen is-one-fifth-fullhd">
        </div>
      </div>
    </transition>
    <div class="filler"></div>
  </div>
</template>
<script>
import picto from "@/components/pictos/picto";
import lang from "@/mixins/lang";
import links from "@/mixins/links";
export default {
  name: "pictoList",
  mixins: [lang, links],
  components: {
    picto
  },
  props: {
    pictos: {
      type: Array,
      required: true,
    },
    publicMode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    sidebar: {
      type: Boolean,
      required: true,
      default: () => false,
    },
    sidebarUsed: {
      type: Boolean,
      required: false,
      default: () => true,
    },
  },
  computed: {
    getFilteredPictoList() {
      return this.pictos.filter((picto) => picto?.meaning && (picto.meaning[this.getUserLang] || picto.meaning == ""));
    },
    isDropZone() {
      return (
        this.dragndropId && (this.isEditor || this.isToUser) && window.navigator.onLine
      );
    },
    customPictoSize() {
      if (!this.$store.getters.getUser.settings?.pronounceShowSize && this.$store.getters.getUser.settings?.pronounceShowSize != 0) {
        return 'column is-one-third-mobile is-one-fifth-tablet is-one-fifth-desktop is-2-widescreen is-1-fullhd';
      }
      if (this.$store.getters.getUser.settings?.pronounceShowSize == 0) {
        return 'column is-one-quarter-mobile is-one-fifth-tablet is-1-desktop is-1-widescreen is-1-fullhd';
      } else if (this.$store.getters.getUser.settings?.pronounceShowSize == 1) {
        return 'column is-one-third-mobile is-one-quarter-tablet is-one-fifth-desktop is-2-widescreen is-1-fullhd';
      } else if (this.$store.getters.getUser.settings?.pronounceShowSize == 2) {
        return 'column is-half-mobile is-one-third-tablet is-one-fourth-desktop is-one-fifth-widescreen is-2-fullhd';
      } else if (this.$store.getters.getUser.settings?.pronounceShowSize == 3) {
        return "topImage column is-full-mobile is-6-tablet is-6-desktop is-one-third-widescreen is-one-fourth-fullhd";
      }
    }
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.even {
  justify-content: space-between;
}

.margins {
  margin-left: 7px;
  margin-right: 7px;
}

.filler {
  padding-bottom: 30vh;
}
</style>
