<template>
	<div>
		<div class="container">
			<figure class="image is-2by1">
				<img
					src="~assets/pictalk_compressed.png"
					alt="A little boy talking thanks to Pictalk"
				/>
				<b-button
					class="signup-button"
					@click="openSignUpModal()"
					type="is-primary"
					inverted
					>Sign Up to Pic'Talk !</b-button
				>
			</figure>
		</div>
		<br />
		<br />
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">What is Pic'Talk ? Why ?</h1>
					<p class="is-size-5 notification">
						Pic'Talk is all about
						<strong>pictograms</strong>
						. It's purpose is to make the life of
						<strong>speech-disabled</strong> persons
						<strong>easier</strong>. My little brother, Pablo, has
						the down syndrom. He isn't able to speak nor to
						write.Luckily Pablo is into tablet and into phones. Most
						of the communication Pablo does comes from his device.
						The greater part of the time he uses pictures of places
						or pictograms to express himself. Currently there are
						very limited apps that use pictograms to produce a
						sentence out loud. These apps were rather expensive or
						not compatible with almost all devices. So I decided,
						with my limited knowledge of Web development to make an
						app.
					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">Open Source and Free</h1>
					<p class="is-size-5 notification">
						All of the code is open sourced on github. You can of
						course contribute or share ideas and upgrades. Because I
						want everyone to have a chance to communicate, Pic'Talk
						will ever be free and I will try to let users as much
						storage as they need. Unfortunately, I'm not rich. I
						can't spend too much money on servers if Pic'Talk
						userbase grows. That's why, if you are using Pic'Talk
						and like it, feel free to donate. I plan to print the
						cost of the servers on the mainpage.
					</p>
				</div>
			</div>
		</section>
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
