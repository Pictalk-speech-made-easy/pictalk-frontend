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
      <b-field :label="$t('FeedbackTitle')">
        <b-input v-model="title" required></b-input>
      </b-field>
      <b-field :label="$t('FeedbackContact')">
        <b-input v-model="contact" required></b-input>
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
      if (this.title != "" || this.contact != "" || this.description != "") {
        try {
          this.loadingSave = true;
          const res = await axios.post("/feedback", {
            title: this.title,
            description: this.description,
            contact: this.contact,
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
</style>
