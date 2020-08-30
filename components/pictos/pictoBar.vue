<template>
	<div class="notification columns is-multiline is-centered is-mobile">
		<div class="atTheLeft column">
			<b-button type="is-danger" icon-right="backspace" @click="removeSpeech()" />
		</div>
		<miniPicto
			class="column is-centered"
			v-for="picto in pictos"
			:key="picto.speech"
			:image="picto.image"
			:speech="picto.speech"
		/>
		<div class="atTheRight column">
			<b-button type="is-success" icon-right="message" @click="pictalk(pictos)" />
		</div>
	</div>
</template>
<script>
import miniPicto from "@/components/pictos/miniPicto";
export default {
	methods: {
		pictalk(pictos_obs) {
			var pictos = JSON.parse(JSON.stringify(pictos_obs));
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				const message = pictos.reduce(
					(acc, curr_val) => acc + " " + curr_val.speech,
					""
				);
				msg.text = message;
				const voices = window.speechSynthesis.getVoices();
				const voice = voices.filter(voice => voice.lang == "fr-FR");
				//msg.voice = voice;
				window.speechSynthesis.speak(msg);
			} else {
				alert("Sorry, your browser doesn't support text to speech!");
			}
		},
		removeSpeech() {
			this.$store.commit("removeSpeech");
		}
	},
	computed: {},
	components: {
		miniPicto: miniPicto
	},
	props: {
		pictos: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			adminMode: false
		};
	}
};
</script>
<style scoped>
.notification {
	position: fixed;
	bottom: 5%;
}
.atTheRight {
	margin-right: 5%;
}
.atTheLeft {
	margin-left: 5%;
}
</style>