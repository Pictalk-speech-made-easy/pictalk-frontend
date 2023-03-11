import frenchFries from "@/assets/frenchFries.json";
import { convertToSimpleLanguage } from "@/utils/utils";
import axios from "axios";
import installOtherBrowserModal from "@/components/pictos/installOtherBrowserModal";
export default {
  component: [installOtherBrowserModal],
  created: function () {
    const allVoicesObtained = new Promise(function (resolve, reject) {
      try {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length !== 0) {
          resolve(voices);
        } else {
          if (!window.safari) {
            window.speechSynthesis.addEventListener(
              "voiceschanged",
              function () {
                try {
                  voices = window.speechSynthesis.getVoices();
                } catch (err) {
                  reject(err);
                }
                if (!voices) {
                  reject();
                }
                resolve(voices);
              }
            );
          } else {
            let intervalCounter = 0;
            const getVoicesInterval = setInterval(() => {
              try {
                intervalCounter++;
                voices = window.speechSynthesis.getVoices();
              } catch (err) {
                reject(err);
              }
              if (voices && voices?.length > 0) {
                clearInterval(getVoicesInterval);
                resolve(voices);
              }
              if (intervalCounter >= 10) {
                clearInterval(getVoicesInterval);
                reject("No voices found");
              }
            }, 1000);
          }
        }
      } catch (err) {
        reject(err);
      }
    });
    allVoicesObtained.then((voices) => {
      this.voices = voices;
      this.loadingVoices = false;
      if (this.$store.getters.getUser.language) {
        if (this.$store.getters.getUser.language[this.getUserLang]) {
          this.voiceURI =
            this.$store.getters.getUser.language[this.getUserLang][
              this.getDeviceInfo()
            ]?.voiceURI;
          this.pitch =
            this.$store.getters.getUser.language[this.getUserLang][
              this.getDeviceInfo()
            ]?.pitch;
          this.rate =
            this.$store.getters.getUser.language[this.getUserLang][
              this.getDeviceInfo()
            ]?.rate;
        }
        this.voiceURIs = Object.keys(this.$store.getters.getUser.languages).map((lang) => {
          let uri =
            this.$store.getters.getUser.languages[lang][this.getDeviceInfo()]?.voiceURI;
          if (!uri) {
            return this.voices.filter((voice) =>
              voice.lang.includes(this.getUserLang)
            )[0]?.voiceURI;
          } else {
            return uri;
          }
        }
        );
        if (!this.voiceURI) {
          this.voiceURI = this.voices.filter((voice) =>
            voice.lang.includes(this.getUserLang)
          )[0]?.voiceURI;
        }
      } else {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang == this.localeIso()
        )[0]?.voiceURI;
      }
    });
    allVoicesObtained.catch((err) => {
      this.$parent.close();
      this.openInstallOtherBrowserModal();
    })
  },
  methods: {
    async openInstallOtherBrowserModal() {
      this.$buefy.modal.open({
        parent: this,
        component: installOtherBrowserModal,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    async getTranslatedText(speech) {
      try {
        return (
          await axios.post("/translation/", {
            text: speech,
            targetLang: language,
            sourceLang: this.getUserLang,
          })
        )?.data.translation;
      } catch (err) {
        console.log(err);
        const notif = this.$buefy.toast.open({
          message: this.$t("TraductionError"),
          type: "is-danger",
        });
      }
    },
    async pronounce(speech, lang, voiceURI, pitch, rate, synthesis) {
      if ("speechSynthesis" in window) {
        if (synthesis) {
          var msg = synthesis;
        } else {
          var msg = new SpeechSynthesisUtterance();
        }
        if (this.$store.getters.getTemporaryLanguage) {
          msg.text = await this.getTranslatedText(speech);
          voice = this.voices.filter((voice) =>
            voice.lang.includes(this.$store.getters.getTemporaryLanguage)
          );
        } else {
          msg.text = speech;
        }
        let voice = this.voices.filter(
          (voice) => voice.voiceURI == voiceURI
        );
        if (voice.length == 0) {
          voice = this.voices.filter((voice) =>
            voice.lang.includes(lang)
          );
        }
        if (voice.length !== 0) {
          msg.voice = voice[0];
        }
        if (pitch) {
          msg.pitch = pitch;
        }
        if (rate) {
          msg.rate = rate;
        }
        window.speechSynthesis.speak(msg);
      } else {
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("NoVoicesFound"),
          position: "is-top-right",
          type: "is-warning",
          hasIcon: true,
          iconSize: "is-small",
        });
      }
    },
    async playSentenceInLanguage(lang, voiceURI, pitch, rate) {
      let translatedText =
        frenchFries[convertToSimpleLanguage(lang)];

      translatedText ? this.pronounce(translatedText, lang, voiceURI, pitch, rate) : () => { return };
    },
    getLoadedVoicesWithFilter(lang) {
      return this.loadedVoices.filter((voice) =>
        voice.lang.includes(lang)
      );
    },
  },
  computed: {
    loadedVoices() {
      return this.voices.sort((x, y) => {
        let a = x.lang.toUpperCase(),
          b = y.lang.toUpperCase();
        return a == b ? 0 : a > b ? 1 : -1;
      });
    },
    loadedVoicesWithFilter() {
      let list = this.loadedVoices.filter((voice) =>
        !voice.lang.includes(this.localeCode())
      );
      let langlist = this.loadedVoices.filter((voice) =>
        voice.lang.includes(this.localeCode())
      );
      return langlist.concat(list);
    },
  },
  watch: {
    voiceURI: function (v, oldVoice) {
      const oldIndex = this.voiceURIs.findIndex((uri) => uri == oldVoice);
      if (oldIndex != -1) {
        this.voiceURIs.splice(oldIndex, 1);
      }
      this.voiceURIs.push(v);
      if (!this.initialization) {
        this.playSentenceInLanguage(
          this.voices.filter((voice) => voice.voiceURI == v)[0]?.lang,
          v,
        );
      }
    },
    voiceURIs: function (newValue, oldValue) {
      if (newValue.length > oldValue.length && newValue.length > 1) {
        const v = newValue.filter(
          (ai) => oldValue.indexOf(ai) == -1
        )[0];
        if (!this.initialization) {
          this.playSentenceInLanguage(
            this.voices.filter((voice) => voice.voiceURI == v)[0]
              ?.lang,
            v
          );
        }
      }
    },
  },
  data: function () {
    return {
      voices: [],
      voiceURI: "",
      voiceURIs: [],
      loadingVoices: true,
      initialization: true
    }
  }
}
