<template>
	<div class="wrapper noScroll">
		<pictalkNavbar />
		<hr />
		<nuxt />
		<br />
		<!-- <CookieControl/> -->
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
html {
	/* only disable pull-to-refresh but allow swipe navigations */
	overscroll-behavior-y: contain;
}
.wrapper {
	overflow-x: hidden;
	position: relative;
}
</style>

