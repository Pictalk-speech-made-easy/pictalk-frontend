<template>
  <div class="margins">
    <div
      v-if="
        sidebar && !($route.query.sidebarPictoId != $store.getters.getSidebarId)
      "
      style="padding-top: 9px"
    />
    <div class="columns is-multiline is-mobile">
      <picto
        :class="
          sidebar
            ? 'column is-12-mobile is-6-tablet is-6-desktop is-4-widescreen is-3-fullhd'
            : sidebarUsed
            ? 'column is-6-mobile is-4-tablet is-3-desktop is-3-widescreen is-one-fifth-fullhd'
            : 'column is-one-third-mobile is-one-fifth-tablet is-one-fifth-desktop is-2-widescreen is-1-fullhd'
        "
        style="margin-bottom: 1%"
        v-for="(picto, index) in getFilteredPictoList"
        :key="index"
        :picto="picto"
        :publicMode="publicMode"
        :sidebarMode="sidebar"
      />

      <div
        class="
          column
          is-one-third-mobile
          is-one-quarter-tablet
          is-one-quarter-desktop
          is-one-quarter-widescreen
          is-one-fifth-fullhd
        "
      ></div>
    </div>

    <div class="filler"></div>
  </div>
</template>
<script >
import picto from "@/components/pictos/picto";
import lang from "@/mixins/lang";
import enforcedSecurity from "@/mixins/enforcedSecurity";
import links from "@/mixins/links";
export default {
  name: "pictoList",
  mixins: [lang, enforcedSecurity, links],
  components: {
    picto,
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
      return this.pictos.filter((picto) => picto?.meaning[this.getUserLang]);
    },
  },
};
</script>
<style scoped>
.margins {
  margin-left: 7px;
  margin-right: 7px;
}
.filler {
  padding-bottom: 30vh;
}
</style>
