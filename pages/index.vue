<template>
  <div>
    <div class="hidden-content">
      <h1>
        {{ $t('TitleCompleteKeywords') }}
      </h1>
      <h2>
        {{ $t('DescriptionSEO') }}
      </h2>
    </div>
    <div class="container is-max-widescreen" style="padding-top: 4rem; padding-bottom: 4rem; max-width: 768px;">
      <a :href="`https://www.pictalk.org/${getUserLang}`">
        <h2 style="font-size: 3.5rem; line-height: 0.95; font-weight: 500; padding: 0.5rem; margin-bottom: 1rem;">{{
          $t('PictalkAAC') }}
        </h2>
      </a>
    </div>
    <div class="container is-max-widescreen" style="max-width: 768px; padding-bottom: 4rem;">
      <b-carousel :pause-info="false" :progress="false" :indicator="false" indicator-position="is-top"
        :arrow-hover="false" animated="fade" :interval="15000" :autoplay="carouselAutoplay">
        <b-carousel-item class="containing">
          <div class="slightly-rounded placeholder" :style="`aspect-ratio: 16/9; background-image: url(${require('@/assets/Usages2.png').placeholder
            })`">
            <img class="slightly-rounded" loading="lazy" :srcset="require('@/assets/Usages2.png').srcSet"
              alt="screenshots of the Pictalk application running on different devices" />
          </div>
          <section class="centeredBottomLeftText">
            <div class="has-text-centered">
              <div class="title is-3 isPictalkColor">{{ $t('CreateDemo') }}</div>
            </div>
          </section>
          <section class="centeredBottomText">
            <div class="has-text-centered">
              <div class="title is-3 isPictalkColor">{{ $t('TalkDemo') }}</div>
            </div>
          </section>
          <section class="centeredBottomRightText">
            <div style="white-space: nowrap;" class="title is-4 isPictalkColor">{{ $t('CommunicateDemo') }}</div>
          </section>
        </b-carousel-item>

        <b-carousel-item class="containing">
          <div class="slightly-rounded placeholder" :style="`aspect-ratio: 16/9; background-image: url(${require('@/assets/agenda_pictalk.png').placeholder
            })`">
            <a :href="`https://www.pictalk.org/${getUserLang}/agenda`">
              <img class="slightly-rounded" loading="lazy" :srcset="require('@/assets/agenda_pictalk.png').srcSet"
                alt="screenshots of the Pictalk application running on different devices" /></a>
          </div>
          <section class="centeredBottomText">
            <div class="has-text-centered">
              <div class="title is-3 isPictalkColor">{{ $t('AgendaCAA') }}</div>
            </div>
          </section>
        </b-carousel-item>
        <b-carousel-item v-show="this.getUserLang == 'fr'" class="containing">
          <video id="pictalk-video" preload="none" style="aspect-ratio: 16/9; width: 100%; height: 99.1%;"
            alt="video of Alex talking about pictalk" :src="require('@/static/pictalk.mp4')" controls muted
            :poster="require('@/assets/pictalk-video-poster.webp')" class="slightly-rounded"></video>
        </b-carousel-item>
      </b-carousel>
    </div>
    <div style="max-width: 768px;" class="container is-max-widescreen">
      <div class="columns is-vcentered">
        <div class="column">
          <b-button @click="openSignUpModal" class="is-primary is-large is-fullwidth">
            {{ $t('SignUp') }}
          </b-button>
        </div>
        <div class="column">
          <b-button class="is-large is-fullwidth">
            <div class="columns is-vcentered" v-show="true">
              <p class="column">
                {{ $t('DownloadApp') }}
              </p>
              <div class="column">
                <a href="https://play.google.com/store/apps/details?id=org.pictalk.www.twa">
                  <b-image class="center" lazy :srcset="require('@/assets/PlayStoreLogo.png').srcSet"
                    alt="Logo of the Play store" style="width: 40%; max-width: 220px; aspect-ratio: 1/1"></b-image>
                </a>
              </div>
            </div>
            <div class="columns is-vcentered" v-if="false">
              <p class="column">
                {{ $t('DownloadApp') }}
              </p>
              <div v-show="isAppleDevice" class="column">
                <a href="https://apps.apple.com/us/app/pictalk-aac/id1617860868">
                  <b-image class="center" lazy :srcset="require('@/assets/AppleStoreLogo.png').srcSet"
                    alt="Logo of the Apple store" style="width: 30%; max-width: 200px; aspect-ratio: 1/1"></b-image>
                </a>
              </div>
            </div>
          </b-button>
        </div>

      </div>
    </div>
    <section>
      <div style="max-width: 768px;" class="container">
        <div class=" columns is-centered" style="padding-top: 4rem; margin-bottom: 8rem;">
          <div class="column">
            <div class="is-size-5 notification" align="justify">
              <b-image style="aspect-ratio: 16/9" lazy
                alt="Image showing two people talking. One with Pictalk, the other by talking"
                :srcset="require('@/assets/IRL.png').srcSet" :placeholder="require('@/assets/IRL.png').placeholder" />
              {{ $t('Communicate_IRL') }}
            </div>
          </div>
          <div class="column">
            <div class="is-size-5 notification" align="justify">
              <b-image style="aspect-ratio: 10/12; width: 60%;" class="center" lazy
                alt="Sample image of a copied sentence" :srcset="require('@/assets/whatsapp.png').srcSet"
                :placeholder="require('@/assets/whatsapp.png').placeholder"></b-image>
              {{ $t('Communicate_Messages') }}
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
<script>
import axios from "axios";
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
  async created() {
    if (this.directSharerUrlEncoded) {
      this.openSignUpModal();
      return;
    }
    if (this.validationTokenUrlEncoded) {
      try {
        await axios.get(`/auth/validation/${this.validationTokenUrlEncoded}`)
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("VerifiedEmail"),
          position: "is-top-right",
          type: "is-success",
          hasIcon: true,
          iconSize: "is-small",
          icon: "mail",
        });
      } catch (err) {
        console.log(err);
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("ErrorVerifiedEmail"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "key",
        });
      }
    }
    if (this.$route.query.standalone) {
      if (this.$store.getters.getUser.username) {
        this.$router.push({
          path: "/pictalk/" + this.$store.getters.getRootId,
        });
      } else {
        this.$router.push({
          path: "/public?fatherCollectionId=346"
        });
      }
    }
  },
  mounted() {
    if (this.getUserLang == "fr") {
      const video = document.getElementById("pictalk-video");
      if (video) {
        video.addEventListener("ended", () => {
          this.carouselAutoplay = true;
          this.ended = true;
        });
        video.addEventListener("play", () => {
          this.carouselAutoplay = false;
        });
        video.addEventListener("pause", () => {
          this.carouselAutoplay = true;
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
    }
  },
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
    validationTokenUrlEncoded() {
      return this.$route.query.validate;
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
.subcard-img {
  border-radius: 12px;
  aspect-ratio: 83 / 27;
  max-height: 20vh;
  object-fit: cover;
}

.bg-dotted {
  background-image: radial-gradient(#00000020 2px, transparent 0);
  background-size: 60px 60px;
  background-position: -20px -20px;
}

.signup-button {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.soontobe {
  background: repeating-linear-gradient(60deg,
      white,
      white 35px,
      #ff5757 35px,
      #ff5757 70px);
  min-height: 100%;
}

.box {
  padding: 0px;
}

.usage-text {
  margin-top: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.feature-text {
  padding: 3px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
}

@media screen and (min-width: 768px) {
  .feature-text {
    font-size: 1rem;
  }
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

.notification {
  color: #4a4a4a;
  background-color: #edf1f5;
  border-radius: 12px;
}

.bg-icons {
  background-color: #edf1f5;
  border-radius: 12px;
  padding: 0.3em;
  border: solid 1px #00000020;
}

.centerIcon {
  text-shadow: #00000070 2px 2px 3px;
  -webkit-text-stroke: 1px #00000070;
  text-align: center;
  font-size: clamp(3.5rem, 10vw, 5rem);
}

.hidden-content {
  display: none;
}

.placeholder {
  background-size: cover;
  background-position: center;
}
</style>
