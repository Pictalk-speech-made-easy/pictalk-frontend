<template>
	<div class="containing">
		<img class="image" style :src="path" crossorigin="anonymous" />
	</div>
</template>

<script>
export default {
	name: "miniPicto",
	props: {
		path: {
			type: String,
			required: true,
		},
	},
};
</script>
<style scoped>
.containing {
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.image {
	margin-top: 0;
	min-width: 0;
	max-height: 4rem;
	min-height: 0;
}
</style>
