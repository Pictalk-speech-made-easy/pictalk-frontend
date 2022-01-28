<template>
	<div>
		<section class="section">
			<div class="container">
				<h1 class="title">{{ $t("RecentNews") }}</h1>
				<b-image
					lazy
					alt="A little boy talking thanks to Pictalk"
					:srcset="require('@/assets/UpdatesandNews.png').srcSet"
					style="width: 80%; margin-left: 10%"
				></b-image>
				<br />
				<b-message type="is-success">
					<div class="subtitle">
						&#127881;&#127881;&#127881;{{
							$t("AwardPictalk")
						}}&#127881;&#127881;&#127881;
					</div>
				</b-message>
				<b-message type="is-success">
					<div class="subtitle">
						{{ $t("PictalkNewsSTitle") }}
						<a
							href="https://www.insa-lyon.fr/fr/actualites/je-voulais-lui-permettre-s-exprimer-pleinement"
							>https://www.insa-lyon.fr/fr/actualites/je-voulais-lui-permettre-s-exprimer-pleinement</a
						>
					</div>
				</b-message>

				<p class="is-size-5 notification">
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapDone1")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapDone2")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapDone3")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success"
							>{{ $t("RoadmapDone4") }}
						</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success"
							>{{ $t("RoadmapDone5") }}
						</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success"
							>{{ $t("RoadmapDone6") }}
						</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success"
							>{{ $t("RoadmapDone7") }}
						</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapDone8")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapDone9")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapDone10")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapDone11")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="true" type="is-success">{{
							$t("RoadmapTodo2")
						}}</b-checkbox>
					</b-field>
				</p>
				<h1 class="title">{{ $t("Roadmap") }}</h1>
				<p class="is-size-5 notification">
					<b-field>
						<b-checkbox :value="false" type="is-primary">{{
							$t("RoadmapTodo1")
						}}</b-checkbox>
					</b-field>
					<b-field>
						<b-checkbox :value="false" type="is-primary">{{
							$t("RoadmapTodo3")
						}}</b-checkbox>
					</b-field>
				</p>
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
				title: "Pictograms",
				...i18nHead.htmlAttrs,
			},
			meta: [
				{
					hid: "description",
					name: "description",
					content: this.$t("DescriptionNews"),
				},
				...i18nHead.meta,
			],
		};
	},
};
</script>
