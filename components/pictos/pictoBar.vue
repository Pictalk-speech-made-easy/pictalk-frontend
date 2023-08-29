<template>
  <div class="notification columns is-mobile nopadding" :style="cssVars">
    <div class="column is-narrow nopadding">
      <b-button
        style="background-color: hsl(0, 100%, 100%); color: #ff5757"
        icon-right="delete"
        class="customButton  getsBigger"
          @click="eraseSpeech()"
      />
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        style="background-color: hsl(0, 100%, 100%); color: #ff5757"
        icon-right="backspace"
        class="customButton  getsBigger"
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
      v-if="$store.getters.getTemporaryLanguage"
        style="background-color: hsl(154, 70%, 55%)"
        icon-right="volume-high"
        class="customButton getsBigger"
        @click="pictalk(pictos)"
      >{{ getEmoji($store.getters.getTemporaryLanguage) }}</b-button>
      <b-button
      v-else
        style="background-color: hsl(154, 70%, 55%)"
        icon-right="volume-high"
        class="customButton getsBigger"
        @click="pictalk(pictos)"
      />
    </div>
    <div class="column is-narrow nopadding">
      <b-button
        style="background-color: hsl(210, 100%, 65%)"
        icon-right="content-copy"
        class="customButton getsBigger"
        @click="copyPictosToClipboardBase(pictosWithoutSilent)"
      />
    </div>
    <div v-if="vocalize" class="onTop">
      <b-button
        icon-left="close"
        @click="vocalize = false"
        style="margin-left: 2vmax; margin-top: 2vmax; background-color: hsl(0, 100%, 65%); color: white"
        class="customButton"
      />
      
      <div class="columns is-multiline is-mobile topColumns">
        <img
          v-for="(picto, index) in pictosWithoutSilent"
          :key="index"
          :src="picto.image"
          :class="(animation? (wordIndex >= index? pronounceShowSize+' animations': pronounceShowSize+' lowBrightness') : pronounceShowSize)"></img>
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
      let speech = "";
      for (let index = 0; index < pictos.length - 1; index++) {
        speech =
          speech +
          (pictos[index].count > 1 ? pictos[index].count : "") +
          pictos[index].speech[this.getUserLang] +
          " ";
      }
      speech =
        speech +
        (pictos[pictos.length - 1].count > 1
          ? pictos[pictos.length - 1].count
          : "") +
        pictos[pictos.length - 1].speech[this.getUserLang];
      return speech;
    },
    getChars(pictos) {
      let chars = [];
      let speechLength = 0;
      for (let index = 0; index < pictos.length; index++) {
        if (pictos[index].speech[this.getUserLang].length > 0) {
          speechLength =
            pictos[index].speech[this.getUserLang].length +
            1 +
            speechLength +
            (pictos[index].count > 1 ? 1 : 0);
          chars.push(speechLength);
        }
      }
      return chars;
    },
    testBoundaryEventSupport() {
      if (this.voiceURI != "") {
        let synthesis = new SpeechSynthesisUtterance();
        synthesis.volume = 0;
        synthesis.addEventListener("boundary", (event) => {
          this.animation = true;
        });
        this.pronounce("a", this.getUserLang, this.voiceURI, 1, 1, synthesis);
      }
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
    triggerRemoveSpeechDrag() {
      if (
        this.$route.query.fatherCollectionId != this.$store.getters.getRootId
      ) {
        // Remove until previous pictalk collection
        const pictalkSpeech = this.$store.getters.getSpeech.filter(
          (picto) => !picto.sidebar && picto.collection
        );
        while (
          this.$store.getters.getSpeech[
            this.$store.getters.getSpeech.length - 1
          ]?.id != pictalkSpeech[pictalkSpeech.length - 1]?.id
        ) {
          this.removeSpeech(true);
        }
        this.removeSpeech(true);
      }
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
              },
            });
          }
        } else {
          if (pictalkSpeech.length <= 1) {
            if (this.publicMode) {
              this.$router.push("/public/pictalk?fatherCollectionId=346");
            } else {
              if (this.$store.getters.getRootId) {
                this.$router.push({
                  query: { ...this.$route.query, fatherCollectionId: this.$store.getters.getRootId },
                });
              } else {
                this.$router.push({
                  query: { ...this.$route.query },
                });
              }
            }
          } else {
            this.$router.push({
              path:
                (this.publicMode ? "/public/pictalk" : "/pictalk/"),
              query: { ...this.$route.query, fatherCollectionId: pictalkSpeech[pictalkSpeech.length - 2]?.id },
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
        this.$router.push("/public/pictalk?fatherCollectionId=346");
        this.$store.commit("eraseSpeech");
      } else {
        this.$store.commit("eraseSpeech");
        if (this.$store.getters.getRootId) {
          this.$router.push({
            query: {
              isAdmin: this.$route.query.isAdmin,
              fatherCollectionId: this.$store.getters.getRootId,
            },
          });
        } else {
          this.$router.push({
            query: {
              isAdmin: this.$route.query.isAdmin,
              fatherCollectionId: undefined
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
    pronounceShowSize() {
      if (!this.$store.getters.getUser.settings?.pronounceShowSize && this.$store.getters.getUser.settings?.pronounceShowSize != 0) {
        return "topImage column is-3-mobile is-2-tablet is-2-desktop is-2-widescreen is-2-fullhd";
      }
      if (this.$store.getters.getUser.settings?.pronounceShowSize == 0) {
        return "topImage column is-3-mobile is-2-tablet is-2-desktop is-2-widescreen is-2-fullhd";
      } else if (this.$store.getters.getUser.settings?.pronounceShowSize == 1) {
        return "topImage column is-4-mobile is-3-tablet is-3-desktop is-3-widescreen is-3-fullhd";
      } else if (this.$store.getters.getUser.settings?.pronounceShowSize == 2) {
        return "topImage column is-6-mobile is-4-tablet is-4-desktop is-4-widescreen is-4-fullhd";
      }
    },
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
      }, this.$store.getters.getUser.settings?.pronounceShowDelay * 1000 || 500);
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
  created() {
    this.$nuxt.$on("removeSpeechDrag", this.triggerRemoveSpeechDrag);
  },
  beforeDestroy() {
    this.$nuxt.$off("removeSpeechDrag");
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
    pictos: {
      deep: true,
      handler (value) {
        setTimeout(() => {
          let element = document.getElementById("bar");
          element.scrollLeft = element.scrollWidth;
        }, 125);
        if (this.$store.getters.getUser.settings?.pronounceClick && value.length > this.pictoLength) {
          this.pronounce(
            value[value.length -1].speech[this.getUserLang],
            this.getUserLang,
            this.voiceURI,
            this.pitch,
            this.rate
          );
        }
        this.pictoLength = value.length
      }
    },
    voiceURI: function () {
      this.animation = false;
      this.testBoundaryEventSupport();
    },
  },
  data() {
    return {
      chars: [],
      wordIndex: 0,
      animation: false,
      synthesis: null,
      vocalize: false,
      adminMode: false,
      voices: [],
      voiceURI: "",
      pictoLength: 0,
    };
  },
};
</script>
<style scoped>
.customButton {
  font-size: clamp(0.8em, 4vw, 1.15em);
  font-weight: 600;
  color: #171717;
  border: 2px solid #666;
  transition: all 0.05s;
}
.customButton:hover {
  box-shadow: 0px 0px 12px #00000090;
}
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
  aspect-ratio: 1/1;
  object-fit: contain;
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
  overflow-y: hidden;
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
