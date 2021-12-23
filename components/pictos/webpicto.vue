<template>
	<div @click="downloadImg(webpicto.src)">
		<img :src="webpicto.src" />
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
			src = src.replace("download=false", "download=true");
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
