<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p align="center" class="modal-card-title">
        {{ $t("InstallAnotherBrowser") }}
      </p>
    </header>
    <section class="modal-card-body">
      <p align="center">
        {{ $t("InstallAnotherBrowserText") }}
      </p>
      <br />
      <div class="columns is-mobile">
        <a class="column is-half" href="https://www.google.com/chrome/">
          <b-image
            responsive
            :srcset="require('@/assets/ChromeLogo.png').srcSet"
            alt="Logo of the Chrome browser"
            style="max-width: 100px; aspect-ratio: 1/1"
          />
        </a>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button class="button" type="button" @click="$parent.close()">{{
        $t("Close")
      }}</b-button>
    </footer>
  </div>
</template>
<script>
export default {
  name: "installOtherBrowserModal",
};
</script>