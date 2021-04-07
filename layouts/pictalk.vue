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
	head() {
		return this.$nuxtI18nHead({ addSeoAttributes: true });
	},
	components: {
		pictalkNavbar,
	},
};
</script>
<style scoped>
.wrapper {
	overflow-x: hidden;
	position: relative;
}
</style>

