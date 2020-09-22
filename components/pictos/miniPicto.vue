<template>
	<div>
		<img :src="path" width="20%" class="centered" />
		<div class="is-size-6">{{speech}}</div>
	</div>
</template>

<script>
export default {
	name: "miniPicto",
	props: {
		speech: {
			type: String,
			required: true
		},
		path: {
			type: String,
			required: true
		}
	}
};
</script>
<style scoped>
.centered {
	margin-left: auto;
	margin-right: auto;
}
</style>
