<template>
	<div class="wrapper">
		<navbar />
		<hr />
		<nuxt />
		<hr />
		<CookieControl :locale="retrieveLocale" />
		<footerPictalk />
	</div>
</template>

<script>
import navbar from "@/components/navigation/navbar";
import footerPictalk from "@/components/navigation/footer";
export default {
	components: {
		navbar,
		footerPictalk,
	},
	computed: {
		retrieveLocale() {
			return this.$i18n.getLocaleCookie();
		},
	},
};
</script>
<style scoped>
.wrapper {
	overflow-x: hidden;
	position: relative;
	height: 100%;
}
</style>

