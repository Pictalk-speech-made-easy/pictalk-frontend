<template>
	<div>
		<pictoList :pictos="loadedPictos" :adminMode="adminMode" />
		<pictoBar :pictos="loadSpeech" />
	</div>
</template>
<script>
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
	layout: "pictalk",
	components: {
		pictoList: pictoList,
		pictoBar: pictoBar
	},
	computed: {
		loadSpeech() {
			return this.$store.getters.getSpeech;
		}
	},
	data() {
		return {
			adminMode: false,
			loadedPictos: [
				{
					speech: "Je",
					image:
						"https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
				},
				{
					speech: "suis",
					image:
						"https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
				},
				{
					speech: "trop",
					image:
						"https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
				},
				{
					speech: "fort",
					image:
						"https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
				}
			]
		};
	}
};
</script>