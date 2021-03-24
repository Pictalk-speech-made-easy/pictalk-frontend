1<template>
	<div>
		<section class="section">
			<div class="container">
				<b-image
					class="contact"
					lazy
					:srcset="require('@/assets/Contact_compressed.png').srcSet"
					alt="Rocket carrying non-verbal people"
				></b-image>
				<br />
				<h1 class="title is-size-3-mobile">{{ $t("ContactMe") }}</h1>
				<h2 class="subtitle is-size-5-mobile has-text-justified">
					{{ $t("ContactText1") }}
					<a href="mailto:alexandros.sidiras@laposte.net"
						>alexandros.sidiras@laposte.net</a
					>{{ $t("ContactText2") }}
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
<style scoped>
.bug {
	max-width: 100%;
	height: auto;
	margin-left: auto;
	margin-right: auto;

	display: block;
}
.contact {
	width: 70%;
}
</style>
