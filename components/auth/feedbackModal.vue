<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <b-button class="button" type="is-danger" icon-left="close" @click="$parent.close()" />
      <p align="center" class="modal-card-title">{{ $t("Feedback") }}</p>
    </header>
    <section class="modal-card-body">
      <b-notification :closable="false">
        <div class="subtitle">
          {{ $t("FeedbackSocials") }}
        </div>
        <div class="columns is-centered is-mobile whitebg rounded">
          <div class="column centerImage">
            <a href="https://www.instagram.com/pictalk_speech_made_easy/">
              <b-image style="height: 42px" lazy :responsive="false" :srcset="require('@/assets/instagram.webp').srcSet"
                alt="Instagram" custom-class="imgpixelslimitvw portrait grayscale" />
            </a>
          </div>
          <div class="column centerImage">
            <a href="https://www.facebook.com/profile.php?id=100086626416882">
              <b-image style="height: 42px" lazy :responsive="false" :srcset="require('@/assets/facebook.webp').srcSet"
                alt="Facebook" custom-class="imgpixelslimitvw portrait grayscale" />
            </a>
          </div>
          <div class="column centerImage">
            <a href="https://www.linkedin.com/company/88954834/">
              <b-image style="height: 42px" lazy :responsive="false" :srcset="require('@/assets/linkedin.webp').srcSet"
                alt="Linkedin" custom-class="imgpixelslimitvw portrait grayscale" />
            </a>
          </div>
        </div>
      </b-notification>
      <b-notification :closable="false">
        <div class="subtitle">
          <p>{{ $t("FeedbackSurvey") }}
            <a style="color: #ff5757;" target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSd5HcoyXbT03tBsrVIo_MfJxiLHQdEqVjFBR_Cb8iDEARLNFw/viewform?usp=sf_link">
              {{ $t("clickHere") }}
            </a>
          </p>
        </div>
        <a class="centerImage" target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSd5HcoyXbT03tBsrVIo_MfJxiLHQdEqVjFBR_Cb8iDEARLNFw/viewform?usp=sf_link">
          <img class="centerImage" loading="lazy" id="googleForms" :srcset="require('@/assets/GoogleForms.webp').srcSet"
            alt="Google Forms" custom-class="portrait grayscale" width="192px" />
        </a>
      </b-notification>
      <b-field :label="$t('FeedbackContact')">
        <b-input v-model="contact" required></b-input>
      </b-field>
      <b-field :label="$t('FeedbackTitle')">
        <b-input v-model="title" required></b-input>
      </b-field>
      <b-field :label="$t('FeedbackDescription')">
        <b-input type="textarea" v-model="description" lazy required></b-input>
      </b-field>
      <b-button class="is-text" @click="toggleDebugInfos()">{{
        $t("FeedbackToggle")
        }}</b-button>
      <div v-if="showDebugInfos" style="margin-top: 0.85rem">
        <h2 class="subtitle is-size-5 headers">
          {{ $t("FeedbackDeviceInfo") }}
        </h2>
        <div class="scrollableDiv">
          {{ getDeviceInfo() }}
          {{ getUserAgent }}
        </div>
        <br />
        <h2 class="subtitle is-size-5 headers">{{ $t("FeedbackVuex") }}</h2>
        <div class="scrollableDiv">
          {{ getFilteredLocalStorage }}
        </div>
        <br />
        <h2 class="subtitle is-size-5 headers">{{ $t("FeedbackVoices") }}</h2>
        <div class="scrollableDiv">
          {{ getVoices }}
        </div>
        <br />
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="container">
        <b-button style="
            width: 50%;
            display: flex;
            margin-right: auto;
            margin-left: auto;
          " class="is-info" icon-right="check" :loading="loadingSave" @click="save()">{{
            $t("Send") }}</b-button>
      </div>
    </footer>
  </div>
</template>
<script>
import deviceInfos from "@/mixins/deviceInfos";
import tts from "@/mixins/tts";
import { captureUserFeedback } from '@sentry/vue';
export default {
  mixins: [deviceInfos, tts],
  created() {
    this.contact = this.$store.getters.getUser.username;
  },
  computed: {
    getUserAgent() {
      return window.navigator.userAgent;
    },
    getVoices() {
      return JSON.stringify(
        this.voices.map((voice) => {
          return {
            lang: voice.lang,
            uri: voice.voiceURI,
            default: voice.default,
          };
        })
      );
    },
    getFilteredLocalStorage() {
      const vuex = JSON.parse(window.localStorage.getItem("pictalk-data"));
      return vuex;
    },
  },
  methods: {
    toggleDebugInfos() {
      this.showDebugInfos = !this.showDebugInfos;
    },
    async save() {
      if (
        this.title != "" ||
        this.contact != ""
      ) {
        try {
          this.loadingSave = true;
          const userFeedback = {
            name: this.email,
            email: this.email,
            comments: this.title + "\n" + this.description + "\n" + JSON.stringify(this.getFilteredLocalStorage),
          };
          captureUserFeedback(userFeedback);
          this.loadingSave = false;
          this.$parent.close();
          this.$buefy.toast.open({
            message: this.$t("FeedbackCreatedSucess"),
            type: "is-success",
          });
        } catch (err) {
          console.log(err);
          this.loadingSave = false;
          this.$buefy.toast.open({
            message: this.$t("SomeThingBadHappened"),
            type: "is-danger",
          });
        }
      } else {
        this.loadingSave = false;
        this.$buefy.toast.open({
          message: this.$t("RequiredInputs"),
          type: "is-danger",
        });
      }
    },
  },
  data() {
    return {
      voices: null,
      showDebugInfos: false,
      loadingSave: false,
      title: "",
      description: "",
      contact: "",
    };
  },
};
</script>
<style scoped>
div.media-content {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

.scrollableDiv {
  border: solid;
  border-width: 1px;
  border-color: #00000040;
  background-color: #f5f5f5;
  max-height: 20vh;
  overflow: scroll;
}

.headers {
  margin-bottom: 0.5rem;
  padding: 0.4rem;
}

.leftAlign {
  display: inline-block;
}

.centerImage {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marginAuto {
  margin: auto;
  display: block;
}
</style>
