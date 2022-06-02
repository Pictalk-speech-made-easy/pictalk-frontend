<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("Help") }}</h1>
        <b-image
          lazy
          alt="two people lifting the earth"
          :srcset="require('@/assets/Help.png').srcSet"
          :placeholder="require('@/assets/Help.png').placeholder"
          style="width: 80%; margin-left: 10%"
        ></b-image>

        <div class="box">
          <b-button type="is-primary" icon-right="home" />
          <br />
          <br />
          {{ $t("HelpText1") }}
        </div>
        <div class="box">
          <b-button type="is-info" icon-right="cog" />
          <br />
          <br />
          {{ $t("HelpText2") }}
        </div>
        <div class="box">
          <b-button type="is-success is-light" icon-right="web" />
          <br />
          <br />
          {{ $t("HelpText9") }}
        </div>
        <div class="box">
          <b-button type="is-primary is-light" icon-right="folder-account" />
          <br />
          <br />
          {{ $t("HelpText10") }}
        </div>
        <div class="box">
          <b-button
            type="is-primary is-light"
            icon-right="page-layout-sidebar-right"
          />
          <br />
          <br />
          {{ $t("HelpText11") }}
        </div>
        <div class="box">
          <b-button type="is-light" icon-right="logout" />
          <br />
          <br />
          {{ $t("HelpText12") }}
        </div>
        <div class="box">
          <b-button type="is-warning" icon-right="lock" />
          <b-button type="is-warning" icon-right="lock-open" />
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
      </div>
    </section>
  </div>
</template>
<script >
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
