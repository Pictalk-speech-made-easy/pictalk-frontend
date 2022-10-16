<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("News") }}</h1>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <iframe
          src="https://widget.taggbox.com/110606"
          style="width: 100%; height: 50vh; border: none"
        ></iframe>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("Donations") }}</h1>
        <h3 class="title is-size-4 is-size-4-mobile">
          {{ $t("DonationUsage") }}
        </h3>
        <div class="columns">
          <div class="column">
            <b-image
              style="aspect-ratio: 16/9; max-width: 15vw"
              class="img-centered column"
              lazy
              src="https://www.aomei.fr/assets/images/misc/pa-server.png"
              alt="help center people wearing headsets"
              rounded
            ></b-image>
            <h5 class="centered is-size-5 is-size-5-mobile">
              {{ $t("DonationInformatics") }}: 50€
            </h5>
            <div class="centered">{{ $t("DonationInformaticsText") }}</div>
          </div>
          <div class="column">
            <b-image
              style="aspect-ratio: 16/9; max-width: 15vw"
              class="img-centered column"
              lazy
              src="https://media.istockphoto.com/vectors/bank-building-isolated-on-white-background-vector-illustration-flat-vector-id900791430?k=20&m=900791430&s=612x612&w=0&h=IKTkhxiIwAL6-HMfm9tfW6ti2e4V2roX2IgpUUrbLME="
              alt="help center people wearing headsets"
              rounded
            ></b-image>
            <h5 class="centered is-size-5 is-size-5-mobile">
              {{ $t("DonationBank") }}: 15€
            </h5>
            <div class="centered">{{ $t("DonationBankText") }}</div>
          </div>
          <div class="column">
            <b-image
              style="aspect-ratio: 16/9; max-width: 15vw"
              class="img-centered column"
              lazy
              src="https://cdn.iconscout.com/icon/free/png-256/box-with-stuff-2349406-1955397.png"
              alt="help center people wearing headsets"
              rounded
            ></b-image>
            <h5 class="centered is-size-5 is-size-5-mobile">
              {{ $t("DonationOther") }}: 8€
            </h5>
            <div class="centered">{{ $t("DonationOtherText") }}</div>
          </div>
        </div>
        <h3 class="title is-size-4 is-size-4-mobile">
          {{ $t("DonationGoals") }}
        </h3>
        <div class="columns is-vcentered">
          <b-image
            lazy
            alt="two people lifting the earth"
            src="https://img.freepik.com/vecteurs-libre/illustration-orthophonie-creative_23-2149237023.jpg?w=2000"
            style="width: 50%; margin-left: 10%; aspect-ratio: 16/9"
            class="column"
          ></b-image>
          <div class="column">
            {{ $t("DonationGoalsText1") }}
          </div>
        </div>
        <div class="columns is-vcentered">
          <b-image
            lazy
            alt="two people lifting the earth"
            src="https://tim-tek.com/wp-content/uploads/2020/08/developer-working-Converti-1170x700.png"
            style="width: 50%; margin-left: 10%; aspect-ratio: 16/9"
            class="column"
          ></b-image>
          <div class="column">
            {{ $t("DonationGoalsText2") }}
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
