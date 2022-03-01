<template>
	<div>
		<div class="container is-max-widescreen">
			<b-carousel :pause-info="false" :progress="false" :indicator="false" animated="fade">
        <b-carousel-item class="containing">
            <b-image  alt="A little boy talking thanks to Pictalk"
				:srcset="require('@/assets/pictalk_index.png').srcSet"
				:lazy="false"
				></b-image>
        </b-carousel-item>
				 <b-carousel-item class="containing">
            <b-image  alt="A little boy talking thanks to Pictalk"
				:srcset="require('@/assets/Usages.png').srcSet"
				:lazy="false"
				></b-image>
				<section class="centeredBottomLeftText">
                    <div class="has-text-centered">
                        <div class="title is-3 isPictalkColor">{{$t('CreateDemo')}}</div>
                    </div>
                </section>
								<section class="centeredBottomText">
                    <div class="has-text-centered">
                        <div class="title is-3 isPictalkColor">{{$t('TalkDemo')}}</div>
                    </div>
                </section>
								<section class="centeredBottomRightText">
                        <div style="white-space: nowrap;" class="title is-4 isPictalkColor">{{$t('CommunicateDemo')}}</div>
                </section>
        </b-carousel-item>
				<b-carousel-item class="containing">
            <b-image  alt="A little boy talking thanks to Pictalk"
				:srcset="require('@/assets/Share_demo.png').srcSet"
				:lazy="false"
				></b-image>
				<section class="centeredBottomLeftTextAndBitRight">
                    <div class="has-text-centered">
                        <div class="title is-2 isPictalkColor">{{$t('ShareDemo')}}</div>
                    </div>
                </section>
        </b-carousel-item>
    </b-carousel>
		</div>
		<br>
		<div class="container is-max-widescreen">
		<div class="columns is-mobile">
			<div class="column is-one-quarter-fullhd is-one-third-widescreen is-one-third-tablet is-half-mobile">
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
					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h2 class="title">{{ $t('Communicate')}}</h2>
					<div class="columns">
						<div class="column">
					<p class="is-size-5 notification column" align="justify">
						<b-image lazy alt="Image showing two people talking. One with Pictalk, the other by talking"
				:srcset="require('@/assets/IRL.png').srcSet"
				></b-image>
				<br>
				{{ $t('Communicate_IRL')}}
					</p>
					</div>
					<br>
					<div class="column">
					<p class="is-size-5 notification " align="justify">
						<b-image class="center" lazy alt="Sample image of a copied sentence"
				:srcset="require('@/assets/whatsapp.png').srcSet"
				style="width: 25%;"
				></b-image>
				<br>
				{{ $t('Communicate_Messages')}}
					</p>
					</div>
					</div>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h2 class="title">{{ $t('MainFeatures')}}</h2>
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
						<li>{{ $t('HomeFeature11')}}</li>
						<li>{{ $t('HomeFeature12')}}</li>
						<li>{{ $t('HomeFeature13')}}</li>
						</ol>
					</p>
				</div>
			</div>
		</section>
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h2 class="title">{{ $t('OpenSourceAndFree')}}</h2>
					<p class="is-size-5 notification" align="justify">
						 {{ $t('OpenSourceAndFreeText1')}}
						<a href="https://github.com/Pictalk-speech-made-easy">Github</a>
						 {{ $t('OpenSourceAndFreeText2')}}
					</p>
				</div>
			</div>
		</section>
		<div class="container">
			<a href="https://play.google.com/store/apps/details?id=org.pictalk.www.twa">
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
					hid: "descriptionHome",
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
.containing {
	position: relative;
	text-align: center;
}
.centeredBottomText {
	position: absolute;
	top: 90%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.centeredBottomLeftText {
	position: absolute;
	top: 90%;
	left: 15%;
	transform: translate(-50%, -50%);
}
.centeredBottomRightText {
	position: absolute;
	top: 90%;
	left: 85%;
	transform: translate(-50%, -50%);
}
.centeredBottomLeftTextAndBitRight {
	position: absolute;
	top: 80%;
	left: 22%;
	transform: translate(-50%, -50%);
}
.isPictalkColor {
	color: #ff5e5e;
}
</style>
