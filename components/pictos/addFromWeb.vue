<template id= "app">
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
      <b-checkbox v-model="isFolder" true-value="1" false-value="0">{{
        $t("FolderNotice")
      }}</b-checkbox>
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
      icon-right="message"
      @click="searchPictos(pictoSearch)"
    />
    <b-button type="is-primary">Primary</b-button>
    <br />
    <br />

    <div class="columns is-multiline">
      <div
        class="column is-one-quarter-desktop is-half-tablet"
      >
        <figure class="image is-128x128">
          <img :src="getImgUrl(pic)" v-bind:alt="pic" />
        </figure>
      </div>
      <div
        class="column is-one-quarter-desktop is-half-tablet"
        v-for="(image, i) in images"
        :key="i"
      >
        <img :src="image" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data: () => ({
    images: [],
    size: 0,
  }),
  computed: {
		getUserLang() {
			const user = this.$store.getters.getUser;
      const lang = user.language
      const language2char = lang.substring(0,2);
			return language2char;
		},
	},
  methods: {
    pictoExtractImg() {
      this.images = [];
      axios
        .get(
          `https://api.arasaac.org/api/pictograms/2339?color=true&resolution=500&download=false`,
          { headers: {} }
        )
        .then((response) => {
          this.images.push(response.data.results);
        })
        .catch(() => {
          this.images = [];
        });
      this.size = this.images.length;
    },
    searchPictos(pictoSearch) {

      axios
        .get(
          `https://api.arasaac.org/api/pictograms/${this.getUserLang()}/search/${pictoSearch}`,
          { headers: {} }
        )
        .then((response) => {
          this.images.push(response.data.results);
        })
        .catch(() => {
          this.images = [];
        });
    },
  },
};
</script>
