<template>
	<div class="notification columns is-mobile" :style="cssVars">
		<div class="column is-narrow">
			<b-button
				type="is-danger"
				icon-right="delete"
				@click="eraseSpeech()"
			/>
		</div>
		<div class="column is-narrow">
			<b-button
				type="is-danger"
				icon-right="backspace"
				@click="removeSpeech()"
			/>
		</div>
		<div class="column" style="padding: 0">
			<div class="content">
				<miniPicto
					class
					v-for="picto in pictos"
					:key="picto.speech"
					:path="picto.path"
					:speech="picto.speech"
				/>
			</div>
		</div>
		<div class="column is-narrow">
			<b-button
				type="is-success"
				icon-right="message"
				@click="pictalk(pictos)"
			/>
		</div>
	</div>
</template>
<script>
import miniPicto from "@/components/pictos/miniPicto";
export default {
	methods: {
		delay(delayInms) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(2);
				}, delayInms);
			});
		},
		async pictalk(pictos_obs) {
			var pictos = JSON.parse(JSON.stringify(pictos_obs));
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				const message = pictos.reduce(
					(acc, curr_val) => acc + " " + curr_val.speech,
					""
				);
				msg.text = message;
				let voices = window.speechSynthesis.getVoices();
				let voice = voices.filter(
					(voice) => voice.lang == this.getUserLang
				);

				let increment = 0;
				while (voice.length == 0 && increment != 10) {
					voices = window.speechSynthesis.getVoices();
					voice = voices.filter(
						(voice) => voice.lang == this.getUserLang
					);
					
					increment++;
					await this.delay(20);
				}
				console.log(voices);
				await this.delay(200);
				voices = window.speechSynthesis.getVoices();
				voice = voices.filter(
					(voice) => voice.lang == this.getUserLang
				);
				console.log(voices);

				if (voice.length !== 0) {
					msg.voice = voice[0];
					console.log(msg.voice);
				}
				window.speechSynthesis.speak(msg);
			} else {
				alert("Sorry, your browser doesn't support text to speech!");
			}
		},
		removeSpeech() {
			const pictoSpeech = this.$store.getters.getSpeech;
			if (pictoSpeech.length >= 1) {
				this.$router.push(
					"/pictalk/" +
						this.$route.params.collectionId +
						"/" +
						pictoSpeech[pictoSpeech.length - 1].fatherId
				);
			}
			this.$store.commit("removeSpeech");
		},
		eraseSpeech() {
			this.$store.commit("eraseSpeech");
			this.$router.push("/pictalk");
		},
	},
	computed: {
		cssVars() {
			return {
				"--bg-color": this.collectionColor,
			};
		},
		getUserLang() {
			const user = this.$store.getters.getUser;
			return user.language;
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
	},
	data() {
		return {
			adminMode: false,
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
	overflow: auto;
	padding: 0.25rem;
}
.nopadding {
	padding: 0.25rem;
}
</style>
