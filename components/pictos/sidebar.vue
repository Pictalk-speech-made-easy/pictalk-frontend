<template>
	<div
		class="
			columns
			is-multiline is-mobile is-centered
			notification
			smallPadding
		"
	>
		<picto
			class="
				column
				is-full-mobile
				is-half-tablet
				is-one-quarter-desktop
				is-one-quarter-widescreen
				centeredImage
			"
			v-for="picto in pictos"
			:key="picto.id + Math.random()"
			:picto="picto"
			:adminMode="adminMode"
			:publicMode="publicMode"
			:sidebarMode="true"
		/>
		<b-button
			v-if="adminMode"
			class="is-success centeredButton"
			rounded
			icon-left="image"
		/>
		<b-button
			v-if="adminMode"
			class="is-danger centeredButton"
			rounded
			icon-left="folder-table"
		/>
	</div>
</template>
<script>
import picto from "@/components/pictos/picto";
export default {
	components: { picto: picto },
	props: {
		adminMode: {
			type: Boolean,
			required: true,
		},
		publicMode: {
			type: Boolean,
			required: false,
			default: () => false,
		},
		pictos: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			expanded: false,
		};
	},
};
</script>
<style scoped>
.smallPadding {
	padding: 0px;
}
.centeredImage {
	align-items: center;
	justify-content: center;
}
.centeredButton {
	margin: auto;
}
</style>