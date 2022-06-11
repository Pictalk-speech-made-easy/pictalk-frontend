<template>
  <div class="footers">
    <div class="content has-text-centered">
      <p style="margin-bottom: 0px">
        <strong>PicTalk</strong> {{ $t("By") }}
        <a
          class="morecontrast"
          href="https://www.helloasso.com/associations/pictalk-speech-made-easy"
          >Pictalk Speech Made Easy</a
        >
        . {{ $t("CodeIsLicensed") }}
        <a
          class="morecontrast"
          href="https://www.gnu.org/licenses/gpl-3.0.en.html"
          >GNU</a
        >.
        {{ $t("TakeALook") }}
        <nuxt-link to="/legal-infos/terms-of-use" class="morecontrast">{{
          $t("TermsOfUse")
        }}</nuxt-link>
        {{ $t("And") }}
        <nuxt-link to="/legal-infos/privacy-policy" class="morecontrast">{{
          $t("PrivacyPolicy")
        }}</nuxt-link
        >. <b>PicTalk</b> {{ $t("ProjectBackedBy") }}
      </p>
    </div>
    <br />
    <div class="columns is-centered is-mobile" style="aspect-ratio: 6/1">
      <div class="column centerImage">
        <b-image
          lazy
          :responsive="false"
          :srcset="require('@/assets/InsaFondation.png').srcSet"
          alt="logo of Fondation INSA Lyon "
          custom-class="imgpixelslimit"
        />
      </div>
      <div class="column centerImage">
        <b-image
          lazy
          :responsive="false"
          :srcset="require('@/assets/DigitalOcean.png').srcSet"
          alt="Logo of DigitalOcean"
          custom-class="imgpixelslimit"
        />
      </div>
    </div>
    <div style="height: 10vh; max-height: 80px" />
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
.morecontrast {
  color: #ee0000;
}
</style>