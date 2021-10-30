<template>
  <div id="app">
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
        v-model="pictoMeaning"
        :placeholder="$t('SearchNotice')"
      ></b-input>
    </b-field>

    <div class="columns is-multiline">
      <div class="column is-one-quarter-desktop is-half-tablet">
        <figure class="image is-128x128">
          <img src="https://unsplash.it/300/200/?random&pic=1" alt="" />
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
  }),
  methods: {
    searchweb() {
      this.images = [];
      axios
        .get(
          `https://api.arasaac.org/api/pictograms/2339?color=true&resolution=500&download=false`,
          {
            headers: {},
          }
        )
        .then((response) => {
          this.images = response.data.results;
        })
        .catch(() => {
          this.images = [];
        });
    },
  },
};
</script>
