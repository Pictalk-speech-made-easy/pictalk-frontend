<template>
	<div>
		<div class="containing">
			<div v-if="picto.folder">
				<nuxt-link :to="pictoLink">
					<img
						class="image"
						:src="picto.path"
						@click="addToSpeech(picto.path, picto.speech, picto.fatherId)"
						width="60%"
					/>
				</nuxt-link>
			</div>
			<div v-else>
				<img
					class="image"
					:src="picto.path"
					@click="addToSpeech(picto.path, picto.speech, picto.fatherId)"
					width="60%"
				/>
			</div>
		</div>
		<div v-if="adminMode" class="adminMenu">
			<div class="notification is-size-6">{{ picto.meaning }}</div>
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
		addToSpeech(path, speech, fatherId) {
			this.$store.commit("addSpeech", {
				path: path,
				speech: speech,
				fatherId: fatherId
			});
		},
		async deletePicto(picto) {
			const res = await this.$store.dispatch("removePicto", picto);
		},
		editPicto(picto) {
			this.$buefy.modal.open({
				parent: this,
				props: { picto: { ...picto } },
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
.has-background {
	background-color: rgb(168, 168, 168);
}
.containing {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.image {
	margin: auto;
}
.adminMenu {
	align-self: flex-end;
	margin: 0 auto;
	margin-top: auto;
}
</style>
