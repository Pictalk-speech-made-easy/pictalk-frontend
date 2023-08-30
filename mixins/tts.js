import frenchFries from "@/assets/frenchFries.json";
import { convertToSimpleLanguage } from "@/utils/utils";
import axios from "axios";
import installOtherBrowserModal from "@/components/pictos/installOtherBrowserModal";
import installVoiceModal from '@/components/pictos/installVoiceModal'
export default {
  component: [installOtherBrowserModal, installVoiceModal],
  created: function () {
    const allVoicesObtained = new Promise(function (resolve, reject) {
      try {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 1) {
          resolve(voices);
        } else {
          if (!window.safari && navigator.userAgent.indexOf("Firefox") == -1) {
            window.speechSynthesis.addEventListener(
              "voiceschanged",
              function () {
                try {
                  voices = window.speechSynthesis.getVoices();
                } catch (err) {
                  reject(err);
                }
                if (!voices || voices.length <= 1) {
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
              if (voices && voices?.length > 1) {
                clearInterval(getVoicesInterval);
                resolve(voices);
              }
              if (intervalCounter >= 10) {
                clearInterval(getVoicesInterval);
                reject("No voices found");
              }
            }, 200);
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
          console.log("No voice URI present in the user language and device info")
          this.voiceURI = this.voices.filter((voice) =>
            voice.lang.includes(this.getUserLang)
          )[0]?.voiceURI;
          console.log("Voice selected by lang: ", this.voiceURI)
        }
      } else {
        console.log("No user language")
        console.log("Selecting voice by locale: ", this.localeIso())

        this.searchForPreferredVoices();

        if (!this.voiceURI) {
          this.voiceURI = this.voices.filter(
            (voice) => voice.lang == this.localeIso()
          )[0]?.voiceURI;
        }
        console.log("Voice selected by locale: ", this.voiceURI)
      }
    });
    allVoicesObtained.catch((err) => {

    })
  },
  methods: {
    searchForPreferredVoices() {
      if (navigator.userAgent.includes("Mac OS X")) {
        this.searchForPreferredVoicesApple();
        return;
      }
      if (navigator.userAgent.includes("SM-") && this.detectBrowser() != "Chrome") {
        this.searchForPreferredVoicesAndroidSamsung();
        return;
      }
      if (this.detectBrowser() == "Chrome") {
        this.searchForPreferredVoicesAndroidChrome();
        return;
      }
      if (navigator.userAgent.includes("Android")) {
        this.searchForPreferredVoicesAndroidChrome();
        return;
      }
    },
    searchForPreferredVoicesAndroidChrome() {
      if (this.localeIso() == "fr-FR") {
        this.voiceURI = this.voices.filter(
          (voice) => (voice.lang.includes("fr_FR"))
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "en-GB") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("en_GB")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "es-ES") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("es_ES")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "de-DE") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("de_DE")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "it-IT") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("it_IT")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "pt-PT") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("pt_PT")
        )[0]?.voiceURI;
      }
    },
    searchForPreferredVoicesAndroidSamsung() {
      if (this.localeIso() == "fr-FR") {
        this.voiceURI = this.voices.filter(
          (voice) => ((voice.lang.includes("fra"))) && voice.voiceURI.includes("fra_FRA_default")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "en-GB") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("eng") && voice.voiceURI.includes("eng_GBR_default")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "es-ES") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("spa") && voice.voiceURI.includes("spa_ESP_default")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "de-DE") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("deu") && voice.voiceURI.includes("deu_DEU_default")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "it-IT") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("ita") && voice.voiceURI.includes("ita_ITA_default")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "pt-PT") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang.includes("por") && voice.voiceURI.includes("por_BRA_default")
        )[0]?.voiceURI;
      }
    },
    searchForPreferredVoicesApple() {
      if (this.localeIso() == "fr-FR") {
        this.voiceURI = this.voices.filter(
          (voice) => ((voice.lang == "fr-FR") || (voice.lang == "fr-CA")) && voice.voiceURI.includes("Amélie")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "en-GB") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang == this.localeIso() && voice.voiceURI.includes("Daniel")
        )[0]?.voiceURI;
      }
      if (this.localeIso() == "es-ES") {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang == this.localeIso() && voice.voiceURI.includes("Jorge")
        )[0]?.voiceURI;
      }
    },
    detectBrowser() {
      // Get the user-agent string
      let userAgentString =
        navigator.userAgent;

      // Detect Chrome
      let chromeAgent =
        userAgentString.indexOf("Chrome") > -1;
      // Detect Internet Explorer
      let IExplorerAgent =
        userAgentString.indexOf("MSIE") > -1;
      // Detect Firefox
      let firefoxAgent =
        userAgentString.indexOf("Firefox") > -1;

      // Detect Safari
      let safariAgent =
        userAgentString.indexOf("Safari") > -1;

      // Discard Safari since it also matches Chrome
      if ((chromeAgent) && (safariAgent))
        safariAgent = false;

      // Detect Opera
      let operaAgent =
        userAgentString.indexOf("OP") > -1;

      // Discard Chrome since it also matches Opera     
      if ((chromeAgent) && (operaAgent))
        chromeAgent = false;

      if (chromeAgent) { return "Chrome" }
      if (IExplorerAgent) { return "IE" }
      if (firefoxAgent) { return "Firefox" }
      if (safariAgent) { return "Safari" }
      if (operaAgent) { return "Opera" }
    },
    async openInstallVoicesModal() {
      this.$buefy.modal.open({
        parent: this,
        component: installVoiceModal,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
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
      if ("speechSynthesis" in window && window.speechSynthesis.getVoices().length > 1) {
        console.log("Pronounce function: (speech, lang, voiceURI, pitch, rate, synthesis)", speech, lang, voiceURI, pitch, rate, synthesis)
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
        console.log("Voices available in the device: ", this.voices)
        let voice = this.voices.filter(
          (voice) => voice.voiceURI == voiceURI
        );
        console.log("Voice selected by URI: ", voice)
        if (voice.length == 0) {
          console.log("Voice selected by lang: ", voice)
          voice = this.voices.filter((voice) =>
            voice.lang.includes(lang)
          );
        }
        if (voice.length !== 0) {
          console.log("Voice selected by lang: ", voice)
          msg.voice = voice[0];
        }
        if (pitch) {
          msg.pitch = pitch;
        } else {
          msg.pitch = 1;
          console.log("Using default pitch: ", msg.pitch)
        }
        if (rate) {
          msg.rate = rate;
        } else {
          msg.rate = 0.8;
          console.log("Using default rate: ", msg.rate)
        }
        window.speechSynthesis.speak(msg);
      } else {
        if (this.detectBrowser() != "Chrome" && this.detectBrowser() != "Firefox" && this.detectBrowser() != "Safari") {
          this.openInstallOtherBrowserModal();
        } else {
          this.openInstallVoicesModal();
        }
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
    getUserLang: function (newValue, oldValue) {
      this.searchForPreferredVoices();
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
