<template>
	<div class="columns is-multiline is-mobile vertical">
		<b-button
			v-if="$route.query.sidebarPictoId"
			class="is-info column"
			expanded
			icon-left="arrow-left"
			@click="returnWithoutDelete()"
		/>
		<picto
			class="
				column
				is-full-mobile
				is-full-tablet
				is-full-desktop
				is-full-widescreen
				is-full-fullhd
				centeredImage
				smallPadding
			"
			v-for="picto in pictos"
			:key="picto.id + Math.random()"
			:picto="picto"
			:publicMode="publicMode"
			:sidebarMode="true"
		></picto>
		<div class="column is-full" style="padding: 2rem"></div>
	</div>
</template>
<script>
import picto from "@/components/pictos/picto";
export default {
	components: { picto: picto },
	props: {
		publicMode: {
			type: Boolean,
			required: false,
			default: () => false,
		},
		pictos: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			expanded: false,
		};
	},
	methods: {
		returnWithoutDelete() {
			const pictoSpeech = this.$store.getters.getSpeech;
			const sidebarSpeech = this.$store.getters.getSpeech.filter(
				(picto) => picto.sidebar && picto.collection
			);
			if (pictoSpeech.length <= 1) {
				if (this.publicMode) {
					this.$router.push("/public/");
				} else {
					if (this.$store.getters.getRootId) {
						this.$router.push({
							path: "/pictalk/" + this.$store.getters.getRootId,
							query: { isAdmin: this.$route.query.isAdmin },
						});
					} else {
						this.$router.push({
							path: "/pictalk",
							query: { isAdmin: this.$route.query.isAdmin },
						});
					}
				}
			} else {
				let prevSidebarPictoIndex = sidebarSpeech.findIndex(
					(picto) => picto.id == this.$route.query.sidebarPictoId
				);
				prevSidebarPictoIndex = sidebarSpeech
					.slice(0, prevSidebarPictoIndex)
					.reverse()
					.findIndex((picto) => picto.collection);
				console.log(prevSidebarPictoIndex);
				if (prevSidebarPictoIndex == -1) {
					if (this.publicMode) {
						this.$router.push("/public/");
					} else {
						if (this.$store.getters.getRootId) {
							this.$router.push({
								path:
									"/pictalk/" + this.$store.getters.getRootId,
								query: { isAdmin: this.$route.query.isAdmin },
							});
						} else {
							this.$router.push({
								path: "/pictalk",
								query: { isAdmin: this.$route.query.isAdmin },
							});
						}
					}
					return;
				}
				if (
					sidebarSpeech[
						sidebarSpeech.length - (prevSidebarPictoIndex + 1)
					].collection
				) {
					if (sidebarSpeech[sidebarSpeech.length - 2]?.id) {
						this.$router.push({
							query: {
								...this.$route.query,
								sidebarPictoId:
									sidebarSpeech[sidebarSpeech.length - 2].id,
							},
						});
					} else {
						this.$router.push(this.$route.path);
					}
				}
			}
		},
	},
};
</script>
<style scoped>
.smallPadding {
	padding: 5%;
}
.centeredImage {
	align-items: center;
	justify-content: center;
}
.vertical {
	overflow-y: scroll;
	position: fixed;
	left: 75%;
	align-items: center;
}
</style>