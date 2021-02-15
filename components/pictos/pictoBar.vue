<template>
  <div class="notification columns is-mobile" :style="cssVars">
    <div class="column is-narrow">
      <b-button type="is-danger" icon-right="delete" @click="eraseSpeech()" />
    </div>
    <div class="column is-narrow">
      <b-button
        type="is-danger"
        icon-right="backspace"
        @click="removeSpeech()"
      />
    </div>
    <div class="column" style="padding: 0">
      <div class="content">
        <miniPicto
          class
          v-for="picto in pictos"
          :key="picto.meaning"
          :path="picto.path"
          :meaning="picto.meaning"
        />
      </div>
    </div>
    <div class="column is-narrow">
      <b-button
        type="is-success"
        icon-right="message"
        @click="pictalk(pictos)"
      />
    </div>
    <div class="column is-narrow">
      <b-button
        type="is-info"
        icon-right="content-copy"
        @click="copyPictosToClipboard(pictos)"
      />
    </div>
  </div>
</template>
<script>
import miniPicto from "@/components/pictos/miniPicto";
export default {
  methods: {
    async copyPictosToClipboard(pictos) {
      const message = pictos.reduce(
        (acc, curr_val) => acc + " " + curr_val.meaning,
        ""
      );
      try {
        await this.$copyText(message);
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: `Successfully copied the pictos !`,
          position: "is-top-right",
          type: "is-success",
          hasIcon: true
        });
      } catch (e) {
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: `Could not copy the pictos`,
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true
        });
      }
    },
    delay(delayInms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    },
    async pictalk(pictos_obs) {
      var pictos = JSON.parse(JSON.stringify(pictos_obs));
      if ("speechSynthesis" in window) {
        var msg = new SpeechSynthesisUtterance();
        const message = pictos.reduce(
          (acc, curr_val) => acc + " " + curr_val.speech,
          ""
        );
        msg.text = message;
        let voices = window.speechSynthesis.getVoices();
        let voice = voices.filter(voice => voice.lang == this.getUserLang);

        let increment = 0;
        while (voice.length == 0 && increment != 10) {
          voices = window.speechSynthesis.getVoices();
          voice = voices.filter(voice => voice.lang == this.getUserLang);

          increment++;
          await this.delay(20);
        }
        await this.delay(200);
        voices = window.speechSynthesis.getVoices();
        voice = voices.filter(voice => voice.lang == this.getUserLang);

        if (voice.length !== 0) {
          msg.voice = voice[0];
        }
        window.speechSynthesis.speak(msg);
      } else {
        alert("Sorry, your browser doesn't support text to speech!");
      }
    },
    removeSpeech() {
      const pictoSpeech = this.$store.getters.getSpeech;
      if (pictoSpeech.length >= 1) {
        let adminMode=""
        if(this.$route.query.isAdmin){
          adminMode="?isAdmin=true";
        }
        this.$router.push(
          "/pictalk/" +
            this.$route.params.collectionId +
            "/" +
            pictoSpeech[pictoSpeech.length - 1].fatherId+adminMode
        );
      }
      this.$store.commit("removeSpeech");
    },
    eraseSpeech() {
      this.$store.commit("eraseSpeech");
      let adminMode=""
        if(this.$route.query.isAdmin){
          adminMode="?isAdmin=true";
        }
      this.$router.push("/pictalk"+adminMode);
    }
  },
  computed: {
    cssVars() {
      return {
        "--bg-color": this.collectionColor
      };
    },
    getUserLang() {
      const user = this.$store.getters.getUser;
      return user.language;
    }
  },
  components: {
    miniPicto: miniPicto
  },
  props: {
    pictos: {
      type: Array,
      required: true
    },
    collectionColor: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      adminMode: false
    };
  }
};
</script>
<style scoped>
.content {
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
}
.notification {
  background-color: var(--bg-color);
  position: relative;
  overflow: auto;
  padding: 0.25rem;
}
.nopadding {
  padding: 0.25rem;
}
</style>
