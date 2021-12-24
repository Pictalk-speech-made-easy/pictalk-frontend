<template>
	<div :class="[!picto.folder ? 'containing' : 'containing has-background']">
		<div>
			<img
				class="image"
				:src="picto.path"
				@click="
					addToSpeech(
						picto.path,
						picto.speech,
						picto.fatherId,
						picto.folder,
						picto.meaning
					)
				"
				width="60%"
				crossorigin="anonymous"
			/>
		</div>
		<div class="notification meaning">
			{{ picto.meaning }}
		</div>
		<div v-if="adminMode" class="adminMenu">
			<div>
				<b-button
					type="is-danger"
					icon-right="delete"
					@click="deletePicto(picto)"
				/>
				<b-button type="is-info" @click="editPicto(picto)">{{
					$t("Edit")
				}}</b-button>
				<div v-if="picto.starred">
					<b-button
						type="is-warning"
						icon-right="star"
						@click="alternateStar(picto)"
					/>
				</div>
				<div v-else>
					<b-button
						type="is-light"
						icon-right="star"
						@click="alternateStar(picto)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import deleteItem from "@/components/pictos/deleteItem";
import PictoSteps from "@/components/pictos/pictoSteps";
export default {
	name: "picto",
	components: {
		PictoSteps,
	},
	props: {
		adminMode: {
			type: Boolean,
			required: true,
		},
		picto: {
			type: Object,
			required: true,
		},
	},
	methods: {
		addToSpeech(path, speech, fatherId, folder, meaning) {
			this.$store.commit("addSpeech", {
				path: path,
				speech: speech,
				fatherId: fatherId,
				meaning: meaning,
			});
			if (folder == 1) {
				let adminMode = "";
				if (this.$route.query.isAdmin) {
					adminMode = "?isAdmin=true";
				}
				this.$router.push(this.pictoLink + adminMode);
			}
		},
		deletePicto(picto) {
			this.$buefy.modal.open({
				parent: this,
				props: {
					object: { ...picto },
					collectionId: parseInt(this.$route.params.collectionId, 10),
				},
				component: deleteItem,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
			});
		},
		editPicto(picto) {
			this.$buefy.modal.open({
				parent: this,
				props: { picto: { ...picto } },
				component: PictoSteps,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
			});
		},
		async alternateStar(picto) {
			const star = picto.starred ? false : true;
			try {
				this.$store.commit("editPicto", {
					editedPicto: { ...picto, starred: star },
					collectionId: parseInt(this.$route.params.collectionId, 10),
				});
			} catch (error) {
				console.log(error);
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("SomeThingBadHappened"),
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
					icon: "account",
				});
			}
		},
	},
	computed: {
		pictoLink() {
			return String(
				"/pictalk/" +
					this.$route.params.collectionId +
					"/" +
					this.picto.id
			);
		},
	},
};
</script>
<style scoped>
.has-background {
	border-radius: 5px;
	-webkit-box-shadow: 3px 3px 5px 6px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
	-moz-box-shadow: 3px 3px 5px 6px #ccc; /* Firefox 3.5 - 3.6 */
	box-shadow: 3px 3px 5px 6px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
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
.meaning {
	margin: 0 auto;
	margin-top: auto;
	font-size: 1rem;
}
.notification {
	padding: 0.6rem;
	padding-top: 0.1rem;
	padding-bottom: 0.1rem;
}
</style>
