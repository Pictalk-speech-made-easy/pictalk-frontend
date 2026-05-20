<template>
  <div>
    <div class="title is-4">{{ $t('NoVoiceAvailable') }} ⛔</div>
    <div class="title is-6">{{ $t('SignupNoVoiceText') }}</div>
    <div class="title is-6">{{ $t('SignupNoVoiceAll') }}
      <br>
      <a :href="getArticleUrl">www.pictalk.org
      </a>
    </div>
  </div>
</template>
<script>
import lang from '../../mixins/lang';

export default {
  name: 'installVoice',
  mixins: [lang],
  methods: {
    getLocaleCode() {
      return this.localeCode();
    }
  },
  computed: {
    getArticleUrl() {
      if (this.getLocaleCode() == 'fr') {
        return "https://www.pictalk.org/fr/article/installer-une-voix-de-synthese/"
      } else if (this.getLocaleCode() == 'es') {
        return "https://www.pictalk.org/es/article/instalar-una-voz-sintetica/"
      } else if (this.getLocaleCode() == 'it') {
        return "https://www.pictalk.org/it/article/installare-una-voce-sintetica/"
      } else if (this.getLocaleCode() == 'pt') {
        return "https://www.pictalk.org/pt/article/instalar-uma-voz-sintetica/"
      } else if (this.getLocaleCode() == 'de') {
        return "https://www.pictalk.org/de/article/installiere-eine-synthesestimme/"
      } else {
        return "https://www.pictalk.org/en/article/install-a-synthesized-voice/"
      }
    }
  }
}
</script>