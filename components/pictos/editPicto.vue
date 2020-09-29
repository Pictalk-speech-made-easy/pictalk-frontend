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
        <b-field label="Meaning">
          <b-input
            type="text"
            v-model="picto.meaning"
            placeholder="The text to be spoken"
            required
          ></b-input>
        </b-field>
        <b-field label="Folder">
          <b-checkbox v-model="picto.folder" true-value="1" false-value="0">
            is it a folder ?
          </b-checkbox>
        </b-field>
        <b-field label="Image">
          <b-select
            v-model="selectedOption"
            placeholder="Select a image uploader option"
            icon="image"
          >
            <option value="1">URL of the image</option>
            <option value="2">Upload the image</option>
          </b-select>
        </b-field>
        <br />
        <div v-if="selectedOption == 1">
          <b-field>
            <b-input
              placeholder="URL of the pictogram"
              type="link"
              v-model="collectionURL"
              icon="link"
            ></b-input>
          </b-field>
        </div>
        <div v-else>
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
              collectionId: this.$route.params.collectionId
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
              collectionId: this.$route.params.collectionId
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
