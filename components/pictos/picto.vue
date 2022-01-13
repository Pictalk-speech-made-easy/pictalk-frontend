<template>
	<div
		:class="[
			!picto.collection ? 'containing' : 'containing has-background',
		]"
	>
		<div>
			<img
				class="image"
				:src="picto.image"
				@click="addToSpeech()"
				width="60%"
				crossorigin="anonymous"
			/>
		</div>
		<div class="notification meaning">
			{{ picto.meaning[$store.getters.getUser.language] }}
		</div>
		<div v-if="adminMode" class="adminMenu adminoption columns">
			<b-dropdown aria-role="menu" class="column noMargin is-mobile">
				<template #trigger="{ active }">
					<b-button
						type="is-primary"
						:icon-right="active ? 'menu-up' : 'menu-down'"
					/>
				</template>

				<b-dropdown-item aria-role="listitem"
					><b-button
						type="is-info"
						icon-right="pencil"
						:expanded="true"
						@click="editPicto()"
					/>
				</b-dropdown-item>
				<b-dropdown-item aria-role="listitem"
					><b-button
						:expanded="true"
						type="is-danger"
						icon-right="delete"
						@click="deletePicto()"
				/></b-dropdown-item>
				<b-dropdown-item v-if="picto.collection" aria-role="listitem">
					<b-button
						:expanded="true"
						type="is-info"
						icon-right="content-copy"
						@click="setCopyCollectionId(picto.id)"
					/>
					</b-dropdown-item>
					<b-dropdown-item v-if="picto.collection" aria-role="listitem">
					<b-button
						:expanded="true"
						type="is-info"
						icon-right="share"
						@click="setShortcutCollectionId(picto.id)"
					/>
					</b-dropdown-item>
					<b-dropdown-item v-if="picto.collection" aria-role="listitem">
					<b-button
						:expanded="true"
						type="is-info"
						icon-right="share-variant"
						@click="shareCollection(picto.id)"
					/>
					</b-dropdown-item>
				
			</b-dropdown>

			<div class="column noMargin is-mobile" v-if="picto.starred">
				<b-button
					type="is-success"
					icon-right="star"
					@click="alternateStar()"
				/>
			</div>
			<div class="column noMargin is-mobile" v-else>
				<b-button
					type="is-light"
					icon-right="star"
					@click="alternateStar()"
				/>
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
		setCopyCollectionId(collectionId) {
			this.$store.commit("setCopyCollectionId", collectionId);
			this.$store.commit("resetShortcutCollectionId");
		},
		setShortcutCollectionId(collectionId) {
			this.$store.commit("setShortcutCollectionId", collectionId);
			this.$store.commit("resetCopyCollectionId");
		},
		shareCollection(collectionId) {

		},
		addToSpeech() {
			this.$store.commit("addSpeech", this.picto);
			if (this.picto.collection == true) {
				let adminMode = "";
				if (this.$route.query.isAdmin) {
					adminMode = "?isAdmin=true";
				}
				this.$router.push(this.pictoLink + adminMode);
			}
		},
		deletePicto() {
			this.$buefy.modal.open({
				parent: this,
				props: {
					object: { ...this.picto },
				},
				component: deleteItem,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
			});
		},
		editPicto() {
			this.$buefy.modal.open({
				parent: this,
				props: {
					picto: JSON.parse(JSON.stringify(this.picto)),
					create: false,
					isPicto: !this.picto.collection,
				},
				component: PictoSteps,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
				canCancel: ["escape", "x"],
			});
		},
		async alternateStar() {
			try {
				this.$store.commit(this.picto.collection ? "editCollection" : "editPicto", {
					...this.picto,
					starred: !this.picto.starred,
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
			return String("/pictalk/" + this.picto.id);
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

.adminoption {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.image {
	margin: auto;
}
.adminMenu {
	align-self: center;
	margin-top: auto;
	margin-left: 0%;
	margin-right: 0%;
}
.noMargin {
	padding: 0%;
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
