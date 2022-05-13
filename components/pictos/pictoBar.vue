<template>
  <div class="notification columns is-mobile nopadding" :style="cssVars">
    <div class="column is-narrow nopadding">
      <b-button
        inverted
        type="is-danger"
        icon-right="delete"
        @click="eraseSpeech()"
      />
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        inverted
        type="is-danger"
        icon-right="backspace"
        @click="removeSpeech(true)"
      />
    </div>
    <div
      @click="copyPictosToClipboardBase(pictos)"
      class="column"
      style="padding: 0%"
    >
      <div id="bar" class="scrolling">
        <miniPicto
          class
          v-for="picto in pictosWithoutSilent"
          :key="picto.id + Math.random()"
          :image="picto.image"
          :pictoCount="picto.count"
        />
      </div>
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        v-if="$store.getters.getTemporaryLanguage"
        type="is-success"
        icon-right="volume-high"
        @click="pictalk(pictos)"
        v-longpress="openTravelerMode"
        >{{ getEmoji($store.getters.getTemporaryLanguage) }}</b-button
      >
      <b-button
        v-else
        type="is-success"
        icon-right="volume-high"
        @click="pictalk(pictos)"
        v-longpress="openTravelerMode"
      ></b-button>
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        type="is-primary"
        icon-right="undo"
        @click="removeSpeech(false)"
      />
    </div>
    <b-button
      v-if="fits"
      type="is-info"
      icon-right="content-copy"
      @click="copyPictosToClipboardBase(pictosWithoutSilent)"
    />
  </div>
</template>
<script >
import miniPicto from "@/components/pictos/miniPicto";
import mergeImages from "merge-images-horizontally-with-text";
import tradLanguageListVue from "@/components/pictos/tradLanguageList.vue";
import deviceInfos from "@/mixins/deviceInfos";
import emoji from "@/mixins/emoji";
import tts from "@/mixins/tts";
import lang from "@/mixins/lang";
export default {
  mixins: [emoji, tts, deviceInfos, lang],
  destroyed() {
    window.removeEventListener("resize", this.fitsBigger);
  },
  mounted() {
    window.addEventListener("resize", this.fitsBigger);
  },
  methods: {
    fitsBigger() {
      this.fits = window.innerWidth > 767;
    },
    openTravelerMode(e) {
      if (this.$store.getters.getUser.settings.travelMode) {
        if (!this.$store.getters.getTemporaryLanguage) {
          this.$buefy.modal.open({
            parent: this,
            component: tradLanguageListVue,
            hasModalCard: true,
            customClass: "custom-class custom-class-2",
            trapFocus: true,
            canCancel: ["escape", "x"],
          });
        } else {
          this.$store.commit("setTemporaryLanguage", null);
        }
      }
    },
    getText(pictos) {
      return pictos.reduce(
        (acc, curr_val) =>
          acc +
          " " +
          (curr_val.count != 1 ? curr_val.count : "") +
          curr_val.speech[this.getUserLang],
        ""
      );
    },
    async copyPictosToClipboardLegacy(pictos) {
      const message = this.getText(pictos);
      try {
        await this.$copyText(message);
        const notif = this.$buefy.toast.open({
          duration: 5000,
          message: this.$t("CopySucces"),
          type: "is-success",
          hasIcon: true,
        });
      } catch (e) {
        const notif = this.$buefy.toast.open({
          duration: 5000,
          message: this.$t("CopyError"),
          type: "is-danger",
          hasIcon: true,
        });
      }
    },
    async copyPictosToClipboardBase(pictos) {
      const canWriteToClipboard = await this.askWritePermission();
      if (canWriteToClipboard) {
        await this.copyPictosToClipboardV2(pictos);
      } else {
        await this.copyPictosToClipboardLegacy(pictos);
      }
    },
    async copyPictosToClipboardV2(pictos) {
      const paths = pictos.map((picto) => picto.image);
      const text = this.getText(pictos);
      const b64 = await mergeImages(paths, {
        crossOrigin: "Anonymous",
        text: text,
        color: "white",
      });
      try {
        const blob = this.b64toBlob(b64);
        const data = [new ClipboardItem({ [blob.type]: blob })];
        await navigator.clipboard.write(data);
        const notif = this.$buefy.toast.open({
          duration: 5000,
          message: this.$t("CopySucces"),
          type: "is-success",
        });
      } catch (e) {
        console.log(e);
        await this.$copsyText(b64);
        const notif = this.$buefy.toast.open({
          duration: 5000,
          message: this.$t("CopyError"),
          type: "is-danger",
        });
      }
    },
    async pictalk(pictos) {
      this.pronounce(this.getText(pictos), this.getUserLang, this.voiceURI);
    },
    removeSpeech(erase) {
      const pictoSpeech = this.$store.getters.getSpeech;
      const pictalkSpeech = this.$store.getters.getSpeech.filter(
        (picto) => !picto.sidebar && picto.collection
      );
      const sidebarSpeech = this.$store.getters.getSpeech.filter(
        (picto) => picto.sidebar && picto.collection
      );
      if (pictoSpeech[pictoSpeech.length - 1].collection) {
        if (pictoSpeech[pictoSpeech.length - 1].sidebar) {
          if (sidebarSpeech.length <= 1) {
            if (this.publicMode) {
              this.$router.push("/public/");
            } else {
              if (this.$store.getters.getSidebarId) {
                this.$router.push({
                  query: {
                    isAdmin: this.$route.query.isAdmin,
                    sidebarPictoId: this.$store.getters.getSidebarId,
                  },
                });
              } else {
                this.$router.push({
                  query: {
                    isAdmin: this.$route.query.isAdmin,
                  },
                });
              }
            }
          } else {
            this.$router.push({
              query: {
                ...this.$route.query,
                sidebarPictoId: sidebarSpeech[sidebarSpeech.length - 2]?.id,
              },
            });
          }
        } else {
          if (pictalkSpeech.length <= 1) {
            if (this.publicMode) {
              this.$router.push("/public/");
            } else {
              if (this.$store.getters.getRootId) {
                this.$router.push({
                  path: "/pictalk/" + this.$store.getters.getRootId,
                  query: { ...this.$route.query },
                });
              } else {
                this.$router.push({
                  path: "/pictalk/",
                  query: { ...this.$route.query },
                });
              }
            }
          } else {
            this.$router.push({
              path:
                (this.publicMode ? "/public/" : "/pictalk/") +
                pictalkSpeech[pictalkSpeech.length - 2]?.id,
              query: { ...this.$route.query },
            });
          }
        }
      }
      if (erase != null) {
        if (erase == false) {
          return;
        }
      }
      this.$store.commit("removeSpeech");
    },
    eraseSpeech() {
      this.$store.commit("eraseSpeech");
      if (this.publicMode) {
        this.$router.push("/public/");
        return;
      }
      if (this.$store.getters.getRootId) {
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
    },
    async askWritePermission() {
      try {
        // The clipboard-write permission is granted automatically to pages
        // when they are the active tab. So it's not required, but it's more safe.
        const { state } = await navigator.permissions.query({
          name: "clipboard-write",
        });
        return state === "granted";
      } catch (error) {
        // Browser compatibility / Security error (ONLY HTTPS) ...
        return false;
      }
    },
    b64toBlob(dataURI) {
      const byteString = atob(dataURI.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
  },
  computed: {
    cssVars() {
      return {
        "--bg-color":
          this.collectionColor === "#ffffff00"
            ? "#f5f5f5"
            : this.collectionColor,
      };
    },
    pictosWithoutSilent() {
      return this.pictos.filter(
        (picto) => picto.speech[this.getUserLang] != ""
      );
    },
  },
  components: {
    miniPicto: miniPicto,
  },
  props: {
    pictos: {
      type: Array,
      required: true,
    },
    collectionColor: {
      type: String,
      required: true,
    },
    publicMode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  watch: {
    pictos: function () {
      setTimeout(() => {
        let element = document.getElementById("bar");
        element.scrollLeft = element.scrollWidth;
      }, 125);
    },
  },
  data() {
    return {
      adminMode: false,
      voices: [],
      voiceURI: "",
      fits: false,
    };
  },
};
</script>
<style scoped>
.content {
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
}
.notification {
  background-color: var(--bg-color);
  position: relative;
  align-items: center;
  border: solid;
  border-color: #fe5555;
  border-width: 2.5px;
}
.nopadding {
  padding: 0.2rem;
}
.scrolling {
  display: flex;
  flex-direction: row;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
</style>
