<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t("CreateCollection") }}</p>
      </header>
      <section class="modal-card-body">
        <template>
          <b-tabs v-model="activeTab" expanded>
            <b-tab-item label="Pictos" icon="image">
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
                  v-for="picto in this.images"
                  :key="picto.src"
                  :webpicto="picto"
                  @uploadfile="uploadfile($event)"
                />
              </div>
              <div>
                <b-field label="Or upload your own">
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
                </b-field>
              </div>
            </b-tab-item>
            <b-tab-item label="Name" icon="comment-text">
              <b-field :label="$t('Name')">
                <b-input
                  type="name"
                  v-model="collectionName"
                  :placeholder="$t('NameNotice')"
                  required
                ></b-input>
              </b-field>
              <b-field :label="$t('Color')">
                <b-input
                  type="color"
                  v-model="collectionColor"
                  :placeholder="$t('ColorNotice')"
                  required
                ></b-input>
              </b-field>
            </b-tab-item>
          </b-tabs>
        </template>
      </section>
      <footer class="modal-card-foot">
        <b-button class="button" type="button" @click="$parent.close()">{{
          $t("Close")
        }}</b-button>
        <b-button
          class="button is-primary"
          @click="
            onSubmitted(collectionName, collectionColor, file, highQuality)
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
import Webpicto from "@/components/pictos/webpicto";
export default {
  data() {
    return {
      selectedOption: "",
      collectionName: "",
      collectionColor: "",
      file: {},
      highQuality: this.$t("StandardQuality"),
      size: 0,
      images: [],
      activeTab: 0,
      pictoSearch: "",
    };
  },
  components: {
    Webpicto,
  },
  methods: {
    async onSubmitted(name, color, file, highQuality) {
      if (name != "" && file.name) {
        if (!file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
          this.$buefy.notification.open({
            message: this.$t("ImageFiles"),
            type: "is-warning",
          });
          return;
        }
		if (!color){
			color = "#ff5656";
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
          const res = await this.$store.dispatch("addCollection", {
            name: name,
            color: color,
            image: cfile,
          });
          this.$buefy.notification.open({
            message: this.$t("CreatedCollection"),
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
          message: this.$t("PleaseCompleteForm"),
          type: "is-danger",
        });
      }
    },
    getUserLang(){
      const user = this.$store.getters.getUser;
      return user.language.replace(/[^a-z]/g, "");
    },
    async pictoExtractImg(pictoSearch) {
      let results = [];
      let src;
      let alt;
      try {
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
              results.push({ alt: alt, src: src });
            }
            return results;
          });
      } catch (error) {
        console.log(error);
      }
    },
    uploadfile(file) {
      this.activeTab = 1;
      this.collectionName = file.name
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");
      this.file = file;
    },

    discardfile() {
      this.file = {};
      this.activeTab = 0;
    },
    next() {
      this.activeTab = 1;
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