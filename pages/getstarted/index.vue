<template>
	<div class="container">
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">{{ $t("GetStartedTitle") }}</h1>
				</div>
			</div>
		</section>
		<b-image
			lazy
			:srcset="require('@/assets/Getting_Started.png').srcSet"
			style="width: 80%; margin-left: 10%"
			alt="Rocket carrying non-verbal people"
		></b-image>
		<body>
			<section class="section">
				<h2 class="subtitle">
					{{ $t("TutorialDescription") }}
				</h2>
				<ul
					style="list-style-type: inherit; margin-left: 5%"
					class="subtitle"
				>
					<li><b>Play Store</b></li>
					<li>
						{{ $t("TutorialInstallation") }}
					</li>
				</ul>
				<h2 class="subtitle">Let's <b>go : </b></h2>
				<b-image
					lazy
					:srcset="require('@/assets/1-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialFirstScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/2_signup-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>
				<br />
				<h2 class="subtitle">
					{{ $t("TutorialSecondScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/3_signup-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialThirdScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/4_once_logged.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialFourthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/Collections-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialFifthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/Pictogramms-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialSixthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/5_question-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialSeventhScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/6_adminMode-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialEigthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="
						require('@/assets/7_create_collection-min.png').srcSet
					"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialNinthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/8_manger-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialTenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/9_collections-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialEleventhScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="
						require('@/assets/11_create_pictogram-min.png').srcSet
					"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialTwelfthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="
						require('@/assets/12_create_pictogram_folder-min.png')
							.srcSet
					"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialThirteenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/13_pictograms-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialFourteenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/14_pictobar-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialFifteenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="
						require('@/assets/15_pictobar_1_picto-min.png').srcSet
					"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialSixteenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/16_picto_folder-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialSeventeenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/17_frites-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialEighteenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="
						require('@/assets/18_picto_bar_2pictos-min.png').srcSet
					"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialNineteenthScreen") }}
				</h2>
				<b-image
					lazy
					:srcset="require('@/assets/19_parameters-min.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>

				<h2 class="subtitle">
					{{ $t("TutorialTwentiethScreen") }}
				</h2>
				<br />
				<h2 class="title">{{ $t("TutorialEnd") }}</h2>
			</section>
		</body>
	</div>
</template>
<script>
export default {
	head() {
		const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
		return {
			htmlAttrs: {
				title: this.$t("TitleGetStarted"),
				...i18nHead.htmlAttrs,
			},
			meta: [
				{
					hid: "description",
					name: "description",
					content: this.$t("DescriptionTutorial"),
				},
				...i18nHead.meta,
			],
		};
	},
};
</script>