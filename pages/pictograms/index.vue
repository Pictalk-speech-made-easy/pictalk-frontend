<template>
	<div>
		<section class="section">
			<div class="container">
				<h1 class="title">{{ $t("Pictograms") }}</h1>
				<b-image
					lazy
					alt="A little boy talking thanks to Pictalk"
					:srcset="require('@/assets/pictalkarsaac.png').srcSet"
					style="width: 80%; margin-left: 10%"
				></b-image>
				<section class="hero">
					<div class="hero-body">
						<div class="container">
							<h1 class="title">{{ $t("ARSAAC") }}</h1>
							<p class="is-size-5 notification">
								{{ $t("ProvidedPictos") }}
								<a href="https://arasaac.org/">{{
									$t("Here")
								}}</a>
							</p>
						</div>
					</div>
				</section>
			</div>
		</section>
	</div>
</template>
