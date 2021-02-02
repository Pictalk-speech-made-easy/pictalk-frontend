<template>
	<div>
		<div class="container">
				<b-image lazy alt="A little boy talking thanks to Pictalk" 
				:srcset="require('@/assets/pictalk_compressed.png').srcSet"
				ratio="2by1"
				></b-image>
				<b-button
					class="signup-button"
					@click="openSignUpModal()"
					type="is-primary"
					inverted
					>Sign Up to PicTalk !</b-button
				>
		</div>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">What is PicTalk ?</h1>
					<p class="is-size-5 notification">
						PicTalk is all about
						<strong>pictograms</strong>
						. It's purpose is to make the life of
						<strong>speech-disabled</strong> persons
						<strong>easier</strong>. My little brother, Pablo, has
						the down syndrom. He <b>isn't able to speak</b> nor to
						write. Luckily Pablo is into tablet and phones. Most
						of the communication Pablo does comes from his device.
						The greater part of the time he uses pictures of places
						or <b>pictograms to express himself</b>. Currently there are
						very limited apps that use pictograms to produce a
						sentence out loud. These apps were rather <b>expensive or
						not compatible</b> with almost all devices. So I decided,
						with my limited knowledge of Web development to make an
						app.
					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">Main features</h1>
					<p class="is-size-5 notification">
            <ol style="list-style-type: inherit;margin-left: 5%;">
            <li>All your images/pictograms are saved in the <b>cloud</b></li>
			<li>You can <b> install </b> the app from you <b>computer</b> or <b>phone</b> </li>
            <li> It works with <b>all</b> platforms, as simple as that</li>
            <li>It can speak virtually <b>any language</b> </li>
			<li> <b>Unlimited</b> number of pictograms and collections</li>
			<li> <b>No ads</b></li>
			<li> <b> Easy to use </b> </li>
			<li> <b> Zero </b> third-party cookies </li>
            </ol>
					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">Open Source and Free</h1>
					<p class="is-size-5 notification">
						All of the code is <b>open sourced</b> on 
						<a href="https://github.com/Pictalk-speech-made-easy">github</a>. You can of
						course contribute or share ideas and upgrades. Because I
						want everyone to have a chance to communicate, PicTalk
						will ever be free and I will try to let users as much
						storage as they need. Unfortunately, I'm not rich. I
						can't spend too much money on servers if PicTalk
						userbase grows. That's why, if you are using PicTalk
						and like it, feel free to donate. <b>Thanks</b>
					</p>
				</div>
			</div>
		</section>
		<div class="container">
			<a href="https://play.google.com/store/apps/details?id=xyz.pictalk.www.twa">
				<b-image
      					lazy
      					:srcset="require('@/assets/Playstore.png').srcSet"
      					alt="Logo du Play store"
						style="width: 20%;"
    		></b-image>
			</a>
				<b-button class="is-primary" tag="nuxt-link" to="/getstarted">Get started with PicTalk !</b-button>
		</div>
	</div>
</template>
<script>
import signup from "@/components/auth/signupModal";

export default {
	components: {
		signup,
	},
	middleware: ["check-auth"],
	methods: {
		openSignUpModal() {
			this.$buefy.modal.open({
				parent: this,
				component: signup,
				hasModalCard: true,
				customClass: "custom-class custom-class-2",
				trapFocus: true,
			});
		},
	},
};
</script>
<style scoped>
.signup-button {
	position: absolute;
	top: 90%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
