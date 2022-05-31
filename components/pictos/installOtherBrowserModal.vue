<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head" style="padding: 2%">
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
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1200px-Google_Chrome_icon_%28February_2022%29.svg.png"
            alt="Logo of the Chrome browser"
            style="max-width: 100px"
          />
        </a>
        <a class="column is-half" href="https://www.mozilla.org/fr/firefox/">
          <b-image
            responsive
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/800px-Firefox_logo%2C_2019.svg.png"
            alt="Logo of the Firefox browser"
            style="max-width: 100px"
          />
        </a>
      </div>
    </section>
    <footer class="modal-card-foot" style="padding: 2%">
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