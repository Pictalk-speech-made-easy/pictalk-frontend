<template>
	<div
		:class="[
			!picto.collection
				? 'containing'
				: 'containing has-background notification',
		]"
	>
		<div>
			<img
				class="image"
				:src="picto.image"
				@click="addToSpeech()"
				:width="sidebarMode ? '87%' : '77%'"
				crossorigin="anonymous"
				:style="`border: solid; border-color: ${this.picto.color}`"
			/>
		</div>
		<div v-if="!sidebarMode" class="notification meaning">
			{{ picto.meaning[getUserLang] }}
		</div>
		<div
			v-if="$route.query.isAdmin && !publicMode && !sidebarMode"
			class="adminMenu adminoption columns"
		>
			<b-dropdown aria-role="menu" class="column noMargin is-mobile">
				<template #trigger="{ active }">
					<b-button
						type="is-info"
						:icon-right="active ? 'menu-up' : 'menu-down'"
					/>
				</template>
				<b-dropdown-item aria-role="listitem">
					<b-button
						:disabled="!(isEditor || isToUser) || !isOnline"
						type="is-info"
						icon-left="pencil"
						:label="$t('EditPicto')"
						:expanded="true"
						@click="editPicto()"
					/>
				</b-dropdown-item>
				<b-dropdown-item aria-role="listitem">
					<b-button
						:disabled="!isOnline"
						:expanded="true"
						type="is-danger"
						icon-left="delete"
						:label="$t('DeletePicto')"
						@click="deletePicto()"
					/>
				</b-dropdown-item>
				<b-dropdown-item
					v-if="picto.collection && !(isEditor || isToUser)"
					aria-role="listitem"
				>
					<b-button
						:expanded="true"
						type="is-success"
						icon-left="plus"
						:label="$t('CopyPicto')"
						@click="setCopyCollectionId(picto.id)"
					/>
				</b-dropdown-item>
				<b-dropdown-item
					v-if="picto.collection && (isEditor || isToUser)"
					aria-role="listitem"
				>
					<b-button
						:expanded="true"
						type="is-warning"
						icon-left="content-copy"
						:label="$t('CopyPicto')"
						@click="setCopyCollectionId(picto.id)"
					/>
				</b-dropdown-item>
				<b-dropdown-item
					v-if="picto.collection && (isEditor || isToUser)"
					aria-role="listitem"
				>
					<b-button
						:expanded="true"
						type="is-dark"
						icon-left="image-move"
						:label="$t('LinkPicto')"
						@click="setShortcutCollectionId(picto.id)"
					/>
				</b-dropdown-item>
				<b-dropdown-item
					v-if="picto.collection && isToUser"
					aria-role="listitem"
				>
					<b-button
						:expanded="true"
						type="is-success"
						icon-left="share-variant"
						:label="$t('SharePicto')"
						@click="sharePicto()"
					/>
				</b-dropdown-item>
			</b-dropdown>

			<div class="column noMargin is-mobile" v-if="picto.starred == true">
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
		<div
			v-if="publicMode && $store.getters.getUser"
			class="adminMenu adminoption columns"
		>
			<div class="column noMargin is-mobile">
				<b-button
					type="is-success"
					icon-right="plus"
					@click="setShortcutCollectionIdDirectlyToRoot(picto.id)"
				/>
			</div>
		</div>
	</div>
</template>
<script >
import lang from "@/mixins/lang";
import tts from "@/mixins/tts";
import deviceInfos from "@/mixins/deviceInfos";
import deleteItem from "@/components/pictos/deleteItem";
import PictoSteps from "@/components/pictos/pictoSteps";
import shareItem from "@/components/pictos/shareItem";
export default {
	mixins: [lang, tts, deviceInfos],
	name: "picto",
	components: {
		PictoSteps,
	},
	props: {
		picto: {
			type: Object,
			required: true,
		},
		publicMode: {
			type: Boolean,
			required: false,
			default: () => false,
		},
		sidebarMode: {
			type: Boolean,
			required: false,
			default: () => false,
		},
	},
	methods: {
		async setShortcutCollectionIdDirectlyToRoot(collectionId) {
			let collection = JSON.parse(
				JSON.stringify(
					this.getCollectionFromId(this.$store.getters.getRootId)
				)
			);
			collection.collections.push({ id: collectionId });
			try {
				await this.$store.dispatch("editCollection", {
					id: collection.id,
					collections: collection.collections,
				});
			} catch (err) {
				throw new Error(
					"Could not add shortcut to root collection: " +
						JSON.stringify(collection.id)
				);
			}
		},
		setCopyCollectionId(collectionId) {
			this.$store.commit("setCopyCollectionId", collectionId);
			this.$store.commit("resetShortcutCollectionId");
		},
		setShortcutCollectionId(collectionId) {
			this.$store.commit("setShortcutCollectionId", collectionId);
			this.$store.commit("resetCopyCollectionId");
		},
		addToSpeech() {
			this.$store.commit("addSpeech", {
				...this.picto,
				sidebar: this.sidebarMode,
			});
			if (this.picto.collection == true) {
				if (this.sidebarMode) {
					this.$router.push({
						query: {
							...this.$route.query,
							sidebarPictoId: this.picto.id,
						},
					});
				} else {
					this.$router.push({
						path: this.pictoLink,
						query: { ...this.$route.query },
					});
				}
			}
			if (this.$store.getters.getUser.settings?.pronounceClick) {
				this.pronounce(
					this.picto.speech[this.getUserLang],
					this.getUserLang,
					this.voiceURI
				);
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
				canCancel: ["escape", "x"],
			});
		},
		sharePicto() {
			this.$buefy.modal.open({
				parent: this,
				props: {
					picto: JSON.parse(JSON.stringify(this.picto)),
				},
				component: shareItem,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
				canCancel: ["escape", "x"],
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
				this.$store.dispatch(
					this.picto.collection
						? "alternateCollectionStar"
						: "alternatePictoStar",
					{
						...this.picto,
						starred: !this.picto.starred,
					}
				);
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
		getCollectionFromId(id) {
			const index = this.$store.getters.getCollections.findIndex(
				(collection) => collection.id === id
			);
			return this.$store.getters.getCollections[index];
		},
	},
	computed: {
		pictoLink() {
			return this.publicMode
				? String("/public/" + this.picto.id)
				: String("/pictalk/" + this.picto.id);
		},
		isToUser() {
			return this.$store.getters.getUser.id == this.picto.userId;
		},
		isEditor() {
			return (
				this.picto.editors?.find(
					(editor) => editor == this.$store.getters.getUser.username
				) != undefined
			);
		},
		isViewer() {
			return (
				this.picto.viewers?.find(
					(viewer) => viewer == this.$store.getters.getUser.username
				) != undefined
			);
		},
		isOnline() {
			return window.navigator.onLine;
		},
	},
};
</script>
<style scoped>
.has-background {
	border-radius: 7px;
	-webkit-box-shadow: 4px 4px 2px 2px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
	-moz-box-shadow: 4px 4px 2px 2px #ccc; /* Firefox 3.5 - 3.6 */
	box-shadow: 4px 4px 2px 2px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
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
	font-size: 1rem;
}
.notification {
	padding: 0.6rem;
	padding-top: 0.1rem;
	padding-bottom: 0.1rem;
}
</style>
