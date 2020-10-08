<template>
<div>
	<body>
		<section class="section">
			<div class="container">
				<div class="columns is-mobile">
					<div class="column is-half">
						<figure class="image is-128x128">
							<img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" />
						</figure>
					</div>
					<div class="column is-half">
						<figure class="image is-128x128">
							<img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" />
						</figure>
					</div>
				</div>

				<br />
				<h1 class="title is-size-3-mobile">About us</h1>
				<h2 class="subtitle is-size-5-mobile has-text-justified">
					this website/application is one of my side projects. It has been developped to help disabled people do speak
					with the help of a sentence "maker" and vocal assistant
				</h2>
				<h1 class="title is-size-3-mobile">How came the idea</h1>
				<h2
					class="subtitle is-size-5-mobile has-text-justified"
				>Our little brother has down syndrom and is unable to speak. Fortunately he is very good with informatics and knows how to navigate on his smartphone so the idea was to make a software/website with pictograms that are tied to different words and actions to later forme a sentence.</h2>
			</div>
		</section>
	</body>
</div>
</template>

<script>
export default {
	data() {
		return {
			carousels: [
				{ text: "Slide 1", color: "primary" },
				{ text: "Slide 2", color: "info" },
				{ text: "Slide 3", color: "success" },
				{ text: "Slide 4", color: "warning" },
				{ text: "Slide 5", color: "danger" }
			]
		};
	}
};
</script>
