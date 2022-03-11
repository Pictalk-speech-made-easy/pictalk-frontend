<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("Help") }}</h1>
        <b-image
          lazy
          alt="A little boy talking thanks to Pictalk"
          :srcset="require('@/assets/Help.png').srcSet"
          style="width: 80%; margin-left: 10%"
        ></b-image>

        <div class="box">
          <b-button type="is-primary" icon-right="home" />
          <br />
          <br />
          {{ $t("HelpText1") }}
        </div>
        <div class="box">
          <b-button type="is-info" icon-right="account-circle" />
          <br />
          <br />
          {{ $t("HelpText2") }}
        </div>
        <div class="box">
          <b-button type="is-link" icon-right="pencil" />
          <b-button type="is-light" icon-right="pencil" />
          <br />
          <br />
          {{ $t("HelpText3") }}
        </div>
        <div class="box">
          <b-button type="is-danger" icon-right="delete" />
          <br />
          <br />
          {{ $t("HelpText4") }}
        </div>
        <div class="box">
          <b-button type="is-danger" icon-right="backspace" />
          <br />
          <br />
          {{ $t("HelpText5") }}
        </div>
        <div class="box">
          <b-button type="is-success" icon-right="message" />
          <br />
          <br />
          {{ $t("HelpText6") }}
        </div>
        <div class="box">
          <b-button type="is-info" icon-right="content-copy" />
          <br />
          <br />
          {{ $t("HelpText7") }}
        </div>
        <div class="box">
          <b-button type="is-success" icon-right="refresh" />
          <br />
          <br />
          {{ $t("HelpText8") }}
        </div>
      </div>
    </section>
  </div>
</template>
<script difer>
export default {
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        title: "Pictograms",
        ...i18nHead.htmlAttrs,
      },
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("DescriptionNews"),
        },
        ...i18nHead.meta,
      ],
    };
  },
};
</script>