<template>
	<div class="wrapper">
		<pictalkNavbar />
		<hr />
		<nuxt />
		<br />
	</div>
</template>
<script>
import pictalkNavbar from "@/components/navigation/pictalk-navbar";
export default {
	components: {
		pictalkNavbar,
	},
	data() {
		return {
			intervalId: null,
		};
	},
	async mounted() {
		this.intervalId = setInterval(async function () {
			if (window.navigator.onLine) {
				try {
					await this.$nuxt.$store.dispatch("downloadCollections");
					await this.$nuxt.$store.dispatch("getUser");
				} catch (err) {
					console.log(err);
				}
			}
		}, 30000);
	},
	destroyed() {
		console.log("Delete interval");
		clearInterval(this.intervalId);
	},
};
</script>
<style scoped>
.wrapper {
	overflow-x: hidden;
	position: relative;
	width: 100%;
	height: 100%;
}
</style>

