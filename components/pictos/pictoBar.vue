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
				@click="removeSpeech()"
			/>
		</div>
		<div class="column" style="padding: 0%">
			<div class="scrolling">
				<miniPicto
					class
					v-for="picto in pictos"
					:key="picto.id + Math.random()"
					:image="picto.image"
				/>
			</div>
		</div>
		<div class="column is-narrow nopadding">
			<b-button
				v-if="$store.getters.getTemporaryLanguage"
				type="is-success"
				icon-right="message"
				@click="pictalk(pictos)"
				v-longpress="openTravelerMode"
				>{{ getEmoji($store.getters.getTemporaryLanguage) }}</b-button
			>
			<b-button
				v-else
				type="is-success"
				icon-right="message"
				@click="pictalk(pictos)"
				v-longpress="openTravelerMode"
			></b-button>
		</div>
		<div class="column is-narrow nopadding">
			<b-button
				type="is-info"
				icon-right="content-copy"
				@click="copyPictosToClipboardBase(pictos)"
			/>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import miniPicto from "@/components/pictos/miniPicto";
import mergeImages from "merge-images-horizontally-with-text";
import tradLanguageListVue from "@/components/pictos/tradLanguageList.vue";
import { countryCodeEmoji } from "country-code-emoji";
export default {
	created() {
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
			this.voiceURI =
				this.$store.getters.getUser.language[
					Object.keys(this.$store.getters.getUser.language)[0]
				][this.getDeviceInfo()]?.voiceURI;
			// Si vide alors remplir avec la premiere valeur equiv a lang
			if (!this.voiceURI) {
				this.voiceURI = this.voices.filter(
					(voice) =>
						voice.lang ==
						Object.keys(this.$store.getters.getUser.language)[0]
				)[0]?.voiceURI;
			}
		});
	},
	methods: {
		getEmoji(language) {
			if (language?.match(/[a-z]{2}_[A-Z]{2}/g)) {
				language = language.replace("_", "-");
			}
			if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
				return countryCodeEmoji(language.split("-")[1]);
			} else {
				return language;
			}
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
					acc + " " + curr_val.speech[this.getUserLang],
				""
			);
		},
		getDeviceInfo() {
			return (
				this.getOSInfo() +
				window.screen.height +
				window.screen.width +
				window.devicePixelRatio
			);
		},
		getOSInfo() {
			if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
				return "Windows 10";
			if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1)
				return "Windows 8.1";
			if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
				return "Windows 8";
			if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
				return "Windows 7";
			if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
				return "Windows Vista";
			if (window.navigator.userAgent.indexOf("Mac") != -1)
				return "Mac/iOS";
			if (window.navigator.userAgent.indexOf("X11") != -1) return "UNIX";
			if (window.navigator.userAgent.indexOf("Linux") != -1)
				return "Linux";
		},
		convertToSimpleLanguage(language) {
			return language.replace(/[^a-z]/g, "");
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
				await this.$copyText(b64);
				const notif = this.$buefy.toast.open({
					duration: 5000,
					message: this.$t("CopyError"),
					type: "is-danger",
				});
			}
		},
		async getTranslatedText(pictos) {
			try {
				return (
					await axios.get("/translation/", {
						params: {
							text: this.getText(pictos),
							targetLang: this.convertToSimpleLanguage(
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
		async pictalk(pictos) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				let voice;
				if (this.$store.getters.getTemporaryLanguage) {
					msg.text = await this.getTranslatedText(pictos);
					voice = this.voices.filter((voice) =>
						voice.lang.includes(
							this.$store.getters.getTemporaryLanguage
						)
					);
				} else {
					msg.text = this.getText(pictos);
					voice = this.voices.filter(
						(voice) => voice.voiceURI == this.voiceURI
					);
					if (voice.length == 0) {
						voice = this.voices.filter((voice) =>
							voice.lang.includes(this.getUserLang)
						);
					}
				}
				if (voice?.length !== 0) {
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
		removeSpeech() {
			const pictoSpeech = this.$store.getters.getSpeech;
			let adminMode = "";
			if (this.$route.query.isAdmin) {
				adminMode = "?isAdmin=true";
			}
			if (pictoSpeech.length <= 1) {
				if (this.publicMode) {
					this.$router.push("/public/");
				} else {
					if (this.$store.getters.getRootId) {
						this.$router.push(
							"/pictalk/" +
								this.$store.getters.getRootId +
								adminMode
						);
					} else {
						this.$router.push("/pictalk" + adminMode);
					}
				}
			} else {
				if (pictoSpeech[pictoSpeech.length - 2].collection) {
					this.$router.push(
						(this.publicMode ? "/public/" : "/pictalk/") +
							pictoSpeech[pictoSpeech.length - 2].id +
							adminMode
					);
				}
			}
			this.$store.commit("removeSpeech");
		},
		eraseSpeech() {
			this.$store.commit("eraseSpeech");
			const adminMode = this.$route.query.isAdmin ? "?isAdmin=true" : "";
			if (this.publicMode) {
				this.$router.push("/public/");
				return;
			}
			if (this.$store.getters.getRootId) {
				this.$router.push(
					"/pictalk/" + this.$store.getters.getRootId + adminMode
				);
			} else {
				this.$router.push("/pictalk" + adminMode);
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
		getUserLang() {
			const user = this.$store.getters.getUser;
			if (user?.language) {
				return Object.keys(user.language)[0].replace(/[^a-z]/g, "");
			}
			if (user?.displayLanguage) {
				return user.displayLanguage;
			}
			return window.navigator.language.replace(/[^a-z]/g, "");
		},
		cssVars() {
			return {
				"--bg-color": this.collectionColor,
			};
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
	data() {
		return {
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
.notification {
	background-color: var(--bg-color);
	position: relative;
	align-items: center;
	padding: 0.25rem;
}
.nopadding {
	padding: 1%;
}
.scrolling {
	display: flex;
	flex-direction: row;
	scroll-snap-type: y proximity;
	overflow-x: auto;
}
</style>
