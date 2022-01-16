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
				type="is-success"
				icon-right="message"
				@click="pictalk(pictos)"
			/>
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
import miniPicto from "@/components/pictos/miniPicto";
import mergeImages from "merge-images-horizontally-with-text";
export default {
	created() {
		const allVoicesObtained = new Promise(function (resolve, reject) {
			let voices = window.speechSynthesis.getVoices();
			if (voices.length !== 0) {
				resolve(voices);
			} else {
				window.speechSynthesis.addEventListener(
					"voiceschanged",
					function () {
						voices = window.speechSynthesis.getVoices();
						resolve(voices);
					}
				);
			}
		});
		allVoicesObtained.then((voices) => (this.languages = voices));
	},
	methods: {
		getText(pictos) {
			return pictos.reduce(
				(acc, curr_val) =>
					acc + " " + curr_val.speech[this.getUserLang(true)],
				""
			);
		},
		async copyPictosToClipboardLegacy(pictos) {
			const message = this.getText(pictos);
			try {
				await this.$copyText(message);
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("CopySucces"),
					position: "is-top-right",
					type: "is-success",
					hasIcon: true,
				});
			} catch (e) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("CopyError"),
					position: "is-top-right",
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
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("CopySucces"),
					position: "is-top-right",
					type: "is-success",
					hasIcon: true,
				});
			} catch (e) {
				console.log(e);
				await this.$copyText(b64);
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("CopyError"),
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
				});
			}
		},
		async pictalk(pictos) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				const message = this.getText(pictos);
				msg.text = message;
				let voice = this.languages.filter(
					(voice) => voice.lang == this.getUserLang(true)
				);
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
		cssVars() {
			return {
				"--bg-color": this.collectionColor,
			};
		},
		getUserLang(detailled = false) {
			const user = this.$store.getters.getUser;
			if (user.language && !detailled) {
				return user.language.replace(/[^a-z]/g, "");
			} else if (user.language && detailled) {
				return user.language;
			} else {
				return window.navigator.language;
			}
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
			default: () => false
		}
	},
	data() {
		return {
			adminMode: false,
			languages: [],
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
