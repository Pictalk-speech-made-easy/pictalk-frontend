<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="close"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">{{ $t("Feedback") }}</p>
    </header>
    <section class="modal-card-body">
      <b-notification :closable="false">
        <div class="subtitle">
        {{ $t("FeedbackSocials")}}
        </div>
        <div class="columns is-centered is-mobile whitebg rounded">
        <div class="column centerImage">
          <a href="https://www.instagram.com/pictalk_speech_made_easy/">
            <b-image
              style="height: 42px"
              lazy
              :responsive="false"
              :srcset="require('@/assets/instagram.webp').srcSet"
              alt="Instagram"
              custom-class="imgpixelslimitvw portrait grayscale"
            />
          </a>
        </div>
        <div class="column centerImage">
          <a href="https://www.facebook.com/profile.php?id=100086626416882">
            <b-image
              style="height: 42px"
              lazy
              :responsive="false"
              :srcset="require('@/assets/facebook.webp').srcSet"
              alt="Facebook"
              custom-class="imgpixelslimitvw portrait grayscale"
            />
          </a>
        </div>
        <div class="column centerImage">
          <a href="https://www.linkedin.com/company/88954834/">
            <b-image
              style="height: 42px"
              lazy
              :responsive="false"
              :srcset="require('@/assets/linkedin.webp').srcSet"
              alt="Linkedin"
              custom-class="imgpixelslimitvw portrait grayscale"
            />
          </a>
        </div>
        </div>
      </b-notification>
      <b-field :label="$t('FeedbackContact')">
        <b-input v-model="contact" required></b-input>
      </b-field>
      <b-field :label="$t('FeedbackTitle')">
        <b-input v-model="title" required></b-input>
      </b-field>
      <b-field :label="$t('FeedbackType')">
        <div class="columns is-multiline is-mobile">
          <b-select
            class="column"
            style="flex-grow: 0; padding-bottom: 0.25rem"
            v-model="action"
            required
          >
            <optgroup :label="$t('FeedbackActionSelectPictos')">
              <option value="creation">
                {{ $t("FeedbackActionSelectPictosValuesCreation") }}
              </option>
              <option value="modification">
                {{ $t("FeedbackActionSelectPictosValuesModification") }}
              </option>
              <option value="copy">
                {{ $t("FeedbackActionSelectPictosValuesCopy") }}
              </option>
              <option value="print">
                {{ $t("FeedbackActionSelectPictosValuesPrint") }}
              </option>
            </optgroup>

            <optgroup :label="$t('FeedbackActionSelectInscription')">
              <option value="inscription">
                {{ $t("FeedbackActionSelectInscriptionValuesInscription") }}
              </option>
              <option value="tutorial">
                {{ $t("FeedbackActionSelectInscriptionValuesTutorial") }}
              </option>
            </optgroup>

            <optgroup :label="$t('FeedbackActionSelectVoices')">
              <option value="voice">
                {{ $t("FeedbackActionSelectVoicesValuesVoice") }}
              </option>
              <option value="language">
                {{ $t("FeedbackActionSelectVoicesValuesLanguage") }}
              </option>
            </optgroup>
            <optgroup :label="$t('FeedbackActionSelectOther')">
              <option value="other">
                {{ $t("FeedbackActionSelectOtherValuesOther") }}
              </option>
            </optgroup>
          </b-select>
          <div
            class="column"
            style="
              flex-grow: 0;
              display: flex;
              align-self: end;
              padding-top: 0.25rem;
            "
          >
            <p style="padding-right: 0.25rem; min-width: 165px">
              {{ $t("FeedbackBlocking") }}
            </p>
            <b-checkbox v-model="blocking" required></b-checkbox>
          </div>
        </div>
      </b-field>
      <b-field :label="$t('FeedbackDescription')">
        <b-input type="textarea" v-model="description" lazy required></b-input>
      </b-field>
      <b-field :label="$t('FeedbackEvolution')">
        <b-input type="textarea" v-model="evolution"></b-input>
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
        <b-button
          style="
            width: 50%;
            display: flex;
            margin-right: auto;
            margin-left: auto;
          "
          class="is-info"
          icon-right="check"
          :loading="loadingSave"
          @click="save()"
          >{{ $t("Send") }}</b-button
        >
      </div>
    </footer>
  </div>
</template>
<script >
import deviceInfos from "@/mixins/deviceInfos";
import tts from "@/mixins/tts";
import axios from "axios";
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
      const vuex = JSON.parse(window.localStorage.getItem("vuex"));
      delete vuex.collections;
      delete vuex.pictos;
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
        this.contact != "" ||
        this.description != "" ||
        this.action != "" ||
        this.blocking != ""
      ) {
        try {
          this.loadingSave = true;
          const res = await axios.post("/feedback", {
            title: this.title,
            description: this.description,
            contact: this.contact,
            blocking: JSON.stringify(this.blocking),
            evolution: this.evolution,
            action: this.action,
            vuex: JSON.stringify(this.getFilteredLocalStorage),
            voices: JSON.stringify(this.getVoices),
            deviceInfos: this.getDeviceInfo(),
          });
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
      action: "other",
      blocking: false,
      evolution: "",
    };
  },
};
</script>
<style scoped>
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
</style>
