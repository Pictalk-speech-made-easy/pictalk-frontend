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
					<h1 class="title is-size-3-mobile">Backers</h1>
					<div class="columns is-centered ">
						<div class="column is-one-fifth ">
							<b-image
      					lazy
      					:srcset="require('@/assets/CPPLogo.jpg').srcSet"
      					alt="Coups de Pouce Passions logo"
    				></b-image>
						</div>
						<div class="column is-one-fifth">
						<b-image
      					lazy
      					:srcset="require('@/assets/FondationLogo.png').srcSet"
      					alt="Fondation INSA Lyon logo"
						style="width: 80%"
    				></b-image>
						</div>
					</div>
					<h2 class="subtitle is-size-5-mobile has-text-justified">
						Many thanks to <b>La fondation INSA Lyon</b> that rewarded PicTalk with <b>1000€</b>. Their program <b> Coups de Pouce Passion </b> helps INSA students fund their projects. 
						You can also watch this <a href="https://youtu.be/VTbszl_xmN4">video</a> (in French) that helped me win the contest !
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
