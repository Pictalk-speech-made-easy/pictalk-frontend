<template>
  <div class="notification columns is-mobile nopadding" :style="cssVars">
    <div class="column is-narrow nopadding">
      <b-button
        inverted
        type="is-danger"
        icon-right="delete"
        class="buttonBorder getsBigger"
        @click="eraseSpeech()"
      />
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        inverted
        type="is-danger"
        icon-right="backspace"
        class="buttonBorder getsBigger"
        @click="removeSpeech(true)"
      />
    </div>
    <div class="column" style="padding: 0%">
      <div id="bar" class="scrolling">
        <miniPicto
          v-for="(picto, index) in pictosWithoutSilent"
          :key="index"
          :image="picto.image"
          :pictoCount="picto.count"
        />
      </div>
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        v-if="$store.getters.getTemporaryLanguage"
        class="getsBigger"
        type="is-success"
        icon-right="volume-high"
        @click="pictalk(pictos)"
        >{{ getEmoji($store.getters.getTemporaryLanguage) }}</b-button
      >
      <b-button
        v-else
        type="is-success"
        class="getsBigger"
        icon-right="volume-high"
        @click="pictalk(pictos)"
      ></b-button>
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        class="getsBigger"
        type="is-info"
        icon-right="content-copy"
        @click="copyPictosToClipboardBase(pictosWithoutSilent)"
      />
    </div>
    <div v-if="vocalize" class="onTop">
      <b-button
        type="is-danger"
        icon-left="close"
        @click="vocalize = false"
        style="margin-left: 2vmax; margin-top: 2vmax"
      />
      <div class="columns is-multiline is-mobile topColumns">
        <img
          v-for="(picto, index) in pictosWithoutSilent"
          :key="index"
          :src="picto.image"
          :class="wordIndex >= index? 'topImage column is-3-mobile is-2-tablet is-2-desktop is-2-widescreen is-2-fullhd animations': 'topImage column is-3-mobile is-2-tablet is-2-desktop is-2-widescreen is-2-fullhd lowBrightness'"
        ></img>
      </div>
    </div>
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
  methods: {
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
    getChars(pictos) {
      let chars = [];
      let lastLength = 0;
      for (let picto of pictos) {
        chars.push(picto.speech[this.getUserLang].length + 1 + lastLength);
        lastLength = picto.speech[this.getUserLang].length + lastLength;
      }
      return chars;
    },
    async copyPictosToClipboardLegacy(pictos) {
      const message = this.getText(pictos);
      try {
        await this.$copyText(message);
        const notif = this.$buefy.toast.open({
          message: this.$t("CopySucces"),
          type: "is-success",
          hasIcon: true,
          iconSize: "is-small",
        });
      } catch (e) {
        const notif = this.$buefy.toast.open({
          message: this.$t("CopyError"),
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
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
          message: this.$t("CopySucces"),
          type: "is-success",
        });
      } catch (e) {
        console.log(e);
        await this.$copsyText(b64);
        const notif = this.$buefy.toast.open({
          message: this.$t("CopyError"),
          type: "is-danger",
        });
      }
    },
    async pictalk(pictos) {
      this.vocalize = true;
      this.chars = this.getChars(pictos);
      this.pronounce(
        this.getText(pictos),
        this.getUserLang,
        this.voiceURI,
        this.pitch,
        this.rate,
        this.synthesis
      );
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
              //this.$router.push("/public/");
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
              this.$router.push(
                "/public/" + pictalkSpeech[0]?.fatherCollectionId
              );
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
      if (this.publicMode) {
        const pictalkSpeech = this.$store.getters.getSpeech.filter(
          (picto) => !picto.sidebar && picto.collection
        );
        if (pictalkSpeech.length >= 1) {
          this.$router.push("/public/" + pictalkSpeech[0]?.fatherCollectionId);
        }
        this.$store.commit("eraseSpeech");
      } else {
        this.$store.commit("eraseSpeech");
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
  mounted() {
    this.synthesis = new SpeechSynthesisUtterance();
    this.synthesis.addEventListener("end", (event) => {
      setTimeout(() => {
        this.vocalize = false;
        this.wordIndex = 0;
      }, 500);
    });
    this.synthesis.addEventListener("boundary", (event) => {
      if (
        event.name == "word" &&
        event.charIndex >= this.chars[this.wordIndex]
      ) {
        this.wordIndex = this.wordIndex + 1;
      }
    });
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
      chars: [],
      wordIndex: 0,
      synthesis: null,
      vocalize: false,
      adminMode: false,
      voices: [],
      voiceURI: "",
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
.onTop {
  position: fixed;
  top: 52px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #000000df;
  z-index: 2;
}
.topColumns {
  margin-left: auto;
  width: 96vw;
  max-width: 900px;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  max-height: 70vh;
  overflow-y: auto;
}
.topImage {
  margin-bottom: 1vh;
  padding: 2px;
}
.notification {
  background-color: var(--bg-color);
  position: relative;
  align-items: center;
  border: solid;
  border-color: #4c4329;
  border-width: 2px;
}
.nopadding {
  padding: 0.25rem;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
}
.scrolling {
  display: flex;
  flex-direction: row;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
.buttonBorder {
  border: solid;
  border-color: #f14668;
  border-width: 1px;
}
.getsBigger {
  width: 7vmin;
  height: 7vmin;
  min-height: 40px;
  max-height: 60px;
  min-width: 40px;
  max-width: 60px;
}
@keyframes lightup {
  from {
    filter: brightness(0.6);
    -webkit-filter: brightness(0.6);
    transform: scale(0.9);
  }
  to {
    filter: brightness(1);
    -webkit-filter: brightness(1);
    transform: scale(1);
  }
}

.animations {
  animation-name: lightup;
  animation-duration: 195ms;
  animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.lowBrightness {
  transform: scale(0.9);
  filter: brightness(0.6);
}
</style>
