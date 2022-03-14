<template>
  <div class="footers">
    <div class="content has-text-centered">
      <p style="margin-bottom: 0px">
        <strong>PicTalk</strong> {{ $t("By") }}
        <a href="https://website.asidiras.dev/">Alexandros SIDIRAS GALANTE</a>
        {{ $t("And") }}
        <a href="https://github.com/UnlikelyBuddy1">Adrianos SIDIRAS GALANTE</a
        >. {{ $t("CodeIsLicensed") }}
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
      <b-image
        lazy
        :srcset="require('@/assets/FondationLogo.png').srcSet"
        alt="Fondation INSA Lyon logo"
        style="width: 10%"
      ></b-image>
      {{ $t("WantToBeABacker") }}
      <a href="mailto:alex@pictalk.org">alex@pictalk.org</a>
      !
    </div>
  </div>
</template>
<style scoped>
.footers {
  padding: 2rem;
}
</style>