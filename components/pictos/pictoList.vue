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
				v-for="picto in pictos"
				:key="picto.id + Math.random()"
				:picto="picto"
				:adminMode="adminMode"
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
				<div class="contenant">
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
	},
	computed: {
		checkCopyCollectionId() {
			return this.$store.getters.getCopyCollectionId;
		},
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
		async copyCollection() {
			await this.$store.dispatch("copyCollectionById", { collectionId: this.$store.getters.getCopyCollectionId, fatherCollectionId: this.$route.params.fatherCollectionId, collection: this.$store.getters.getCollectionList[this.$route.params.fatherCollectionId]});
		}
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
