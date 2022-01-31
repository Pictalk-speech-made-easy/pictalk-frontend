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
			>
				<div class="contenant">
					<div class="columns fab-zone">
						<div v-if="!publicMode && adminMode" class="column">
							<b-button
								rounded
								size="is-medium"
								type="is-success"
								@click="addPicto()"
								icon-right="plus"
							/>
						</div>
						<div v-if="!publicMode" class="column">
							<b-button
								rounded
								size="is-medium"
								type="is-warning"
								@click="adminModeChoose()"
								:icon-right="iconIsAdmin"
							/>
						</div>
						<div
							v-if="
								checkCopyCollectionId &&
								!publicMode &&
								adminMode
							"
							class="column"
						>
							<b-button
								rounded
								@click="copyCollection()"
								size="is-medium"
								type="is-info"
								icon-right="content-paste"
							/>
						</div>
						<div v-if="publicMode" class="column">
							<b-button
								rounded
								size="is-medium"
								type="is-info"
								@click="openSearchPicto()"
								icon-right="magnify"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="searching" class="search notification is-primary">
			<b-autocomplete
				v-model="search"
				:data="
					$store.getters.getPublicCollections.map(
						(collections) => collections.meaning
					)
				"
				:placeholder="$t('SearchPictoPlaceholder')"
				icon="magnify"
				clearable
			>
			</b-autocomplete>
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
	data() {
		return {
			searching: false,
			search: "",
		};
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
			default: () => false,
		},
	},
	computed: {
		iconIsAdmin() {
			return this.$route.query.isAdmin ? "lock-open-variant" : "lock";
		},
		admin() {
			return this.$route.query.isAdmin ? "?isAdmin=true" : "";
		},
		homeLink() {
			return this.$route.path;
		},
		checkCopyCollectionId() {
			return (
				this.$store.getters.getCopyCollectionId ||
				this.$store.getters.getShortcutCollectionId
			);
		},
		getFilteredPictoList() {
			return this.pictos.filter((picto) =>
				picto.meaning[this.getUserLang()]?.includes(this.search)
			);
		},
	},
	methods: {
		adminModeChoose() {
			if (this.admin) {
				this.$router.push(this.homeLink);
			} else {
				if (this.$store.getters.getUser.settings.securityMode) {
					this.toAdmin();
				} else {
					this.$router.push(this.$route.path + "?isAdmin=true");
				}
			}
		},
		toAdmin() {
			const a = Math.floor(Math.random() * 10 + 1);
			const b = Math.floor(Math.random() * 10 + 1);
			const res = a + b;
			this.$buefy.dialog.prompt({
				message:
					this.$t("SupervisorModeQuestion") + " : " + `${a} + ${b} ?`,
				inputAttrs: {
					type: "number",
					placeholder: this.$t("SupervisorModeInput"),
					value: "",
					maxlength: 2,
					min: 0,
					max: 20,
				},
				trapFocus: true,
				onConfirm: (value) => {
					if (value == res) {
						if (!this.$route.query.isAdmin) {
							this.$buefy.toast.open(
								this.$t("SupervisorModeSuccess")
							);
						}
						this.$router.push(this.$route.path + "?isAdmin=true");
					}
					return;
				},
			});
		},
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
			const lang = Object.keys(
				this.$store.getters.getUser?.language ?? {}
			)[0];
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
				await this.$store.dispatch("copyCollectionById", {
					collectionId: this.$store.getters.getCopyCollectionId,
					fatherCollectionId: this.$route.params.fatherCollectionId,
					collection: this.getCollectionFromId(
						parseInt(this.$route.params.fatherCollectionId, 10)
					),
				});
				this.$store.commit("resetCopyCollectionId");
			} else if (this.$store.getters.getShortcutCollectionId) {
				let collection = JSON.parse(
					JSON.stringify(
						this.getCollectionFromId(
							parseInt(this.$route.params.fatherCollectionId, 10)
						)
					)
				);
				collection.collections.push({
					id: this.$store.getters.getShortcutCollectionId,
				});
				await this.$store.dispatch("editCollection", {
					id: collection.id,
					collections: collection.collections,
				});
				this.$store.commit("resetShortcutCollectionId");
			}
		},
		getCollectionFromId(id) {
			const index = this.$store.getters.getCollections.findIndex(
				(collection) => collection.id === id
			);
			return this.$store.getters.getCollections[index];
		},
		openSearchPicto() {
			this.searching = !this.searching;
		},
	},
};
</script>
<style scoped>
.contenant {
	display: flex;
	justify-content: center;
}
.search {
	bottom: 50%;
	width: 98%;
	max-height: 20%;
	position: fixed;
}
.fab-zone {
	bottom: 15%;
	right: 5%;
	position: fixed;
}
</style>
