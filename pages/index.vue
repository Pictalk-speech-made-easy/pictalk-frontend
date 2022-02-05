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
			<div class="column is-offset-one-quarter is-two-fifths">
				<div class="box">
					<a href="https://youtu.be/vv2ktwpAijI">
					<b-image lazy alt="Yotube video link for the installation process."
				:srcset="require('@/assets/youtube_install.png').srcSet"
				></b-image>
					</a>
				</div>
			</div>
		</div>
		</div>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">{{ $t('WaitIsPictalk')}}</h1>
					<p class="is-size-5 notification" align="justify">
						{{ $t('HomeText1')}}
						<br>
						<br>
						<b-image
								lazy
								:srcset="require('@/assets/startingpack.png').srcSet"
								alt="Starter Pack"
						style="width: 98%"
					></b-image>
					<br>
					{{ $t('HowItWorks1')}}
					<br>
					<b-image
								lazy
								:srcset="require('@/assets/pictobar.png').srcSet"
								alt="Pictobar"
						style="width: 98%"
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
					<p class="is-size-5 notification" align="justify">
						<b-image lazy alt="Image showing two people talking. One with Pictalk, the other by talking"
				:srcset="require('@/assets/IRL.png').srcSet"
				></b-image>
				<br>
				{{ $t('Communicate_IRL')}}
					</p>
					<br>
					<p class="is-size-5 notification" align="justify">
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
					<p class="is-size-5 notification" align="justify">
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
					<p class="is-size-5 notification" align="justify">
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
					class="center"
								lazy
								:srcset="require('@/assets/Pictalkplaystore.png').srcSet"
								alt="Logo du Play store"
						style="width: 40%;"
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
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        title: "Pictalk",
        ...i18nHead.htmlAttrs,
      },
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("Description"),
        },
        ...i18nHead.meta,
      ],
    };
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
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
