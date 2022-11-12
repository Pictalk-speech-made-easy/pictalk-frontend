<template>
	<div>
    <link rel="preconnect" href="https://cdn.jsdelivr.net"/>
		<div class="container is-max-widescreen">
			<b-carousel :pause-info="false" :progress="false" :indicator="false" animated="fade" :interval="15000" :autoplay="carouselAutoplay" indicator indicator-position="is-top">
        <b-carousel-item class="containing">
            <b-image style="aspect-ratio: 16/9;" alt="A little boy talking thanks to Pictalk"
				:srcset="require('@/assets/pictalk_index.png').srcSet"
        :placeholder="require('@/assets/pictalk_index.png').placeholder"
				:lazy="false"
        custom-class="slightly-rounded"
				></b-image>
        </b-carousel-item>
        <b-carousel-item v-if="this.getUserLang == 'fr'" class="containing">
          <video id="pictalk-video" preload="none" style="aspect-ratio: 16/9; width: 100%; height: 99.1%;" alt="video of Alex talking about pictalk"
          :src="require('@/static/pictalk.mp4')"
          controls
          muted
          :poster="require('@/assets/pictalk-video-poster.webp')"
          class="slightly-rounded"
          ></video>
        </b-carousel-item>
				 <b-carousel-item class="containing">
            <b-image style="aspect-ratio: 16/9;" alt="screenshots of the Pictalk application running on different devices"
				:srcset="require('@/assets/Usages.png').srcSet"
        :placeholder="require('@/assets/Usages.png').placeholder"
				:lazy="true"
        custom-class="slightly-rounded"
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
            <b-image style="aspect-ratio: 16/9;" alt="A device running Pictalk sharing pictograms with another device"
				:srcset="require('@/assets/Share_demo.png').srcSet"
        :placeholder="require('@/assets/Share_demo.png').placeholder"
				:lazy="true"
        custom-class="slightly-rounded"
				></b-image>
				<section class="centeredBottomLeftTextAndBitRight">
                    <div class="has-text-centered">
                        <div class="title is-2 isPictalkColor">{{$t('ShareDemo')}}</div>
                    </div>
                </section>
        </b-carousel-item>
    </b-carousel>
		</div>
		<!-- <div class="container is-max-widescreen">
		<div class="columns is-mobile">
			<div class="column is-one-quarter-fullhd is-one-third-widescreen is-one-third-tablet is-half-mobile">
				<div class="box">
					<a href="https://youtu.be/vv2ktwpAijI">
					<b-image style="aspect-ratio: 23/5" lazy alt="Yotube video link for the installation process."
				:srcset="require('@/assets/youtube_install.png').srcSet"
        :placeholder="require('@/assets/youtube_install.png').placeholder"
				></b-image>
					</a>
				</div>
			</div>
			<div class="column is-one-quarter-fullhd is-one-third-widescreen is-one-third-tablet is-half-mobile">
				<div class="box">
					<a href="https://youtu.be/fDqxScdXlJw">
					<b-image style="aspect-ratio: 23/5" lazy alt="Yotube video link for the tutorial in French."
				:srcset="require('@/assets/video_tutorial.png').srcSet"
        :placeholder="require('@/assets/video_tutorial.png').placeholder"
				></b-image>
					</a>
				</div>
			</div>
		</div>
		</div> -->
		<section class="hero">
			<div class="hero-body">
				<div class="container">
					<h1 class="title">{{ $t('HomeTitle1')}}</h1>
					<p class="is-size-5 notification" align="justify">
						{{ $t('HomeText1')}}
					</p>
					<h1 class="title">{{ $t('HomeTitle2')}}</h1>
					<p class="is-size-5 notification" align="justify">
						{{ $t('HomeText2')}}
					</p>
					<h1 class="title">{{ $t('HomeTitle3')}}</h1>
					<p class="is-size-5 notification" align="justify">
						{{ $t('HomeText3')}}
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
						<b-image style="aspect-ratio: 16/9" lazy alt="Image showing two people talking. One with Pictalk, the other by talking"
				:srcset="require('@/assets/IRL.png').srcSet"
        :placeholder="require('@/assets/IRL.png').placeholder"
				></b-image>
				<br>
				{{ $t('Communicate_IRL')}}
					</p>
					</div>
					<br>
					<div class="column">
					<p class="is-size-5 notification " align="justify">
						<b-image style="aspect-ratio: 5/11; width: 25%;" class="center" lazy alt="Sample image of a copied sentence"
				:srcset="require('@/assets/whatsapp.png').srcSet"
        :placeholder="require('@/assets/whatsapp.png').placeholder"
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
					<p class="is-size-5 notification" align="justify" :aria-hidden="true">
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
		<div v-if="isAndroidDevice" class="container">
			<a href="https://play.google.com/store/apps/details?id=org.pictalk.www.twa">
				<b-image
					class="center"
								lazy
								:srcset="require('@/assets/PlayStoreLogo.png').srcSet"
								alt="Logo of the Play store"
						style="width: 40%; max-width: 220px; aspect-ratio: 1/1"
				></b-image>
			</a>
		</div>
		<div v-if="isAppleDevice" class="container">
			<a href="https://apps.apple.com/us/app/pictalk-aac/id1617860868">
				<b-image
					class="center"
								lazy
								:srcset="require('@/assets/AppleStoreLogo.png').srcSet"
								alt="Logo of the Apple store"
						style="width: 30%; max-width: 200px; aspect-ratio: 1/1"
				></b-image>
			</a>
		</div>
	</div>
</template>
<script >
import signup from "@/components/auth/signupModal";
import deviceInfos from "@/mixins/deviceInfos";
import lang from "@/mixins/lang";
export default {
  mixins: [deviceInfos, lang],
  components: {
    signup,
  },
  data() {
    return {
      carouselAutoplay: true,
      ended: false,
    };
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
  created() {
    if (this.directSharerUrlEncoded) {
      this.openSignUpModal();
      return;
    }
    if (this.$route.query.standalone) {
      if (this.$store.getters.getUser.username) {
        this.$router.push({
          path: "/pictalk/" + this.$store.getters.getRootId,
          query: {
            sidebarPictoId: this.$store.getters.getSidebarId,
          },
        });
      } else {
        this.$router.push({
          path: "/public/" + "346",
        });
      }
    }
  },
  mounted() {
    if (this.getUserLang == "fr") {
      const video = document.getElementById("pictalk-video");
      video.addEventListener("ended", () => {
        this.carouselAutoplay = true;
        this.ended = true;
      });
      video.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        video.muted = !video.muted;
      });

      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio !== 1) {
              video.pause();
              this.carouselAutoplay = true;
            } else {
              if (this.ended == false) {
                video.play();
                this.carouselAutoplay = false;
              }
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(video);
    }
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
        canCancel: ["escape", "x"],
      });
    },
  },
  computed: {
    directSharerUrlEncoded() {
      return this.$route.query.directsharer;
    },
    isAppleDevice() {
      return (
        this.getOSInfo() == "Mac/iOS" ||
        this.getOSInfo() == "iPad" ||
        this.getOSInfo() == "iPhone"
      );
    },
    isAndroidDevice() {
      return this.getOSInfo() == "Android" || this.getOSInfo() == "Linux";
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
    #ff5757 35px,
    #ff5757 70px
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
  color: #ff5757;
  font-size: 2em;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 0.15em;
}
</style>
