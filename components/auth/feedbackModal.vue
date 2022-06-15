<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head" style="padding: 2%">
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
        <b-input v-model="title"></b-input>
      </b-field>
      <b-field :label="$t('FeedbackContact')">
        <b-input v-model="contact"></b-input>
      </b-field>
      <b-field :label="$t('FeedbackDescription')">
        <b-input type="textarea" v-model="description"></b-input>
      </b-field>
      <b-button class="is-text" @click="toggleDebugInfos()">{{
        $t("FeedbackToggle")
      }}</b-button>
      <div v-if="showDebugInfos">
        <h2 class="subtitle is-size-5">{{ $t("FeedbackDeviceInfo") }}</h2>
        <div class="scrollableDiv">
          {{ getDeviceInfo() }}
          {{ getUserAgent }}
        </div>
        <br />
        <h2 class="subtitle is-size-5">{{ $t("FeedbackVuex") }}</h2>
        <div class="scrollableDiv">
          {{ getVuex }}
        </div>
        <br />
        <h2 class="subtitle is-size-5">{{ $t("FeedbackVoices") }}</h2>
        <div class="scrollableDiv">
          {{ getVoices }}
        </div>
        <br />
      </div>
    </section>
    <footer class="modal-card-foot" style="padding: 2%">
      <div class="container">
        <b-button
          expanded
          class="is-info"
          icon-left="content-save"
          :loading="loadingSave"
          @click="save()"
          >{{ $t("Save") }}</b-button
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
    getVuex() {
      return window.localStorage.getItem("vuex");
    },
    getUserAgent() {
      return window.navigator.userAgent;
    },
    getVoices() {
      console.log(JSON.stringify(...this.voices));
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
  },
  methods: {
    toggleDebugInfos() {
      this.showDebugInfos = !this.showDebugInfos;
    },
    async save() {
      this.loadingSave = true;
      try {
        const res = await axios.post("/feedback", {
          title: this.title,
          description: this.description,
          contact: this.contact,
          vuex: localStorage.getItem("vuex"),
          voices: JSON.stringify(this.voices),
          deviceInfo: this.getDeviceInfo(),
        });
        this.loadingSave = false;
        this.$parent.close();
        this.$buefy.toast.open({
          message: this.$t("CreatedGroupSucess"),
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
  max-height: 20vh;
  overflow: scroll;
}
</style>
