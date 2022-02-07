1<template>
	<div>
		<section class="section">
			<div class="container">
				<b-image
					class="contact center"
					lazy
					:srcset="require('@/assets/Contact_compressed.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>
				<br />
				<h1 class="title is-size-3-mobile">{{ $t("ContactMe") }}</h1>
				<h2 class="subtitle is-size-5-mobile has-text-justified">
					{{ $t("ContactText1") }}
					<a href="mailto:alex@pictalk.org">alex@pictalk.org</a>.{{
						$t("ContactText2")
					}}
				</h2>
				<br />
				<h1 class="title is-size-3-mobile">{{ $t("BugReport") }}</h1>
				<h2 class="subtitle is-size-5-mobile has-text-justified">
					{{ $t("ContactText3") }}
					<a href="https://github.com/Pictalk-speech-made-easy"
						>https://github.com/Pictalk-speech-made-easy</a
					>
				</h2>
			</div>
		</section>
	</div>
</template>
<script>
export default {
	head() {
		const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
		return {
			htmlAttrs: {
				title: this.$t("TitleContact"),
				...i18nHead.htmlAttrs,
			},
			title: this.$t("TitleContact"),
			meta: [
				{
					hid: "descriptionContact",
					name: "description",
					content: this.$t("DescriptionMetaContact"),
				},
				...i18nHead.meta,
			],
		};
	},
};
</script>
<style scoped>
.bug {
	max-width: 100%;
	height: auto;
	margin-left: auto;
	margin-right: auto;

	display: block;
}
.center {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 50%;
}
</style>
