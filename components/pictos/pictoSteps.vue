<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p v-if="create" class="modal-card-title">
          {{ $t("CreatePictogram") }}
        </p>
        <p v-else class="modal-card-title">{{ $t("EditPictogram") }}</p>
      </header>
      <section class="modal-card-body">
        <b-steps
          v-model="activeStep"
          rounded
          animated
          :has-navigation="false"
          mobile-mode="compact"
          label-position="bottom"
        >
          <b-step-item step="1" :label="$t('Image')" clickable>
            <h1 class="title has-text-centered">
              {{ $t("Image") }}
            </h1>
            <div v-if="picto.path">
              <img
                class="mini-image"
                style
                :src="picto.path"
                crossorigin="anonymous"
              />
            </div>

            <b-field :label="$t('Search')">
              <b-input
                type="text"
                v-model="pictoSearch"
                :placeholder="$t('SearchNotice')"
                expanded
                :autofocus="true"
                @keyup.native.enter="pictoExtractImg(pictoSearch)"
              ></b-input>
              <b-button
                type="is-success"
                icon-right="magnify"
                @click="pictoExtractImg(pictoSearch)"
              />
            </b-field>
            <br />
            <div class="columns is-multiline is-mobile">
              <Webpicto
                class="
                  column
                  is-one-third-mobile
                  is-one-quarter-tablet
                  is-one-quarter-desktop
                  is-one-quarter-widescreen
                  is-one-fifth-fullhd
                  containing
                  has-background
                "
                v-for="picto in paginate"
                :key="picto.src"
                :webpicto="picto"
                @uploadfile="uploadfile($event)"
              />
            </div>
            <b-pagination
              v-if="images.length > imgLimit"
              :total="images.length"
              v-model="page"
              :range-before="1"
              :range-after="2"
              :order="'is-centered'"
              :rounded="true"
              :per-page="imgLimit"
              :icon-prev="'chevron-left'"
              :icon-next="'chevron-right'"
            >
            </b-pagination>
            <div>
              <b-field :label="$t('OrUploadYourOwn')">
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
                  <div class="tags">
                    <span class="tag is-primary is-medium">
                      {{ file.name }}
                      <button
                        class="delete is-medium"
                        type="button"
                        @click="discardfile()"
                      ></button>
                    </span>
                  </div>
                </section>
              </b-field>
            </div>
          </b-step-item>
          <b-step-item step="2" :label="$t('Speech')" clickable>
            <h1 class="title has-text-centered">
              {{ $t("Speech") }}
            </h1>
            <b-field :label="$t('Speech')">
              <b-input
                type="text"
                v-model="picto.speech"
                :placeholder="$t('SpeechNotice')"
                expanded
              ></b-input>
              <b-button
                type="is-success"
                icon-right="message"
                @click="pronounce(picto.speech)"
                >{{ $t("Try") }}</b-button
              >
            </b-field>
            <br />
            <br />
            <b-field :label="$t('Meaning')">
              <b-input
                type="text"
                v-model="picto.meaning"
                :placeholder="$t('MeaningNotice')"
                required
                expanded
              ></b-input>
            </b-field>
            <b-field :label="$t('Folder')">
              <b-checkbox
                type="is-success"
                v-model="picto.folder"
                true-value="1"
                false-value="0"
                >{{ $t("FolderNotice") }}
              </b-checkbox>
            </b-field>
          </b-step-item>
        </b-steps>
      </section>
      <footer class="modal-card-foot">
        <b-button class="button" type="button" @click="$parent.close()">{{
          $t("Close")
        }}</b-button>
        <div v-if="activeStep < 1">
          <b-button @click="nextStep()" icon-right="chevron-right" />
        </div>
        <div v-if="activeStep == 1">
          <b-button @click="previousStep()" icon-right="chevron-left" />
        </div>
        <div
          v-if="
            !create ||
            (picto.speech && picto.meaning && picto.folder && file.name)
          "
        >
          <b-button
            class="button is-primary"
            @click="
              onSubmitted(
                picto.speech,
                picto.meaning,
                picto.folder,
                file,
                highQuality
              )
            "
          >
            <div v-if="create">
              {{ $t("CreatePictogram") }}
            </div>
            <div v-else>{{ $t("EditPictogram") }}</div>
          </b-button>
        </div>
      </footer>
    </div>
  </form>
</template>
<script>
const jpegasus = require("jpegasus");
import axios from "axios";
import Webpicto from "@/components/pictos/webpicto";
export default {
  name: "PictoSteps",
  components: {
    Webpicto,
  },
  props: {
    picto: {
      type: Object,
      required: false,
      default: () => ({
        speech: "",
        meaning: "",
        folder: "0",
      }),
    },
    create: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  computed: {
    paginate() {
	  console.log((this.page - 1) * this.imgLimit, (this.page - 1) * this.imgLimit + this.imgLimit)
      return this.images.slice(
        (this.page - 1) * this.imgLimit,
        (this.page - 1) * this.imgLimit + this.imgLimit
      );
    },
  },
  data() {
    return {
      page: 1,
      imgLimit: 20,
      pictoSearch: "",
      activeStep: 0,
      languages: [],
      selectedOption: "",
      pictoSearch: "",
      file: {},
      highQuality: this.$t("StandardQuality"),
      size: 0,
      images: [],
    };
  },
  methods: {
    nextStep() {
      this.activeStep += 1;
    },
    previousStep() {
      this.activeStep -= 1;
    },
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
    async onSubmitted(speech, meaning, folder, file, highQuality) {
      if (meaning == "") {
        this.$buefy.notification.open({
          message: this.$t("MeaningEmpty"),
          type: "is-danger",
        });
      }
      if (this.create && !file.name) {
        this.$buefy.notification.open({
          message: this.$t("MissingImage"),
          type: "is-danger",
        });
      }
      if (speech == "") {
        speech = " ";
      }
      try {
        if (file.name) {
          if (!file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
            this.$buefy.notification.open({
              message: this.$t("ImageFiles"),
              type: "is-warning",
            });
            return;
          }

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
          if (this.create) {
            this.$store.dispatch("addPicto", {
              picto: {
                speech: speech,
                meaning: meaning,
                folder: parseInt(folder, 10),
                image: cfile,
                fatherId: parseInt(this.$route.params.fatherId, 10),
              },
              collectionId: parseInt(this.$route.params.collectionId, 10),
            });
            this.$buefy.notification.open({
              message: this.$t("CreatedPictogram"),
              type: "is-success",
            });
          } else {
            const res = await this.$store.dispatch("editPicto", {
              editedPicto: {
                id: this.picto.id,
                speech: speech,
                meaning: meaning,
                folder: folder,
                image: cfile,
                fatherId: parseInt(this.$route.params.fatherId, 10),
              },
              collectionId: parseInt(this.$route.params.collectionId, 10),
            });
            this.$buefy.notification.open({
              message: this.$t("EditedPictogram"),
              type: "is-success",
            });
          }
        } else {
          const res = await this.$store.dispatch("editPicto", {
            editedPicto: {
              id: this.picto.id,
              speech: speech,
              meaning: meaning,
              folder: folder,
              fatherId: parseInt(this.$route.params.fatherId, 10),
            },
            collectionId: parseInt(this.$route.params.collectionId, 10),
          });
        }

        this.$buefy.notification.open({
          message: this.$t("EditedPictogram"),
          type: "is-success",
        });
      } catch (err) {
        console.log(err);
        this.$buefy.notification.open({
          message: this.$t("SomeThingBadHappened"),
          type: "is-danger",
        });
      }
      this.$emit("close");
    },
    getUserLang() {
      const user = this.$store.getters.getUser;
      if (user.language) {
        return user.language.replace(/[^a-z]/g, "");
      } else {
        return this.$i18n.getLocaleCookie();
      }
    },
    async flickrExtractImg(pictoSearch) {
      if (!this.$config.flickrAPIKey) {
        return;
      }
      let responseData;
      try {
        responseData = (
          await axios.get(
            `https://www.flickr.com/services/rest/?sort=relevance&lang=${this.$store.getters.getUser.language}&method=flickr.photos.search&api_key=${this.$config.flickrAPIKey}&text=${pictoSearch}&safe_search=true&per_page=25&format=json&nojsoncallback=1`
          )
        ).data.photos.photo;
        responseData.forEach((photo) => {
          this.images.push({
            src: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
            alt: photo.title,
          });
        });
      } catch (err) {
        console.log(err);
        throw new Error("Flickr not available");
      }
    },
    async pictoExtractImg(pictoSearch) {
      this.images = [];
      let responseData;
      try {
        responseData = (
          await axios.get(
            `https://api.arasaac.org/api/pictograms/${this.getUserLang()}/search/${pictoSearch}`
          )
        ).data;
        for (let i = 0; i < responseData.length; i++) {
          this.images.push({
            src: `https://api.arasaac.org/api/pictograms/${responseData[i]["_id"]}?color=true&resolution=500&download=false`,
            alt: responseData[i]["keywords"][0]
              ? responseData[i]["keywords"][0]["keyword"]
              : responseData[i]["categories"][0],
          });
        }
        if (responseData.length < 3) {
          this.flickrExtractImg(pictoSearch);
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status == 404) {
          this.flickrExtractImg(pictoSearch);
        }
      }
    },
    uploadfile(file) {
      this.picto.speech = file.name
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");
      this.picto.meaning = file.name
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");
      this.file = file;
      this.activeStep = 1;
    },

    discardfile() {
      this.file = {};
      this.activeStep = 0;
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
.mini-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-height: 15rem;
}
.adminMenu {
  align-self: flex-end;
  margin: 0 auto;
  margin-top: auto;
}
</style>
