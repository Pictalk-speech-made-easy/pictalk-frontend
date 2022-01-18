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

