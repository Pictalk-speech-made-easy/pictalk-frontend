<template>
  <div class="modal-card" style="width: auto">
    <section class="modal-card-body">
      <div class="columns is-mobile is-multiline is-centered">
        <div v-for="language in languages" class="column">
          <b-button @click="setTemporaryLanguage(language)" class="is-light">{{
            getEmoji(language)
          }}</b-button>
        </div>
      </div>
    </section>
  </div>
</template>
<script difer>
import emoji from "@/mixins/emoji";
export default {
  mixins: [emoji],
  data() {
    return {
      languages: [
        "fr-FR",
        "en-US",
        "de-DE",
        "bg-BG",
        "cs-CZ",
        "da-DK",
        "el-GR",
        "es-ES",
        "et-ET",
        "fi-FI",
        "hu-HU",
        "it-IT",
        "ja-JP",
        "lt-LT",
        "lv-LV",
        "nl-NL",
        "pl-PL",
        "pt-PT",
        "ro-RO",
        "ru-RU",
        "sk-SK",
        "sl-SL",
        "sv-SV",
        "zh-HK",
      ],
    };
  },
  methods: {
    setTemporaryLanguage(language) {
      this.$store.commit("setTemporaryLanguage", language);
      this.$parent.close();
    },
  },
};
</script>