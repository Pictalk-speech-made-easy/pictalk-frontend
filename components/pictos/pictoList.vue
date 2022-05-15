<template>
  <div class="margins">
    <b-button
      @click="toSidebarHome"
      v-if="sidebar"
      class="onTop"
      type="is-primary"
      icon-left="undo"
    />
    <div class="columns is-multiline is-mobile">
      <picto
        :class="
          sidebar
            ? 'column is-12-mobile is-6-tablet is-6-desktop is-4-widescreen is-4-fullhd'
            : sidebarUsed
            ? 'column is-6-mobile is-one-quarter-tablet is-one-quarter-desktop is-one-quarter-widescreen is-one-fifth-fullhd'
            : 'column is-one-third-mobile is-one-quarter-tablet is-one-quarter-desktop is-one-quarter-widescreen is-one-fifth-fullhd'
        "
        style="margin-bottom: 1%"
        v-for="picto in getFilteredPictoList"
        :key="picto.id + Math.random()"
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
      return this.pictos.filter((picto) => picto.meaning[this.getUserLang]);
    },
  },
  methods: {
    toSidebarHome() {
      this.$router.push({
        query: {
          ...this.$route.query,
          sidebarPictoId: this.$store.getters.getSidebarId,
        },
      });
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
.onTop {
  -webkit-position: sticky;
  -moz-position: sticky;
  position: sticky;
  z-index: 1;
  top: 0;
  width: 100%;
  max-width: 250px;
  margin-bottom: 1rem;
  border: solid;
  border-color: #4c4329;
  border-width: 1px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
}
</style>
