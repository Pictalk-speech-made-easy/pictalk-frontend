<template>
  <div>
    <b-message type="is-success" :closable="false" >
    <div class="columns is-mobile">
      <div class="column is-two-third">
    {{ $t('AdhesionText') }}</div>
    <div class="column is-one-third" style="text-align: center; position: relative;">
      <a style="position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
" href="https://www.helloasso.com/associations/pictalk-speech-made-easy/adhesions/formulaire-d-adhesion">
    <b-button
      class="button is-primary"
      >{{ $t('Adhesion') }}</b-button></a>
  </div>
  </div>
</b-message>
<br>
  </div>
</template>
<script>
export default {
  name: "support",
};
</script>
<style scoped>
.columns {
  margin: 0px;
}
</style>