<template>
	<div>
		<div class="container is-widescreen">
			<pictoList :pictos="loadedPictos" :publicMode="true" />
		</div>
	</div>
</template>
<script >
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
	layout: "public",
	middleware: ["axios"],
	components: {
		pictoList: pictoList,
		pictoBar: pictoBar,
	},
	created() {
		this.$store.commit("eraseSpeech");
	},
	data() {
		return {
			search: "",
		};
	},
	async fetch() {
		try {
			this.$store.dispatch("getPublicCollections");
		} catch (err) {
			throw new Error(err);
		}
	},
	computed: {
		isLogged() {
			return this.$store.getters.getUser.username == !undefined;
		},
		loadedPictos() {
			return this.$store.getters.getPublicCollections;
		},
		loadSpeech() {
			return this.$store.getters.getSpeech;
		},
	},
	head() {
		const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
		return {
			htmlAttrs: {
				title: this.$t("TitlePublic"),
				...i18nHead.htmlAttrs,
			},
			title: this.$t("TitlePublic"),
			meta: [
				{
					hid: "descriptionPublic",
					name: "description",
					content: this.$t("DescriptionPublic"),
				},
				...i18nHead.meta,
			],
		};
	},
};
</script>
