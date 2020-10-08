<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Pictogram</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Speech">
          <b-input
            type="text"
            v-model="picto.speech"
            placeholder="The text to be displayed..."
            required
          ></b-input>
        </b-field>
        <b-button
          type="is-success"
          icon-right="message"
          @click="pronounce(picto.speech)"
        />
        <br />
        <br />
        <b-field label="Meaning">
          <b-input
            type="text"
            v-model="picto.meaning"
            placeholder="The text to be spoken"
            required
          ></b-input>
        </b-field>
        <b-field label="Folder">
          <b-checkbox v-model="picto.folder" true-value="1" false-value="0"
            >is it a folder ?</b-checkbox
          >
        </b-field>
        <br />
        <div>
          <section>
            <b-field class="file">
              <b-upload
                v-model="file"
                accept="image/*"
                native
                expanded
                required
              >
                <a class="button is-primary is-fullwidth">
                  <b-icon icon="upload"></b-icon>
                  <span>{{ file.name || "Click to upload" }}</span>
                </a>
              </b-upload>
            </b-field>
            <b-field>
              <b-upload
                v-model="file"
                accept="image/*"
                native
                drag-drop
                expanded
              >
                <section class="section">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon icon="upload" size="is-large"></b-icon>
                    </p>
                    <p>Drop your files here or click to upload</p>
                  </div>
                </section>
              </b-upload>
            </b-field>

            <div class="tags">
              <span class="tag is-primary">
                {{ file.name }}
                <button
                  class="delete is-small"
                  type="button"
                  @click="file = {}"
                ></button>
              </span>
            </div>
          </section>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button class="button" type="button" @click="$parent.close()"
          >Close</b-button
        >
        <b-button
          class="button is-primary"
          @click="onSubmitted(picto.speech, picto.meaning, picto.folder, file)"
          >Create</b-button
        >
      </footer>
    </div>
  </form>
</template>
<script>
const jpegasus = require("jpegasus");
export default {
  props: {
    picto: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedOption: "",
      file: {}
    };
  },
  methods: {
    delay(delayInms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    },
    async pronounce(speech) {
      if ("speechSynthesis" in window) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = speech;
        let voices = window.speechSynthesis.getVoices();
        let voice = voices.filter(voice => voice.lang == "fr-FR");
        let increment;
        while (voice.length == 0 && increment != 10) {
          voices = window.speechSynthesis.getVoices();
          voice = voices.filter(voice => voice.lang == "fr-FR");
          increment++;
          await this.delay(10);
        }
        voice = voices.filter(voice => voice.lang == "fr-FR");
        if (voice.length !== 0) {
          msg.voice = voice[0];
        } else {
          console.log("No voices found !");
        }
        window.speechSynthesis.speak(msg);
      } else {
        console.log("Your browser doesn't support speechSynthesis :(");
      }
    },
    async onSubmitted(speech, meaning, isfolder, file) {
      if (speech != "" && meaning != "") {
        try {
          if (file.name) {
            const cfile = await jpegasus.compress(file, {
              maxHeight: 500,
              maxWidth: 500,
              quality: 0.01
            });
            const res = await this.$store.dispatch("editPicto", {
              editedPicto: {
                id: this.picto.id,
                speech: speech,
                meaning: meaning,
                folder: isfolder,
                image: cfile,
                fatherId: parseInt(this.$route.params.fatherId, 10)
              },
              collectionId: parseInt(this.$route.params.collectionId, 10)
            });
          } else {
            const res = await this.$store.dispatch("editPicto", {
              editedPicto: {
                id: this.picto.id,
                speech: speech,
                meaning: meaning,
                folder: isfolder,
                fatherId: parseInt(this.$route.params.fatherId, 10)
              },
              collectionId: parseInt(this.$route.params.collectionId, 10)
            });
          }
          this.$buefy.notification.open({
            message: "The picto was uploaded flawlessly !",
            type: "is-success"
          });
          this.$parent.close();
        } catch (ex) {
          console.log(ex);
          this.$buefy.notification.open({
            message: "Something bad happened...",
            type: "is-danger"
          });
        }
      }
    }
  }
};
</script>
