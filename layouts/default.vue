<template>
	<div class="wrapper">
		<navbar />
		<hr />
		<nuxt />
		<hr />
		<CookieControl />
		<footerPictalk />
	</div>
</template>

<script>
import navbar from "@/components/navigation/navbar";
import footerPictalk from "@/components/navigation/footer";
export default {
	head() {
		return this.$nuxtI18nHead({ addSeoAttributes: true });
	},
	components: {
		navbar,
		footerPictalk,
	},
};
</script>
<style scoped>
.wrapper {
	overflow-x: hidden;
	position: relative;
}
</style>

