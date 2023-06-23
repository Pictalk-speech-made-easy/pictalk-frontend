<template>
  <div class="margins">
    <div
      v-if="
        sidebar
      "
      style="padding-top: 9px"
    />
    <div class="even ">
      <RecycleScroller
    class="scroller"
    :items="getFilteredPictoList"
    :item-size="getItemSize()"
    :grid-items="getRowCount()"
    :item-secondary-size="getItemSize()"
    key-field="id"
  >
  <template #default="{ item, index, active }">
      <picto
        :picto="item"
        :publicMode="publicMode"
        :sidebarMode="sidebar"
        :ref="item?.collection ? 'dragCollection' : 'dragPictogram'"
      />
      <div
        data-cy="cypress-empty-column"
        class="column is-one-third-mobile is-one-quarter-tablet is-one-quarter-desktop is-one-quarter-widescreen is-one-fifth-fullhd"
      ></div>
    </template>
      </RecycleScroller>
    </div>

    <div
      v-if="canReturn && dragndropId"
      class="drag-return"
      v-on="{ dragover: onDragOver, dragleave: onDragLeave, drop: onDrop }"
    ></div>
    <div id="return" class="return">
      <b-icon icon="chevron-left" class="return-icon" />
    </div>
    <div class="filler"></div>
  </div>
</template>
<script >
import picto from "@/components/pictos/picto";
import lang from "@/mixins/lang";
import links from "@/mixins/links";
import { RecycleScroller } from "vue-virtual-scroller";
export default {
  name: "pictoList",
  mixins: [lang, links],
  components: {
    picto,
    RecycleScroller
  },
  data() {
    return {
      timer: 0,
    };
  },
  methods: {
    getItemSize() {
      if (this.sidebar) {
        const sidebarSize = this.getDeviceType() == 'mobile' ? window.innerWidth*0.2 : 200;
        return (sidebarSize)/this.getRowCount(this.getDeviceType());
      }
      if (this.sidebarUsed) {
        const sidebarSize = this.getDeviceType() == 'mobile' ? window.innerWidth*0.2 : 200;
        return ((window.innerWidth-sidebarSize)/this.getRowCount(this.getDeviceType()))/2;
      } else {
        return window.innerWidth?.clientWidth/this.getRowCount(this.getDeviceType());
      }
    },
    getRowCount(deviceType) {
      if (this.sidebar) {
        return 1;
      }
      let rowNumber;
      if (!this.$store.getters.getUser.settings?.pronounceShowSize && this.$store.getters.getUser.settings?.pronounceShowSize != 0) {
        if (deviceType == 'mobile') {
          rowNumber = 3;
        } else if (deviceType == 'tablet') {
          rowNumber = 4;
        } else if (deviceType == 'desktop') {
          rowNumber = 5;
        } else if (deviceType == 'widescreen') {
          rowNumber = 6;
        } else {
          rowNumber = 6;
        }
      }
      if (this.$store.getters.getUser.settings?.pronounceShowSize == 0) {
        if (deviceType == 'mobile') {
          rowNumber = 4;
        } else if (deviceType == 'tablet') {
          rowNumber = 5;
        } else if (deviceType == 'desktop') {
          rowNumber = 6;
        } else if (deviceType == 'widescreen') {
          rowNumber = 6;
        } else {
          rowNumber = 6;
        }
      } else if (this.$store.getters.getUser.settings?.pronounceShowSize == 1) {
        if (deviceType == 'mobile') {
          rowNumber = 3;
        } else if (deviceType == 'tablet') {
          rowNumber = 4;
        } else if (deviceType == 'desktop') {
          rowNumber = 5;
        } else if (deviceType == 'widescreen') {
          rowNumber = 6;
        } else {
          rowNumber = 6;
        }
      } else if (this.$store.getters.getUser.settings?.pronounceShowSize == 2) {
        if (deviceType == 'mobile') {
          rowNumber = 2;
        } else if (deviceType == 'tablet') {
          rowNumber = 3;
        } else if (deviceType == 'desktop') {
          rowNumber = 4;
        } else if (deviceType == 'widescreen') {
          rowNumber = 5;
        } else {
          rowNumber = 5;
        }
      }
      if (this.sidebarUsed) {
        // Minimize the number of rows in order to display correctly the sidebar
      }
      return rowNumber;
    },
    getDeviceType() {
      if (window.innerWidth < 768){
        return 'mobile';
      } else if (window.innerWidth < 1024){
        return 'tablet';
      } else if (window.innerWidth < 1216){
        return 'desktop';
      } else if (window.innerWidth < 1408){
        return 'widescreen';
      } else {
        return 'fullhd';
      }
    },
    onDragOver(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      const goBack = document.getElementById("return");
      goBack.style.transform = "scale(1.5)";
      goBack.style.left = "100px";
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.$nuxt.$emit("removeSpeechDrag");
        }, 600);
      }
    },
    onDragLeave(ev) {
      ev.preventDefault();
      this.timer = clearTimeout(this.timer);
      const goBack = document.getElementById("return");
      goBack.style.transform = "scale(0)";
      goBack.style.left = "10px";
    },
    onDrop(ev) {},
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
    pictoListRendered() {
      return document.getElementById('pictoList-main');
    },
    getFilteredPictoList() {
      return this.pictos.filter((picto) => picto?.meaning[this.getUserLang] || picto?.meaning == "");
    },
    isDropZone() {
      return (
        this.dragndropId && (this.isEditor || this.isToUser) && this.isOnline
      );
    },
    dragndropId() {
      return this.$store.getters.getDragndrop?.draggedPictoId;
    },
    canReturn() {
      return (
        this.$store.getters.getRootId !=
        parseInt(this.$route.params.fatherCollectionId)
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
      }
    }
  },
};
</script>
<style scoped>
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
.drag-return {
  position: fixed;
  width: 35px;
  height: calc(100vh - 64px);
  left: 0px;
  top: 58px;
  background: #00000020;
  border-radius: 0px 24px 24px 0px;
  z-index: 2 !important;
  border: solid;
  border-color: #00000020;
  border-width: 2px;
}
.return {
  position: fixed;
  width: 5vmax;
  height: 5vmax;
  top: 50vh;
  left: 10px;
  background-color: #ff5757;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 500ms ease;
  transform: scale(0);
  box-shadow: 2px 2px 7px #00000090;
}
.return-icon {
  color: white;
  font-size: xxx-large;
}
</style>
