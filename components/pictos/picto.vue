<template>
	<div>
		<img :src="image" @click="addToSpeech(image,speech)" width="50%" class="centered" />
		<div v-if="adminMode">
			<div class="notification is-size-6">{{speech}}</div>
			<div>
				<b-button type="is-danger" icon-right="delete" />
				<b-button type="is-info">Edit</b-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "picto",
	props: {
		adminMode: {
			type: Boolean,
			required: true
		},
		speech: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		}
	},
	methods: {
		addToSpeech(image, speech) {
			this.$store.dispatch("addSpeech", { image: image, speech: speech });
		}
	}
};
</script>
<style scoped>
.centered {
	margin-left: auto;
	margin-right: auto;
}
</style>