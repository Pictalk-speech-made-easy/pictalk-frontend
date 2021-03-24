<template>
	<div>
		<section class="section">
			<div class="container">
				<h1 class="title">{{ $t("Makaton") }}</h1>
				<b-image
					lazy
					alt="A little boy talking thanks to Pictalk"
					:srcset="require('@/assets/MakatonAndPictalk.png').srcSet"
					style="width: 80%; margin-left: 10%"
				></b-image>
				<section class="hero">
					<div class="hero-body">
						<div class="container">
							<h1 class="title">{{ $t("WhatIsMakaton") }}</h1>
							<p class="is-size-5 notification">
								{{ $t("MakatonText1") }}
							</p>
						</div>
					</div>
				</section>
				<section class="hero">
					<div class="hero-body">
						<div class="container">
							<h1 class="title">
								{{ $t("PictalkMakaton") }}
							</h1>
							<p class="is-size-5 notification">
								{{ $t("MakatonText2") }}
								<a href="https://www.makaton.fr/">{{
									$t("Here")
								}}</a>
								{{ $t("AndUniversalWebsite") }}
								<a href="https://www.makaton.org/">{{
									$t("Here")
								}}</a>

								{{ $t("MakatonText3") }}
							</p>
						</div>
					</div>
				</section>
			</div>
		</section>
	</div>
</template>
