<template>
	<div>
		<div v-if="picto.folder">
			<nuxt-link :to="pictoLink">
				<img
					:src="picto.path"
					@click="addToSpeech(picto.path,picto.speech)"
					width="50%"
					class="is-centered"
				/>
			</nuxt-link>
		</div>
		<div v-else>
			<img
				:src="picto.path"
				@click="addToSpeech(picto.path,picto.speech)"
				width="50%"
				class="is-centered"
			/>
		</div>
		<div v-if="adminMode">
			<div class="notification is-size-6">{{picto.meaning}}</div>
			<div>
				<b-button type="is-danger" icon-right="delete" @click="deletePicto(picto)" />
				<b-button type="is-info" @click="editPicto(picto)">Edit</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import editPicto from "@/components/pictos/editPicto";
export default {
	name: "picto",
	components: {
		editPicto
	},
	props: {
		adminMode: {
			type: Boolean,
			required: true
		},
		picto: {
			type: Object,
			required: true
		}
	},
	methods: {
		addToSpeech(path, speech) {
			this.$store.commit("addSpeech", {
				path: path,
				speech: speech
			});
		},
		deletePicto() {
			this.$store.commit("deletePicto", picto);
		},
		editPicto(picto) {
			this.$buefy.modal.open({
				parent: this,
				picto: picto,
				component: editPicto,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true
			});
		}
	},
	computed: {
		pictoLink() {
			return String(
				"/pictalk/" +
					this.$route.params.collectionId +
					"/" +
					this.picto.id
			);
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