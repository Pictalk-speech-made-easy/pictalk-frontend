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
html body {
	/* only disable pull-to-refresh but allow swipe navigations */
	overscroll-behavior-y: none;
}
.wrapper {
	overscroll-behavior-y: none;
	overflow-x: hidden;
	position: relative;
}
</style>

