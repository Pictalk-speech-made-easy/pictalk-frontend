<template>
<div>
  <div class="title is-4">{{ $t('NoVoiceAvailable')}}</div>
  <div class="title is-6">{{ $t('SignupNoVoiceText')}}</div>
  <div class="title is-6">{{ $t('SignupNoVoiceAll')}}
    <br>
    <a href="https://aulaabierta.arasaac.org/fr/communicateur-dynamique-asterics-grid-installation-de-voix-synthetiques-tts-sur-android">aulaabierta.arasaac.org
  </a>
  </div>
  <div class="title is-6">{{ $t('SignupNoVoiceSamsung')}}
    <br>
    <a href="https://www.samsung.com/fr/support/mobile-devices/what-is-tts-text-to-speech/">https://www.samsung.com/fr/</a>
  </div>
</div>
</template>
<script>
export default {
  name: 'installVoice',
}
</script>