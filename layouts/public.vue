<template>
	<div class="wrapper">
		<navbar />
		<hr />
		<nuxt />
		<br />
	</div>
</template>
<script>
import navbar from "@/components/navigation/navbar";
export default {
	components: {
		navbar,
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

