import frenchFries from "@/assets/frenchFries.json";
import { convertToSimpleLanguage } from "@/utils/utils";
import axios from "axios";
export default {
	created: function () {
		const allVoicesObtained = new Promise(function (resolve, reject) {
			try {
				let voices = window.speechSynthesis.getVoices();
				if (voices.length !== 0) {
					resolve(voices);
				} else {
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
				}
			} catch (err) {
				reject(err);
			}
		});
		allVoicesObtained.then((voices) => {
			this.voices = voices;
			this.loadingVoices = false;
			if (this.$store.getters.getUser.language) {
				this.voiceURI =
					this.$store.getters.getUser.language[this.getUserLang][
						this.getDeviceInfo()
					]?.voiceURI;
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
	},
	methods: {
		async getTranslatedText(speech) {
			try {
				return (
					await axios.get("/translation/", {
						params: {
							text: speech,
							targetLang: convertToSimpleLanguage(
								this.$store.getters.getTemporaryLanguage
							),
							sourceLang: this.getUserLang,
						},
					})
				)?.data?.translation;
			} catch (err) {
				console.log(err);
				const notif = this.$buefy.toast.open({
					duration: 5000,
					message: this.$t("TraductionError"),
					type: "is-danger",
				});
			}
		},
		async pronounce(speech, lang, voiceURI) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
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
				window.speechSynthesis.speak(msg);
			} else {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("NoVoicesFound"),
					position: "is-top-right",
					type: "is-warning",
					hasIcon: true,
				});
			}
		},
		async playSentenceInLanguage(lang, voiceURI) {
			let translatedText =
				frenchFries[convertToSimpleLanguage(lang)];

			translatedText ? this.pronounce(translatedText, lang, voiceURI) : () => { return };
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
			return this.loadedVoices.filter((voice) =>
				voice.lang.includes(this.localeCode())
			);
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
					v
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