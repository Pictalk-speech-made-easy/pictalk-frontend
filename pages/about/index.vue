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
						Hi, I'm Alex. I'm a 23 years old student at INSA Lyon. I study Telecommunications and Computer Science. I'm a fan of self-hosting, development and networking ! I also like making 
<a href="https://www.youtube.com/watch?v=aL7PR2x7UlU">videos</a>
 or taking photos during my vacations. 
					</h2>
					<br />
					<h1 class="title is-size-3-mobile">About Pic'Talk</h1>
					<h2 class="subtitle is-size-5-mobile has-text-justified">
						Pic'Talk isn't registered as a company as I don't make
						money with it. 
						Pic'Talk is an app I wanted to do since 2-3 years. During the
						global lockdown, I took classes of web dev and 6 months later...
						voila ! Speaking is a fundamental right, that's why I want Pic'Talk to be accessible to everybody... All I ask you is to use this app
						in order to make good and not bad. If you have ideas or needs just send me an email at : <a href="mailto:alexandros.sidiras@laposte.net">alexandros.sidiras@laposte.net</a>.
					</h2>
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
