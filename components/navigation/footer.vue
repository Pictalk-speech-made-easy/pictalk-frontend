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
    <div class="columns is-centered is-mobile">
      <div class="column centerImage">
        <a href="https://www.instagram.com/pictalk_speech_made_easy/">
          <b-image
            lazy
            :responsive="false"
            :srcset="require('@/assets/instagram.png').srcSet"
            alt="Instagram"
            custom-class="imgpixelslimitvw portrait grayscale"
          />
        </a>
      </div>
      <div class="column centerImage">
        <a href="https://www.facebook.com/profile.php?id=100086626416882">
          <b-image
            lazy
            :responsive="false"
            :srcset="require('@/assets/facebook.png').srcSet"
            alt="Facebook"
            custom-class="imgpixelslimitvw portrait grayscale"
          />
        </a>
      </div>
      <div class="column centerImage">
        <a href="https://www.linkedin.com/company/88954834/">
          <b-image
            lazy
            :responsive="false"
            :srcset="require('@/assets/linkedin.png').srcSet"
            alt="Linkedin"
            custom-class="imgpixelslimitvw portrait grayscale"
          />
        </a>
      </div>
      <div class="column centerImage">
        <a href="mailto:alex@pictalk.org">
          <b-image
            lazy
            :responsive="false"
            :srcset="require('@/assets/email.png').srcSet"
            alt="Mail"
            custom-class="imgpixelslimitvw portrait grayscale"
          />
        </a>
      </div>
    </div>
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
.imgpixelslimitvw {
  width: 10vw;
  max-width: 36px;
}
.portrait:hover {
  animation: zoom 250ms;
  animation-fill-mode: forwards;
}
@keyframes zoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.08);
  }
}
.grayscale {
  filter: none;
  -webkit-filter: grayscale(0%);
}

.grayscale:hover {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(100%); /* Chrome 19+ & Safari 6+ */
}
</style>
