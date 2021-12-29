<template>
	<div>
		<div class="container">
				<b-image alt="A little boy talking thanks to Pictalk"
				:srcset="require('@/assets/pictalk_index.png').srcSet"
				:lazy="false"
				></b-image>
		</div>
		<br>
		<div class="container">
		<div class="columns">
			<div class="column">
				<div class="box">
					<a href="https://youtu.be/vv2ktwpAijI">
					<b-image lazy alt="Yotube video link for the installation process."
				:srcset="require('@/assets/Install.png').srcSet"
				></b-image>
					</a>
				</div>
			</div>
			<div class="column">
				<div class="box">
					<a href="https://youtu.be/I0PBvxS7rSE">
					<b-image lazy alt="Youtube video link for the pictalk tutorial. Tutorial is accessible through Get Started page"
				:srcset="require('@/assets/Pictalktutorial.png').srcSet"
				></b-image></a>
				</div>
			</div>
			<div class="column">
				<div class="box">
					<a href="https://youtu.be/pKQJUBcRrQg">
					<b-image lazy alt="Youtube video link for the how to fill your pictalk tutorial."
				:srcset="require('@/assets/fillpictalk.png').srcSet"
				></b-image></a>
				</div>
			</div>
		</div>
		</div>
		<br>
		<br>
		<div class="container">
			<b-message type="is-success">
				<div class="subtitle">
					{{ $t('OfflinePictalk')}}
					</div>
			</b-message>
		</div>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">{{ $t('WaitIsPictalk')}}</h1>
					<p class="is-size-5 notification">

						{{ $t('HomeText1')}}
						<br>
						<br>
						<b-image
      					lazy
      					:srcset="require('@/assets/startingpack.png').srcSet"
      					alt="Logo du Play store"
						style="width: 80%;"
					></b-image>
					<br>
					{{ $t('HowItWorks1')}}
					<br>
					<b-image
      					lazy
      					:srcset="require('@/assets/pictobar.png').srcSet"
      					alt="Logo du Play store"
						style="width: 80%;"
    				></b-image>
					<br>
					{{ $t('HowItWorks2')}}

					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">{{ $t('Communicate')}}</h1>
					<p class="is-size-5 notification">
						<b-image lazy alt="Image showing two people talking. One with Pictalk, the other by talking"
				:srcset="require('@/assets/IRL.png').srcSet"
				></b-image>
				<br>
				{{ $t('Communicate_IRL')}}
					</p>
					<br>
					<p class="is-size-5 notification">
						<b-image lazy alt="Sample image of a copied sentence"
				:srcset="require('@/assets/Messaging.png').srcSet"
				></b-image>
				<br>
				{{ $t('Communicate_Messages')}}
					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">{{ $t('MainFeatures')}}</h1>
					<p class="is-size-5 notification">
						<ol style="list-style-type: inherit;margin-left: 5%;">
						<li>{{ $t('HomeFeature1')}}</li>
						<li>{{ $t('HomeFeature2')}}</li>
						<li>{{ $t('HomeFeature3')}}</li>
						<li>{{ $t('HomeFeature4')}}</li>
						<li>{{ $t('HomeFeature5')}}</li>
						<li>{{ $t('HomeFeature6')}}</li>
						<li>{{ $t('HomeFeature7')}}</li>
						<li>{{ $t('HomeFeature8')}}</li>
						<li>{{ $t('HomeFeature9')}}</li>
						<li>{{ $t('HomeFeature10')}}</li>
						</ol>
					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">{{ $t('OpenSourceAndFree')}}</h1>
					<p class="is-size-5 notification">
						 {{ $t('OpenSourceAndFreeText1')}}
						<a href="https://github.com/Pictalk-speech-made-easy">github</a>
						 {{ $t('OpenSourceAndFreeText2')}}
					</p>
				</div>
			</div>
		</section>
		<div class="container">
			<a href="https://play.google.com/store/apps/details?id=xyz.pictalk.www.twa">
				<b-image
      					lazy
      					:srcset="require('@/assets/Pictalkplaystore.png').srcSet"
      					alt="Logo du Play store"
						style="width: 80%;"
    		></b-image>
			</a>
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
.soontobe {
  background: repeating-linear-gradient(
    60deg,
    white,
    white 35px,
    #ff5758 35px,
    #ff5758 70px
  );
  min-height: 100%;
}
.box {
  padding: 0px;
}
</style>
