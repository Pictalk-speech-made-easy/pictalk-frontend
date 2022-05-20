<template>
  <div class="footers">
    <div class="content has-text-centered">
      <p style="margin-bottom: 0px">
        <strong>PicTalk</strong> {{ $t("By") }}
        <a
          href="https://www.helloasso.com/associations/pictalk-speech-made-easy"
          >Pictalk Speech Made Easy</a
        >
        . {{ $t("CodeIsLicensed") }}
        <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU</a>.
        {{ $t("TakeALook") }}
        <nuxt-link to="/legal-infos/terms-of-use">{{
          $t("TermsOfUse")
        }}</nuxt-link>
        {{ $t("And") }}
        <nuxt-link to="/legal-infos/privacy-policy">{{
          $t("PrivacyPolicy")
        }}</nuxt-link
        >. <b>PicTalk</b> {{ $t("ProjectBackedBy") }}
      </p>
    </div>
    <br />
    <div class="columns is-centered is-mobile">
      <div class="column centerImage">
        <b-image
          lazy
          :responsive="false"
          src="https://fondation.insa-lyon.fr/sites/fondation.insa-lyon.fr/files/insa_lyon_logo_0.png"
          alt="Fondation INSA Lyon logo"
          custom-class="imgpixelslimit"
        />
      </div>
      <div class="column centerImage">
        <b-image
          lazy
          :responsive="false"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png"
          alt="DigitalOcean"
          custom-class="imgpixelslimit"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.footers {
  padding: 2rem;
}
</style>
<style>
.imgpixelslimit {
  max-width: 100px;
}
.centerImage {
  text-align: center;
}
</style>