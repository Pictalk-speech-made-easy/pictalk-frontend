<template>
	<div @click="downloadImg(webpicto.download)">
		<b-image lazy :src="webpicto.src"></b-image>
		<b>{{ webpicto.alt }}</b>
	</div>
</template>

<script>
export default {
	name: "Webpicto",

	props: {
		webpicto: {
			type: Object,
			required: true,
		},
	},
	methods: {
		async downloadImg(src) {
			this.show = 1;
			let response = await fetch(src);
			response = await response.blob();
			const file = new File(
				[response],
				`${this.webpicto.alt.replaceAll(
					/[&\/\\#, +()$~%.'":*?<>{}]/g,
					"-"
				)}.jpg`,
				{ type: response.type }
			);
			this.$emit("uploadfile", file);
		},
	},
};
</script>
