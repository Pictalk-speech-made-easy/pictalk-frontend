<template>
  <form action>
    <div class="modal-card">
      <header class="modal-card-head">
        <b-button
          class="button"
          type="is-danger"
          icon-left="close"
          @click="$parent.close()"
        />
        <p v-if="create && isPicto" align="center" class="modal-card-title">
          {{ $t("CreatePictogram") }}
        </p>
        <p v-if="!create && isPicto" align="center" class="modal-card-title">
          {{ $t("EditPictogram") }}
        </p>
        <p v-if="create && !isPicto" align="center" class="modal-card-title">
          {{ $t("CreateCollection") }}
        </p>
        <p v-if="!create && !isPicto" align="center" class="modal-card-title">
          {{ $t("EditCollection") }}
        </p>
      </header>
      <section id="search" class="modal-card-body scrolling">
        <b-steps
          v-model="activeStep"
          rounded
          animated
          :has-navigation="false"
          mobile-mode="compact"
          label-position="bottom"
        >
          <b-step-item clickable step="1" :label="$t('Image')">
            <div v-if="picto.path">
              <img
                class="mini-image"
                style
                :src="picto.path"
                :alt="picto.meaning"
                crossorigin="anonymous"
              />
            </div>

            <b-field :label="$t('Search')">
              <b-input
                data-cy="picto-steps-search-input"
                type="text"
                v-model="pictoSearch"
                :placeholder="$t('SearchNotice')"
                expanded
                :autofocus="true"
                @keyup.native.enter="pictoExtractImg(pictoSearch)"
              ></b-input>
              <b-button
                data-cy="picto-steps-search-button"
                focused
                type="is-info"
                icon-right="magnify"
                :loading="loading"
                @click="pictoExtractImg(pictoSearch)"
              />
            </b-field>
            <br id="searchText" />
            <div class="columns is-multiline is-mobile">
              <Webpicto
                class="column is-one-third-mobile is-one-quarter-tablet is-2-desktop is-2-widescreen is-2-fullhd containing has-background"
                style="aspect-ratio: 1/1"
                v-for="picto in paginate"
                :key="picto.src"
                :webpicto="picto"
                @uploadfile="uploadfile($event, picto.pictohubId)"
              />
            </div>

            <b-pagination
              v-if="images.length > imgLimit"
              :total="images.length"
              v-model="page"
              :range-before="0"
              :range-after="0"
              :order="'is-centered'"
              :rounded="true"
              :per-page="imgLimit"
              :icon-prev="'chevron-left'"
              :icon-next="'chevron-right'"
            >
            </b-pagination>
            <b-notification
              v-if="this.noResults"
              auto-close
              :duration="5000"
              type="is-warning is-light"
              has-icon
              aria-close-label="Close notification"
              role="alert"
            >
              {{ $t("NoResults") }}{{ this.pictoSearch }}
            </b-notification>
            <b-button
              rounded
              expanded
              v-if="!moreImages"
              type="is-info is-light is-text"
              icon-right="magnify"
              :focused="loading"
              :loading="loading"
              @click="webImages(pictoSearch)"
            >
              {{ $t("MoreImages") }}
            </b-button>
            <div>
              <br />
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
                      @input="uploadfile(file)"
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
                  <div v-if="file.name" class="tags">
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
              <b-dropdown
                aria-role="list"
                v-if="getAllUserLanguages.length > 1"
              >
                <template #trigger="{ active }">
                  <b-button>{{ getEmoji(languageSelectorSpeech) }}</b-button>
                </template>

                <b-dropdown-item
                  v-for="language in getAllUserLanguages"
                  :key="language + Math.random()"
                  aria-role="listitem"
                  @click="switchSpeechLanguage(language)"
                  >{{ getEmoji(language) }}</b-dropdown-item
                >
              </b-dropdown>
            </h1>
            <b-field :label="$t('Speech')">
              <b-input
                data-cy="picto-steps-speech-input"
                type="text"
                v-model="picto.speech[languageSelectorSpeech]"
                :placeholder="$t('SpeechNotice')"
                expanded
                :disabled="silent"
              ></b-input>
              <b-button
                v-if="!isPicto"
                :type="silent ? 'is-primary' : 'is-primary is-light'"
                icon-right="volume-mute"
                @click="silent = !silent"
              ></b-button>
              <b-button
                :disabled="silent"
                type="is-success"
                icon-right="volume-high"
                @click="
                  pronounce(
                    picto.speech[languageSelectorSpeech],
                    languageSelectorSpeech,
                    getVoiceURIFromLanguage(languageSelectorSpeech),
                    pitch,
                    rate
                  )
                "
              ></b-button>
            </b-field>
            <b-field :label="$t('Meaning')">
              <b-input
                data-cy="picto-steps-meaning-input"
                type="text"
                v-model="picto.meaning[languageSelectorSpeech]"
                :placeholder="$t('MeaningNotice')"
                expanded
              ></b-input>
            </b-field>
            <b-field :label="$t('Color')">
              <b-input
                type="color"
                v-model="picto.color"
                :placeholder="$t('ColorNotice')"
                required
              ></b-input>
            </b-field>
          </b-step-item>
          <b-step-item step="3" :label="$t('Options')" clickable>
            <h1 class="title has-text-centered">
              {{ $t("Options") }}
            </h1>
            <canvas
              id="canvas"
              class="optionImage"
              :style="rendered ? '' : 'display:none'"
            ></canvas>
            <img :src="dynamicSrc" style="display: none" id="image" />
            <img v-if="!rendered" :src="dynamicSrc" class="optionImage" />
            <b-field style="padding-top: 0.8rem">
              <b-switch
                v-model="options.cross.enabled"
                type="is-success"
                class="optionSwitch"
                >{{ $t("Negation") }}</b-switch
              >
              <b-switch
                v-model="options.arrow.enabled"
                type="is-success"
                class="optionSwitch"
                >{{ $t("Time") }}</b-switch
              >
              <b-switch
                v-model="options.plus.enabled"
                type="is-success"
                class="optionSwitch"
                >{{ $t("Plural") }}</b-switch
              >
            </b-field>
            <b-field>
              <b-button
                icon-left="refresh"
                :label="$t('Rotation')"
                @click="rotateImg()"
              ></b-button>
              <b-button
                icon-left="refresh"
                :label="$t('Rotation')"
                @click="removeBackground()"
              ></b-button>
            </b-field>

            <div class="columns is-multiline is-mobile">
              <div
                v-if="options.cross.enabled"
                class="column is-full-mobile optionSection"
              >
                <p align="center" class="modal-card-title">
                  {{ $t("Negation") }}
                </p>
                <b-field :label="$t('Size')">
                  <b-slider
                    v-model="options.cross.scale"
                    :min="20"
                    :max="300"
                    :step="10"
                    ticks
                    :custom-formatter="(val) => val + '%'"
                  ></b-slider>
                </b-field>
                <b-field :label="$t('Color')">
                  <b-input
                    lazy
                    type="color"
                    v-model="options.cross.color"
                    :placeholder="$t('ColorNotice')"
                    required
                  ></b-input>
                </b-field>
                <b-field :label="$t('Offsets')">
                  <b-slider
                    v-model="options.cross.Xoffset"
                    :custom-formatter="(val) => val + '%'"
                    rounded
                    :step="5"
                    ticks
                    style="width: 45%; margin-right: 5%"
                  ></b-slider>
                  <b-slider
                    v-model="options.cross.Yoffset"
                    :custom-formatter="(val) => val + '%'"
                    rounded
                    :step="5"
                    ticks
                    style="width: 45%"
                  ></b-slider>
                </b-field>
              </div>
              <div
                v-if="options.arrow.enabled"
                class="column is-full-mobile optionSection"
              >
                <p align="center" class="modal-card-title">
                  {{ $t("Time") }}
                </p>
                <div class="block">
                  <b-radio v-model="options.arrow.shift" :native-value="0">
                    {{ $t("Past") }}
                  </b-radio>
                  <b-radio v-model="options.arrow.shift" :native-value="1">
                    {{ $t("Future") }}
                  </b-radio>
                </div>
                <b-field :label="$t('Size')">
                  <b-slider
                    v-model="options.arrow.scale"
                    :min="20"
                    :max="200"
                    :step="10"
                    ticks
                    :custom-formatter="(val) => val + '%'"
                  ></b-slider>
                </b-field>
                <b-field :label="$t('BorderColor')">
                  <b-input
                    lazy
                    type="color"
                    v-model="options.arrow.color"
                    :placeholder="$t('ColorNotice')"
                    required
                    style="width: 45%; margin-right: 5%"
                  ></b-input>
                  <b-input
                    lazy
                    type="color"
                    v-model="options.arrow.border"
                    :placeholder="$t('ColorNotice')"
                    required
                    style="width: 45%"
                  ></b-input>
                </b-field>
                <b-field :label="$t('Offsets')">
                  <b-slider
                    v-model="options.arrow.Xoffset"
                    :custom-formatter="(val) => val + '%'"
                    rounded
                    :step="5"
                    ticks
                    style="width: 45%; margin-right: 5%"
                  ></b-slider>
                  <b-slider
                    v-model="options.arrow.Yoffset"
                    :custom-formatter="(val) => val + '%'"
                    rounded
                    :step="5"
                    ticks
                    style="width: 45%"
                  ></b-slider>
                </b-field>
              </div>
              <div
                v-if="options.plus.enabled"
                class="column is-full-mobile optionSection"
              >
                <p align="center" class="modal-card-title">
                  {{ $t("Plural") }}
                </p>
                <div class="block">
                  <b-radio v-model="options.plus.shift" :native-value="0">
                    {{ $t("Left") }}
                  </b-radio>
                  <b-radio v-model="options.plus.shift" :native-value="1">
                    {{ $t("Right") }}
                  </b-radio>
                </div>
                <b-field :label="$t('Size')">
                  <b-slider
                    v-model="options.plus.scale"
                    :min="20"
                    :max="200"
                    :step="10"
                    ticks
                    :custom-formatter="(val) => val + '%'"
                  ></b-slider>
                </b-field>
                <b-field :label="$t('BorderColor')">
                  <b-input
                    lazy
                    type="color"
                    v-model="options.plus.color"
                    :placeholder="$t('ColorNotice')"
                    required
                    style="width: 45%; margin-right: 5%"
                  ></b-input>
                  <b-input
                    lazy
                    type="color"
                    v-model="options.plus.border"
                    :placeholder="$t('ColorNotice')"
                    required
                    style="width: 45%"
                  ></b-input>
                </b-field>
                <b-field :label="$t('Offsets')">
                  <b-slider
                    v-model="options.plus.Xoffset"
                    :custom-formatter="(val) => val + '%'"
                    rounded
                    :step="5"
                    ticks
                    style="width: 45%; margin-right: 5%"
                  ></b-slider>
                  <b-slider
                    v-model="options.plus.Yoffset"
                    :custom-formatter="(val) => val + '%'"
                    rounded
                    :step="5"
                    ticks
                    style="width: 45%"
                  ></b-slider>
                </b-field>
              </div>
            </div>
          </b-step-item>
        </b-steps>
      </section>
      <footer class="modal-card-foot">
        <div class="container">
          <div class="columns is-mobile is-full">
            <div class="column is-one-quarter">
              <b-button
                @click="previousStep()"
                :disabled="activeStep == 0"
                class="button center"
                type="button"
                icon-right="chevron-left"
              />
            </div>
            <div class="column is-half">
              <b-button
                data-cy="picto-steps-create-edit-pictogram-button"
                expanded
                v-if="isPicto"
                :disabled="
                  !(
                    Object.values(picto.meaning).length &&
                    Object.values(picto.speech).length
                  ) ||
                  (!this.file.name && create)
                "
                :class="classCreateOrEdit"
                :icon-right="iconPictoOrEdit"
                :loading="creationLoading"
                @click="onSubmitted(false)"
              >
              </b-button>
              <b-button
                data-cy="picto-steps-create-edit-collection-button"
                expanded
                v-if="!isPicto"
                :class="classCreateOrEdit"
                :disabled="
                  !Object.values(picto.meaning).length ||
                  (!this.file.name && create)
                "
                :icon-right="iconCollectionOrEdit"
                :loading="creationLoading"
                @click="onSubmitted(true)"
              >
              </b-button>
            </div>
            <div class="column is-one-quarter">
              <b-button
                class="button center"
                type="button"
                :disabled="activeStep == 2"
                @click="nextStep()"
                icon-right="chevron-right"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </form>
</template>
<script >
const jpegasus = require("jpegasus");
import axios from "axios";
import Webpicto from "@/components/pictos/webpicto";
import lang from "@/mixins/lang";
import emoji from "@/mixins/emoji";
import tts from "@/mixins/tts";
import deviceInfos from "@/mixins/deviceInfos";

export default {
  mixins: [emoji, lang, tts, deviceInfos],
  name: "PictoSteps",
  components: {
    Webpicto,
  },
  props: {
    picto: {
      type: Object,
      required: false,
      default: () => ({
        speech: new Object(),
        meaning: new Object(),
        color: "#ffffff00",
      }),
    },
    create: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isPicto: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    dynamicSrc() {
      if (this.file.name) {
        return window.webkitURL.createObjectURL(this.file);
      }
    },
    classCreateOrEdit() {
      return this.create ? "is-success" : "is-info";
    },
    iconPictoOrEdit() {
      return this.create ? "image" : "image-edit";
    },
    iconCollectionOrEdit() {
      return this.create ? "folder-table" : "folder-edit";
    },
    paginate() {
      return this.images.slice(
        (this.page - 1) * this.imgLimit,
        (this.page - 1) * this.imgLimit + this.imgLimit
      );
    },
    getAllUserLanguages() {
      return Object.keys(this.$store.getters.getUser.languages);
    },
  },
  data() {
    return {
      page: 1,
      pictohubId: undefined,
      imgLimit: 24,
      pictoSearch: "",
      activeStep: 0,
      languages: [],
      languageSelectorSpeech: "",
      selectedOption: "",
      pictoSearch: "",
      file: {},
      highQuality: this.$t("StandardQuality"),
      size: 0,
      images: [],
      loading: false,
      creationLoading: false,
      moreImages: true,
      noResults: false,
      voices: [],
      voiceURI: "",
      voiceURIs: [],
      silent: false,
      rendered: false,
      degree: 0,
      options: {
        arrow: {
          enabled: false,
          scale: 100,
          shift: 0,
          Xoffset: 0,
          Yoffset: 0,
          color: "#000000",
          border: "#ffffff",
        },
        plus: {
          enabled: false,
          scale: 100,
          shift: 1,
          Xoffset: 0,
          Yoffset: 0,
          color: "#000000",
          border: "#ffffff",
        },
        cross: {
          enabled: false,
          scale: 100,
          Xoffset: 50,
          Yoffset: 50,
          color: "#ff0000",
        },
      },
    };
  },
  watch: {
    page: function () {
      let element = document.getElementById("search");
      element.scrollTop = 0;
    },
    options: {
      handler() {
        this.draw();
      },
      deep: true,
    },
  },
  async created() {
    this.languageSelectorSpeech = this.getUserLang;
    if (this.picto.image) {
      try {
        const response = await fetch(this.picto.image);
        const blob = await response.blob();
        this.file = new File([blob], "edited.jpg", { type: blob.type });
        this.file.url = this.picto.image;
      } catch (error) {
        console.log(error);
      }
    }
  },
  methods: {
    getVoiceURIFromLanguage(language) {
      let voiceURI =
        this.$store.getters.getUser.languages[language][this.getDeviceInfo()]
          ?.voiceURI;
      if (!voiceURI) {
        voiceURI = this.voices.filter((voice) => voice.lang.includes(language));
      }
      return voiceURI;
    },
    switchSpeechLanguage(language) {
      this.languageSelectorSpeech = language;
    },
    nextStep() {
      this.activeStep += 1;
    },
    previousStep() {
      this.activeStep -= 1;
    },
    async onSubmitted(isCollection = false) {
      this.creationLoading = true;
      let cfile;
      if (this.rendered) {
        this.file = this.canvasToFile();
      }
      if (
        Object.values(this.picto.meaning).length == 0 ||
        !this.picto.meaning[this.getUserLang]
      ) {
        this.$buefy.toast.open({
          message: this.$t("MeaningEmpty"),
          type: "is-danger",
        });
        this.creationLoading = false;
        return;
      }
      if (this.create && !this.file.name) {
        this.$buefy.toast.open({
          message: this.$t("MissingImage"),
          type: "is-danger",
        });
        this.creationLoading = false;
        return;
      }
      try {
        if (this.file.name) {
          if (!this.file.name.match(/\.(jpeg|png|gif|jpg|JPEG|JPG|PNG)$/)) {
            this.$buefy.toast.open({
              message: this.$t("ImageFiles"),
              type: "is-warning",
            });
            return;
          }

          const myNewFile = new File(
            [this.file],
            this.file.name.substr(0, this.file.name.lastIndexOf(".")) + ".jpg",
            { type: this.file.type }
          );
          cfile = await jpegasus.compress(myNewFile, {
            maxHeight: 300,
            maxWidth: 300,
            quality: 0.15,
          });
        }
        this.getAllUserLanguages
          .map((languages) => languages.replace(/[^a-z]/g, ""))
          .map(async (language) => {
            if (this.silent) {
              this.picto.speech[language] = "";
            }
          });
        this.picto.meaning[this.getUserLang] =
          this.picto.meaning[this.getUserLang].trim();
        this.picto.speech[this.getUserLang] = this.picto.speech[
          this.getUserLang
        ]
          ? this.picto.speech[this.getUserLang].trim()
          : "";
        if (this.create || this.traductionNeeded()) {
          await Promise.all(
            this.getAllUserLanguages
              .map((languages) => languages.replace(/[^a-z]/g, ""))
              .map(async (language) => {
                return new Promise(async (resolve, reject) => {
                  if (
                    language == this.getUserLang ||
                    this.picto.meaning[language] ||
                    this.picto.speech[language] ||
                    (!this.picto.speech[this.getUserLang] &&
                      !this.picto.meaning[this.getUserLang])
                  ) {
                    resolve();
                  } else {
                    if (
                      this.picto.meaning[this.getUserLang] ==
                      this.picto.speech[this.getUserLang]
                    ) {
                      try {
                        this.picto.meaning[language] = this.picto.speech[
                          language
                        ] = (
                          await axios.post("/translation/", {
                            text: this.picto.meaning[this.getUserLang],
                            targetLang: language,
                            sourceLang: this.getUserLang,
                          })
                        )?.data.translation;
                        resolve();
                      } catch (error) {
                        reject(error);
                      }
                    } else {
                      if (this.picto.meaning[this.getUserLang]) {
                        try {
                          this.picto.meaning[language] = (
                            await axios.post("/translation/", {
                              text: this.picto.meaning[this.getUserLang],
                              targetLang: language,
                              sourceLang: this.getUserLang,
                            })
                          )?.data.translation;
                        } catch (error) {
                          reject(error);
                        }
                      } else {
                        this.picto.meaning[language] = "";
                      }
                      if (this.picto.speech[this.getUserLang]) {
                        try {
                          this.picto.speech[language] = (
                            await axios.post("/translation/", {
                              text: this.picto.meaning[this.getUserLang],
                              targetLang: language,
                              sourceLang: this.getUserLang,
                            })
                          )?.data.translation;
                        } catch (error) {
                          reject(error);
                        }
                      } else {
                        this.picto.speech[language] = "";
                      }
                      resolve();
                    }
                  }
                });
              })
          );
        }
        if (Object.keys(this.picto.speech).length === 0) {
          this.picto.speech = { ...this.picto.meaning };
          for (let key of Object.keys(this.picto.speech)) {
            this.picto.speech[`${key}`] = "a";
          }
        }
        if (this.create) {
          let pictoOrCollection = await this.$store.dispatch(
            isCollection ? "addCollection" : "addPicto",
            {
              collection: isCollection,
              speech: this.picto.speech,
              meaning: this.picto.meaning,
              color: this.picto.color,
              share: 1,
              fatherCollectionId: parseInt(
                this.$route.params.fatherCollectionId,
                10
              ),
              image: cfile,
              pictohubId: this.pictohubId,
            }
          );
          this.$buefy.toast.open({
            message: isCollection
              ? this.$t("CreatedCollection")
              : this.$t("CreatedPictogram"),
            type: "is-success",
          });
          $nuxt.$emit("resyncPictoList");
          this.$parent.close();
        } else {
          await this.$store.dispatch(
            isCollection ? "editCollection" : "editPicto",
            {
              priority: this.picto.priority,
              id: this.picto.id,
              collection: isCollection,
              speech: this.picto.speech,
              meaning: this.picto.meaning,
              color: this.picto.color,
              share: 1,
              fatherCollectionId: parseInt(
                this.$route.params.fatherCollectionId,
                10
              ),
              image: cfile,
              ...(this.pictohubId && { pictohubId: this.pictohubId }),
            }
          );
          this.$buefy.toast.open({
            message: isCollection
              ? this.$t("EditedCollection")
              : this.$t("EditedPictogram"),
            type: "is-success",
          });
          //$nuxt.$emit("resyncPictoList");
          this.$parent.close();
        }
      } catch (err) {
        console.log(err);
        this.$buefy.toast.open({
          message: this.$t("PictoStepsCreationError"),
          type: "is-danger",
        });
        this.creationLoading = false;
      }
      this.creationLoading = false;
      this.$emit("close");
    },
    traductionNeeded() {
      // Si meaning du language principal change
      // Si meaning vide
      const savedPicto = this.picto.collection
        ? this.getCollectionFromId(this.picto.id)
        : this.getPictoFromId(this.picto.id);
      if (
        !savedPicto.meaning[this.getUserLang] ||
        savedPicto.meaning[this.getUserLang] !=
          this.picto.meaning[this.getUserLang]
      ) {
        return true;
      } else {
        return false;
      }
    },
    getCollectionFromId(id) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === id
      );
      return this.$store.getters.getCollections[index];
    },
    getPictoFromId(id) {
      const index = this.$store.getters.getPictos.findIndex(
        (picto) => picto.id === id
      );
      return this.$store.getters.getPictos[index];
    },
    async webImages(pictoSearch) {
      const regex = new RegExp("[$&+,:;=?@#|'<>.^*()%!-]", "g");
      pictoSearch = pictoSearch.replaceAll(regex, " ");
      let webData;
      this.loading = true;
      try {
        webData = await this.$store.dispatch("serachImages", {
          language: this.getUserLang,
          search: pictoSearch,
        });
        webData.forEach((photo) => {
          this.images.push({
            src: photo.thumbnail,
            title: photo.title,
            download: photo.download,
            source: photo.source,
            author: photo.author,
            ...(photo.pictohubId && { pictohubId: photo.id }),
          });
        });
        if (webData.length === 0) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      } catch (err) {
        console.log(err);
        throw new Error("Web images not available");
      }
      this.moreImages = true;
      this.loading = false;
    },
    async pictoExtractImg(pictoSearch) {
      const regex = new RegExp("[$&+,:;=?@#|'<>.^*()%!-]", "g");
      pictoSearch = pictoSearch.replaceAll(regex, " ");
      if (pictoSearch.length < 7) {
        const spaces = " ".repeat(7 - pictoSearch.length);
        pictoSearch = pictoSearch.concat(spaces);
      }
      this.images = [];
      this.loading = true;
      this.page = 1;
      let promises = [];
      try {
        let arasaacData = axios
          .get(
            `https://api.arasaac.org/api/pictograms/${this.getUserLang}/search/${pictoSearch}`
          )
          .then((arasaacData) => {
            arasaacData = arasaacData.data;
            for (let i = 0; i < arasaacData?.length; i++) {
              this.images.push({
                src: `https://api.arasaac.org/api/pictograms/${arasaacData[i]["_id"]}?color=true&resolution=500&download=false`,
                title: arasaacData[i]["keywords"][0]
                  ? arasaacData[i]["keywords"][0]["keyword"]
                  : arasaacData[i]["categories"][0],
                download: `https://api.arasaac.org/api/pictograms/${arasaacData[i]["_id"]}?color=true&resolution=500&download=false`,
                source: "arasaac",
                author: "",
                pictohubId: arasaacData[i]["_id"],
              });
            }
          })
          .catch((error) => {
            console.log(error);
            arasaacData = axios
              .get(
                `https://symbotalkapiv1.azurewebsites.net/search/?name=${pictoSearch}&lang=${this.getUserLang}&repo=arasaac&limit=10`
              )
              .then((arasaacData) => {
                arasaacData = arasaacData.data;
                if (arasaacData != "no result") {
                  for (let i = 0; i < arasaacData?.length; i++) {
                    this.images.push({
                      src: arasaacData[i].image_url,
                      title: arasaacData[i].translations[0].tName,
                      download: arasaacData[i].image_url,
                      source: "arasaac-symbotalk",
                      author: arasaacData[i].author,
                    });
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });

        const scleraData = axios
          .get(
            `https://symbotalkapiv1.azurewebsites.net/search/?name=${pictoSearch}&lang=${this.getUserLang}&repo=sclera&limit=10`
          )
          .then((scleraData) => {
            scleraData = scleraData.data;
            if (scleraData != "no result") {
              for (let i = 0; i < scleraData?.length; i++) {
                this.images.push({
                  src: scleraData[i].image_url,
                  title: scleraData[i].translations[0].tName,
                  download: scleraData[i].image_url,
                  source: "sclera-symbotalk",
                  author: scleraData[i].author,
                });
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });

        const tawasolData = axios
          .get(
            `https://symbotalkapiv1.azurewebsites.net/search/?name=${pictoSearch}&lang=${this.getUserLang}&repo=tawasol&limit=10`
          )
          .then((tawasolData) => {
            tawasolData = tawasolData.data;
            if (tawasolData != "no result") {
              for (let i = 0; i < tawasolData?.length; i++) {
                this.images.push({
                  src: tawasolData[i].image_url,
                  title: tawasolData[i].translations[0].tName,
                  download: tawasolData[i].image_url,
                  source: "tawasol-symbotalk",
                  author: tawasolData[i].author,
                });
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });

        const mulberryData = axios
          .get(
            `https://symbotalkapiv1.azurewebsites.net/search/?name=${pictoSearch}&lang=${this.getUserLang}&repo=mulberry&limit=10`
          )
          .then((mulberryData) => {
            mulberryData = mulberryData.data;
            if (mulberryData != "no result") {
              for (let i = 0; i < mulberryData?.length; i++) {
                this.images.push({
                  src: mulberryData[i].image_url,
                  title: mulberryData[i].translations[0].tName,
                  download: mulberryData[i].image_url,
                  source: "mulberry-symbotalk",
                  author: mulberryData[i].author,
                });
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });

        promises.push(arasaacData);
        promises.push(scleraData);
        promises.push(tawasolData);
        promises.push(mulberryData);
        await Promise.allSettled(promises).then();

        if (this.images.length < 5) {
          this.webImages(pictoSearch);
        } else {
          this.noResults = false;
          this.loading = false;
          this.moreImages = false;
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status == 404) {
          this.webImages(pictoSearch);
        } else {
          this.loading = false;
        }
      }
    },
    uploadfile(file, pictohubId) {
      this.picto.speech[this.languageSelectorSpeech] = file.name
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");
      this.picto.meaning[this.languageSelectorSpeech] = file.name
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");
      this.file = file;
      this.activeStep = 1;
      if (pictohubId) {
        this.pictohubId = pictohubId;
      }
    },

    discardfile() {
      this.file = {};
      this.activeStep = 0;
    },

    canvasToFile() {
      const blob = this.canvasToBlob();
      let file = new File([blob], this.file.name, { type: blob.type });
      file.url = this.file.url;
      console.log(file);
      return file;
    },
    canvasToBlob() {
      let canvas = document.getElementById("canvas");
      const dataURI = canvas.toDataURL();
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      return blob;
    },
    async removeBackground() {
      const file = this.canvasToFile();
      const formData = new FormData();
      formData.append("file", file, "index.png");
      formData.append("model", "u2net");
      formData.append("a", false);
      formData.append("af", 240);
      formData.append("ab", 10);
      formData.append("ae", 10);
      formData.append("om", false);
      formData.append("ppm", false);
      const response = await axios.post(
        "https://removebg.home.asidiras.dev/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
    },
    rotateImg() {
      this.degree = this.degree + 90;
      if (this.degree >= 360) {
        this.degree = 0;
      }
      this.draw();
      // Save the current state of the canvas
    },
    async draw() {
      this.rendered = true;
      let image = document.getElementById("image");
      let canvas = document.getElementById("canvas");
      let size = { width: image.width, height: image.height };
      canvas.width = size["width"];
      canvas.height = size["height"];
      let ctx = canvas.getContext("2d");
      ctx.save();
      // Translate the canvas to the center of the image
      ctx.translate(canvas.width / 2, canvas.height / 2);
      // Rotate the canvas by 45 degrees
      ctx.rotate((this.degree * Math.PI) / 180);
      // Draw the image onto the canvas, centered at (0, 0)
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      // Restore the canvas to its original state
      ctx.restore();
      //ctx.drawImage(image, 0, 0);
      this.rendered = true;
      if (this.options.arrow.enabled) {
        this.render(
          ctx,
          size,
          "arrow",
          this.options.arrow.shift,
          this.options.arrow.scale,
          this.options.arrow.Xoffset,
          this.options.arrow.Yoffset,
          this.options.arrow.color,
          this.options.arrow.border
        );
      }
      if (this.options.plus.enabled) {
        this.render(
          ctx,
          size,
          "plus",
          this.options.plus.shift,
          this.options.plus.scale,
          this.options.plus.Xoffset,
          -this.options.plus.Yoffset + 100,
          this.options.plus.color,
          this.options.plus.border
        );
      }
      if (this.options.cross.enabled) {
        this.cross(
          ctx,
          size,
          this.options.cross.scale,
          this.options.cross.Xoffset,
          this.options.cross.Yoffset,
          this.options.cross.color
        );
      }
    },

    cross(ctx, size, scale = 100, Xoffset = 0, Yoffset = 0, color = "#FF0000") {
      const widthPercent = parseInt(size["width"] / 100);
      const heightPercent = parseInt(size["height"] / 100);
      Xoffset = (Xoffset - 50) * widthPercent;
      Yoffset = (Yoffset - 50) * heightPercent;
      const topLeft = [
        Xoffset + ((100 - scale) * widthPercent) / 2,
        Yoffset + ((100 - scale) * heightPercent) / 2,
      ];
      const topRight = [
        size["width"] + Xoffset + ((scale - 100) * widthPercent) / 2,
        Yoffset + ((100 - scale) * heightPercent) / 2,
      ];
      const bottomLeft = [
        Xoffset + ((100 - scale) * widthPercent) / 2,
        size["height"] + Yoffset + ((scale - 100) * heightPercent) / 2,
      ];
      const bottomRight = [
        size["width"] + Xoffset + ((scale - 100) * widthPercent) / 2,
        size["height"] + Yoffset + ((scale - 100) * heightPercent) / 2,
      ];

      ctx.strokeStyle = color + "a9";
      ctx.lineWidth = scale / 4;
      ctx.beginPath();
      ctx.moveTo(topLeft[0], topLeft[1]);
      ctx.lineTo(bottomRight[0], bottomRight[1]);
      ctx.moveTo(topRight[0], topRight[1]);
      ctx.lineTo(bottomLeft[0], bottomLeft[1]);
      ctx.stroke();
    },
    render(
      ctx,
      size,
      shape = "arrow",
      shift = 0,
      scale = size["width"] / 100,
      Xoffset = 0,
      Yoffset = 0,
      color = "#000000",
      border = "#ffffff"
    ) {
      Xoffset = (0.8 * (Xoffset * size["width"])) / 100;
      Yoffset = (0.8 * (Yoffset * size["height"])) / 100;
      scale = parseInt(scale / 20);
      ctx.fillStyle = color;
      ctx.strokeStyle = border;
      ctx.lineWidth = 3;
      let points = this.getPoints(shape);
      if (shift) {
        points = this.Xshift(points);
        Xoffset = size["width"] - (Xoffset + 20 * scale);
      }
      ctx.beginPath();
      ctx.moveTo(points[0].x * scale + Xoffset, points[0].y * scale + Yoffset);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(
          points[i].x * scale + Xoffset,
          points[i].y * scale + Yoffset
        );
      }
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
    },

    Xshift(points) {
      if (points.length > 0) {
        for (let i = 0; i < points.length; i++) {
          points[i].x = 20 - points[i].x;
        }
      }
      return points;
    },

    getPoints(shape) {
      let points;
      if (shape == "plus") {
        points = [
          { x: 0, y: 12 },
          { x: 0, y: 12 },
          { x: 6, y: 12 },
          { x: 6, y: 18 },
          { x: 12, y: 18 },
          { x: 12, y: 12 },
          { x: 18, y: 12 },
          { x: 18, y: 6 },
          { x: 12, y: 6 },
          { x: 12, y: 0 },
          { x: 6, y: 0 },
          { x: 6, y: 6 },
          { x: 0, y: 6 },
          { x: 0, y: 12 },
        ];
      } else if (shape == "arrow") {
        points = [
          { x: 18, y: 6 },
          { x: 8, y: 6 },
          { x: 8, y: 0 },
          { x: 0, y: 9 },
          { x: 8, y: 18 },
          { x: 8, y: 12 },
          { x: 18, y: 12 },
        ];
      } else {
        return -1;
      }
      return points;
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
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.halfWidth {
  width: 40%;
}
.scrolling {
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
.optionSection {
  background-color: #f4f4f4;
  padding: 1rem;
  margin: 0.5rem;
  margin-left: 0%;
  border-radius: 15px;
}
.optionImage {
  margin: 0%;
  max-width: 70%;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
.optionSwitch {
  padding-right: 0.3rem;
}
.has-addons {
  display: flex;
  justify-content: center;
}
</style>
