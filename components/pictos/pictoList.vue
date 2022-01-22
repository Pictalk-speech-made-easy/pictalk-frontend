<template>
	<div>
		<div class="columns is-multiline is-mobile">
			<picto
				class="
					column
					is-one-third-mobile
					is-one-quarter-tablet
					is-one-quarter-desktop
					is-one-quarter-widescreen
					is-one-fifth-fullhd
				"
				v-for="picto in getFilteredPictoList"
				:key="picto.id + Math.random()"
				:picto="picto"
				:adminMode="adminMode"
				:publicMode="publicMode"
			/>
			<div
				class="
					column
					is-one-third-mobile
					is-one-quarter-tablet
					is-one-quarter-desktop
					is-one-quarter-widescreen
					is-one-fifth-fullhd
				"
				v-if="adminMode"
			>
				<div v-if="!publicMode" class="contenant">
					<div class="columns fab-zone">
						<div class="column">
							<b-button
								rounded
								size="is-medium"
								type="is-success"
								@click="addPicto()"
								icon-right="plus"
							/>
						</div>
						<div v-if="checkCopyCollectionId" class="column">
							<b-button
								rounded
								@click="copyCollection()"
								size="is-medium"
								type="is-info"
								icon-right="content-paste"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import picto from "@/components/pictos/picto";
import PictoSteps from "@/components/pictos/pictoSteps";
export default {
	components: {
		picto,
		PictoSteps,
	},
	props: {
		pictos: {
			type: Array,
			required: true,
		},
		adminMode: {
			type: Boolean,
			required: true,
		},
		publicMode: {
			type: Boolean,
			required: false,
			default:() => false
		},
		search: {
			type: String,
			required: false,
			default:() => ""
		}
	},
	computed: {
		checkCopyCollectionId() {
			return this.$store.getters.getCopyCollectionId || this.$store.getters.getShortcutCollectionId;
		},
		getFilteredPictoList() {
			return this.pictos.filter((picto) => picto.meaning[this.getUserLang()]?.includes(this.search));
		}
	},
	methods: {
		addPicto() {
			this.$buefy.modal.open({
				parent: this,
				component: PictoSteps,
				hasModalCard: true,
				props: { create: true },
				customClass: "custom-class custom-class-2",
				trapFocus: true,
				canCancel: ["escape", "x"],
			});
		},
		getUserLang(detailled = false) {
			const lang = Object.keys(this.$store.getters.getUser?.language ?? {})[0];
			if (lang && !detailled) {
				return lang.replace(/[^a-z]/g, "");
			} else if (lang && detailled) {
				return lang;
			} else {
				return window.navigator.language;
			}
		},
		async copyCollection() {
			if (this.$store.getters.getCopyCollectionId) {
				await this.$store.dispatch("copyCollectionById", { collectionId: this.$store.getters.getCopyCollectionId, fatherCollectionId: this.$route.params.fatherCollectionId, collection: this.getCollectionFromId(parseInt(this.$route.params.fatherCollectionId,10))});
				this.$store.commit('resetCopyCollectionId');	
			} else if(this.$store.getters.getShortcutCollectionId) {
				let collection = JSON.parse(JSON.stringify(this.getCollectionFromId(parseInt(this.$route.params.fatherCollectionId,10))))
				collection.collections.push({id: this.$store.getters.getShortcutCollectionId});
				await this.$store.dispatch("editCollection", {id: collection.id, collections: collection.collections});
				this.$store.commit('resetShortcutCollectionId');
			}
		},
		getCollectionFromId(id) {
			const index = this.$store.getters.getCollections.findIndex((collection) => collection.id === id);
			return this.$store.getters.getCollections[index];
		},

	},
};
</script>
<style scoped>
.contenant {
	display: flex;
	justify-content: center;
}

.fab-zone {
	bottom: 15%;
	right: 5%;
	position: fixed;
}
</style>
