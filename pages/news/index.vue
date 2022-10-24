<template>
  <div>
    <section class="section">
      <div>
        <h1 class="title">{{ $t("News") }}</h1>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <iframe class="card iframe"
          src="https://widget.taggbox.com/110606"
        ></iframe>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("Donations") }}</h1>
        <h3 class="title is-size-4 is-size-4-mobile headings">
          {{ $t("DonationUsage") }}
        </h3>
        <div class="columns card">
          <div class="column subcard slot3">
            <img
              class="subcard-img"
              loading="lazy"
              :srcset="require('@/assets/servers.png').srcSet"
              :placeholder="require('@/assets/servers.png').placeholder"
              alt="drawing of servers to illustrate the costs of running Pictalk application"
            ></img>
            <h5 class="centered is-size-5 is-size-5-mobile">
              <b>{{ $t("DonationInformatics") }}: 30€</b>
            </h5>
            <div class="centered is-size-5 subcard-text">{{ $t("DonationInformaticsText") }}</div>
          </div>
          <div class="column subcard slot3">
            <img
              class="subcard-img"
              loading="lazy"
              :srcset="require('@/assets/bank.jpg').srcSet"
              :placeholder="require('@/assets/bank.jpg').placeholder"
              alt="drawing of a bank, to illustrate the fees Pictalk pays to have an open bank account and be able to receive donations"
            ></img>
            <h5 class="centered is-size-5 is-size-5-mobile">
              <b>{{ $t("DonationBank") }}: 15€</b>
            </h5>
            <div class="centered is-size-5 subcard-text">{{ $t("DonationBankText") }}</div>
          </div>
          <div class="column subcard slot3">
            <img
              class="subcard-img"
              loading="lazy"
              :srcset="require('@/assets/box.png').srcSet"
              :placeholder="require('@/assets/box.png').placeholder"
              alt="drawing of a folder with various items, illustrating the fact that we have other fees to pay, such as domain name etc"
            ></img>
            <h5 class="centered is-size-5 is-size-5-mobile">
              <b>{{ $t("DonationOther") }}: 8€</b>
            </h5>
            <div class="centered is-size-5 subcard-text">{{ $t("DonationOtherText") }}</div>
          </div>
        </div>
        <h3 class="title is-size-4 is-size-4-mobile headings">
          {{ $t("DonationGoals") }}
        </h3>
        <div class="card">
          <div class="subcard subcard-row">
            <img
              loading="lazy"
              alt="drawing of woman teaching letters to a child"
              :srcset="require('@/assets/learn.webp').srcSet"
              :placeholder="require('@/assets/learn.webp').placeholder"
              class="subcard-img bigger"
            ></img>
            <div class="subcard-text margin-text is-size-5">
              {{ $t("DonationGoalsText1") }}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="subcard subcard-row">
            <img
              loading="lazy"
              alt="drawing of a person working with a computer"
              :srcset="require('@/assets/dev.webp').srcSet"
              :placeholder="require('@/assets/dev.webp').placeholder"
              class="subcard-img bigger"
            ></img>
            <div class="subcard-text margin-text is-size-5">
              {{ $t("DonationGoalsText2") }}
            </div>
          </div>
        </div>
        </div>
    </section>
  </div>
</template>
<script >
export default {
  mounted() {
    document.querySelector("iframe").onload = () => {
      this.newsCharged = true;
    };
  },
  data() {
    return {
      newsCharged: false,
      done: true,
    };
  },
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        title: this.$t("TitleNews"),
        ...i18nHead.htmlAttrs,
      },
      title: this.$t("TitleNews"),
      meta: [
        {
          hid: "descriptionNews",
          name: "description",
          content: this.$t("DescriptionNews"),
        },
        ...i18nHead.meta,
      ],
    };
  },
};
</script>
<style scoped>
.section {
  padding: 1em;
  padding-top: 0rem;
  padding-bottom: 3rem;
}
.subcard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-basis: auto;
  padding: 0.75em;
}
.subcard-row {
  flex-direction: row;
}
.slot3 {
  min-width: 33.33%;
}
.headings {
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.card {
  margin: 2vw;
  border-radius: 12px;
}
.subcard-img {
  border-radius: 12px;
  aspect-ratio: 1 / 1;
  max-height: 20vh;
  object-fit: cover;
}
.bigger {
  max-height: 30vmin;
  min-height: 200px;
}
.centered {
  text-align: center;
}
.subcard-text {
  margin: 0.4em 0 0em 0;
}
.margin-text {
  margin: 0 1.5vmin 0 3vmin;
}

@media screen and (max-width: 768px) {
  .subcard-row {
    flex-direction: column;
  }
}
.is-size-5 {
  padding: 0%;
}
.iframe {
  width: 100%;
  margin: 0%;
  height: 50vh;
  background-color: #f5f5f5;
}
</style>
