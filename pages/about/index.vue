<template>
	<div>
		<body>
			<section class="section">
				<div class="container">
					<figure class="image is-128x128">
						<img
							class="is-rounded"
							src="https://avatars0.githubusercontent.com/u/45072484?s=460&u=319a46de82b5b32ade7afb1807dec076bd6a925f&v=4"
						/>
					</figure>

					<br />
					<h1 class="title is-size-3-mobile">About Me</h1>
					<h2 class="subtitle is-size-5-mobile has-text-justified">
						Hello, I'm Alex. My little brother has the down syndrom
						and isn't able to talk. Hopefully I study
						Telecommunications and Computer Science at INSA Lyon !
						And with some motivation and lots of time I built
						PicTalk.
					</h2>
					<br />
					<h1 class="title is-size-3-mobile">About Pic'Talk</h1>
					<h2>Pic'Talk</h2>
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
				{ text: "Slide 5", color: "danger" },
			],
		};
	},
};
</script>
