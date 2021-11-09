<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t("CreatePictogram") }}</p>
      </header>
      <section class="modal-card-body">
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
        <b-tabs>
          <b-tab-item label="Localy">
            <template>
              <b-field :label="$t('Speech')">
                <b-input
                  type="text"
                  v-model="pictoSpeech"
                  :placeholder="$t('SpeechNotice')"
                ></b-input>
              </b-field>
              <b-button
                type="is-success"
                icon-right="message"
                @click="pronounce(pictoSpeech)"
              />
              <br />
              <br />
              <b-field :label="$t('Meaning')">
                <b-input
                  type="text"
                  v-model="pictoMeaning"
                  :placeholder="$t('MeaningNotice')"
                  required
                ></b-input>
              </b-field>
              <b-field :label="$t('Folder')">
                <b-checkbox v-model="isFolder" true-value="1" false-value="0">{{
                  $t("FolderNotice")
                }}</b-checkbox>
              </b-field>
              <br />
              <div>
                <section>
                  <b-field class="file">
                    <b-upload
                      v-model="file"
                      accept="image/png, image/jpeg, image/gif, image/jpg"
                      native
                      expanded
                      required
                    >
                      <a class="button is-primary is-fullwidth">
                        <b-icon icon="upload"></b-icon>
                        <span>{{ file.name || $t("ClickToUpload") }}</span>
                      </a>
                    </b-upload>
                  </b-field>
                  <b-field>
                    <b-upload
                      v-model="file"
                      accept="image/png, image/jpeg, image/gif, image/jpg"
                      native
                      drag-drop
                      expanded
                    >
                      <section class="section">
                        <div class="content has-text-centered">
                          <p>
                            <b-icon icon="upload" size="is-large"></b-icon>
                          </p>
                          <p>
                            {{ $t("DropFiles") }}
                          </p>
                        </div>
                      </section>
                    </b-upload>
                  </b-field>
                  <b-field>
                    <b-switch
                      v-model="highQuality"
                      :false-value="$t('StandardQuality')"
                      :true-value="$t('HighQuality')"
                    >
                      {{ highQuality }}
                    </b-switch>
                  </b-field>
                </section>
              </div>
            </template></b-tab-item
          >

          <b-tab-item label="from ARASAAC">
            <template id="app">
              <div>
                <b-field :label="$t('Speech')">
                  <b-input
                    type="text"
                    v-model="pictoSpeech"
                    :placeholder="$t('SpeechNotice')"
                  ></b-input>
                </b-field>
                <b-button
                  type="is-success"
                  icon-right="message"
                  @click="pronounce(pictoSpeech)"
                />
                <br />
                <br />
                <b-field :label="$t('Meaning')">
                  <b-input
                    type="text"
                    v-model="pictoMeaning"
                    :placeholder="$t('MeaningNotice')"
                    required
                  ></b-input>
                </b-field>
                <b-field :label="$t('Folder')">
                  <b-checkbox
                    v-model="isFolder"
                    true-value="1"
                    false-value="0"
                    >{{ $t("FolderNotice") }}</b-checkbox
                  >
                </b-field>
                <br />
                <b-field :label="$t('Search')">
                  <b-input
                    type="text"
                    v-model="pictoSearch"
                    :placeholder="$t('SearchNotice')"
                  ></b-input>
                </b-field>
                <b-button
                  type="is-success"
                  icon-right="magnify"
                  @click="pictoExtractImg(pictoSearch)"
                />

                <br />
                <br />

                <div class="columns is-multiline is-mobile">
                  <div
                    class="
                      column
                      is-one-third-mobile
                      is-one-quarter-tablet
                      is-one-quarter-desktop
                      is-one-quarter-widescreen
                      is-one-fifth-fullhd
                      containing has-background
                      "
                    v-for="(value, index) in this.images"
                    :key='index'
                  >
                    <figure class="image is-128x128">
                      <img class="image"
                      :src="value" />
                    </figure>
                  </div>
                </div>
              </div>
            </template>
          </b-tab-item>
        </b-tabs>
      </section>

      <footer class="modal-card-foot">
        <b-button class="button" type="button" @click="$parent.close()">{{
          $t("Close")
        }}</b-button>
        <b-button
          class="button is-primary"
          @click="
            onSubmitted(pictoSpeech, pictoMeaning, isFolder, file, highQuality)
          "
          >{{ $t("Create") }}</b-button
        >
      </footer>
    </div>
  </form>
</template>
<script>
const jpegasus = require("jpegasus");
import axios from "axios";

export default {
  created() {
    const allVoicesObtained = new Promise(function (resolve, reject) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", function () {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        });
      }
    });
    allVoicesObtained.then((voices) => (this.languages = voices));
  },
  data() {
    return {
      selectedOption: "",
      pictoSpeech: "",
      pictoMeaning: "",
      pictoSearch: "",
      isFolder: "0",
      file: {},
      highQuality: this.$t("StandardQuality"),
      size: 0,
      images: [],
    };
  },

  methods: {
    async pronounce(speech) {
      if ("speechSynthesis" in window) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = speech;
        let voice = this.languages.filter(
          (voice) => voice.lang == this.getUserLang
        );
        if (voice.length !== 0) {
          msg.voice = voice[0];
        }
        window.speechSynthesis.speak(msg);
      } else {
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("NoVoicesFound"),
          position: "is-top-right",
          type: "is-warning",
          hasIcon: true,
        });
      }
    },
    async onSubmitted(speech, meaning, isfolder, file, highQuality) {
      if (meaning != "" && file.name) {
        if (!file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
          this.$buefy.notification.open({
            message: this.$t("ImageFiles"),
            type: "is-warning",
          });
          return;
        }
        if (speech == "") {
          speech = " ";
        }
        try {
          const myNewFile = new File(
            [file],
            file.name.substr(0, file.name.lastIndexOf(".")) + ".jpeg",
            { type: file.type }
          );
          let quality;
          quality =
            highQuality == this.$t("HighQuality")
              ? (quality = 0.1)
              : (quality = 0.01);
          const cfile = await jpegasus.compress(myNewFile, {
            maxHeight: 500,
            maxWidth: 500,
            quality: quality,
          });
          this.$store.dispatch("addPicto", {
            picto: {
              speech: speech,
              meaning: meaning,
              folder: parseInt(isfolder, 10),
              image: cfile,
              fatherId: parseInt(this.$route.params.fatherId, 10),
            },
            collectionId: parseInt(this.$route.params.collectionId, 10),
          });
          this.$buefy.notification.open({
            message: this.$t("CreatedPictogram"),
            type: "is-success",
          });
          this.$parent.close();
        } catch (ex) {
          console.log(ex);
          this.$buefy.notification.open({
            message: this.$t("SomeThingBadHappened"),
            type: "is-danger",
          });
        }
      } else {
        this.$buefy.notification.open({
          message: this.$t("ServerOffline"),
          type: "is-danger",
        });
      }
    },
    getUserLang() {
      const user = this.$store.getters.getUser;
      const lang = user.language;
      const language2char = lang.substring(0, 2);
      return language2char;
    },
    async pictoExtractImg(pictoSearch) {
      let results = [];
      let src;
      let alt;
      this.images = await axios
        .get(
          `https://api.arasaac.org/api/pictograms/${this.getUserLang()}/search/${pictoSearch}`,
          { headers: {} }
        )
        .then((response) => {
          this.size = response.data.length;
          for (let index = 0; index < this.size; index++) {
            src = `https://api.arasaac.org/api/pictograms/${response.data[index]["_id"]}?color=true&resolution=500&download=false`;
            alt = response.data[index]["keywords"][0]["keyword"];
            results.push(
              src
            );
            console.log(response.data[index]["keywords"][0]["keyword"]);
          }
          console.log(results);
          return results;
        });
    },
  },
};
</script>

<style scoped>
.has-background {
	border-radius: 3px;
	-webkit-box-shadow: 0px 0px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
	-moz-box-shadow: 0px 0px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
	box-shadow: 0px 0px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.containing {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.image {
	margin: auto;
}
.adminMenu {
	align-self: flex-end;
	margin: 0 auto;
	margin-top: auto;
}
</style>