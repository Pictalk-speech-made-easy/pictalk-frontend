<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("Pictograms") }}</h1>
        <b-image
          lazy
          alt="The ARASAAC association logo"
          :srcset="require('@/assets/pictalkarsaac.png').srcSet"
          :placeholder="require('@/assets/pictalkarsaac.png').placeholder"
          style="width: 80%; margin-left: 10%; aspect-ratio: 16/9"
        ></b-image>
        <section class="hero">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">{{ $t("ARSAAC") }}</h1>
              <p class="is-size-5 notification">
                {{ $t("ProvidedPictos") }}
                <a href="https://arasaac.org/">{{ $t("Here") }}</a>
              </p>
              <p class="is-size-5 notification">
                {{ $t("ProvidedPictos1") }}
                <a href="https://www.symbotalk.com/"> Symbotalk</a>
                's API
              </p>
              <p class="is-size-5 notification">
                {{ $t("ProvidedPictos2") }}
                <a href="https://www.flickr.com/"> Flickr</a>,
                <a href="https://www.unsplash.com/"> Unsplash</a>,
                <a href="https://www.pixabay.com/"> Pixabay</a>,
                <a href="https://www.pexels.com/"> Pexels</a>
                {{ $t("ProvidedPictos3") }}
              </p>
            </div>
          </div>
        </section>
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
        title: this.$t("TitlePictograms"),
        ...i18nHead.htmlAttrs,
      },
      title: this.$t("TitlePictos"),
      meta: [
        {
          hid: "descriptionPictos",
          name: "description",
          content: this.$t("DescriptionMetaPictograms"),
        },
        ...i18nHead.meta,
      ],
    };
  },
};
</script>
