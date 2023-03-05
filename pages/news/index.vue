<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("News") }}</h1>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <b-skeleton animated width="80%" :active="!newsCharged"></b-skeleton>
        <iframe
          class="card iframe"
          src="https://widget.taggbox.com/110606"
        ></iframe>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ $t("Donations") }}</h1>
        <h3 class="title is-size-4 is-size-4-mobile headings">
          {{ $t("YourDonations") }}
        </h3>
        <div class="columns card">
          <div class="column subcard slot3">
            <b class="is-size-5 centeredtext">{{ $t("OurDonators") }}</b>
            <div class="donators-wrapper">
              <p id="donator-name" class="donator-name">{{ donator }}</p>
            </div>
            <!--
            <div class="donators">
            <b v-for="(donator, index) in donators" :key="index" class="is-size-6 donator-name">{{donator}}</b>
            </div>
            -->
          </div>
          <div class="column subcard slot3">
            <b class="is-size-5 centeredtext">{{ $t("thanksDonations") }}</b>
            <b class="donation-amount">{{ donationAmount }}€</b>
          </div>
          <div class="column subcard slot3">
            <a
              class="fancy-link"
              href="https://www.helloasso.com/associations/pictalk-speech-made-easy/formulaires/1"
            >
              <b class="is-size-5 centeredtext">{{ $t("MakeDonations") }}</b>
            </a>
            <a
              href="https://www.helloasso.com/associations/pictalk-speech-made-easy/formulaires/1"
            >
              <img
                :srcset="require('@/assets/donation.png').srcSet"
                class="subcard-img donation-img"
                loading="lazy"
              />
            </a>
          </div>
        </div>
        <h3 class="title is-size-4 is-size-4-mobile headings">
          {{ $t("DonationUsage") }}
        </h3>
        <div class="columns card">
          <div class="column subcard slot3">
            <div
              class="subcard-img placeholder"
              :style="`background-image: url(${
                require('@/assets/servers.png').placeholder
              })`"
            >
              <img
                class="subcard-img"
                loading="lazy"
                :srcset="require('@/assets/servers.png').srcSet"
                alt="drawing of servers to illustrate the costs of running Pictalk application"
              />
            </div>
            <h5 class="centered is-size-5 is-size-5-mobile">
              <b>{{ $t("DonationInformatics") }}: 30€</b>
            </h5>
            <div class="centered is-size-5 subcard-text">
              {{ $t("DonationInformaticsText") }}
            </div>
          </div>
          <div class="column subcard slot3">
            <div
              class="subcard-img placeholder"
              :style="`background-image: url(${
                require('@/assets/bank.png').placeholder
              })`"
            >
              <img
                class="subcard-img"
                loading="lazy"
                :srcset="require('@/assets/bank.png').srcSet"
                alt="drawing of a bank, to illustrate the fees Pictalk pays to have an open bank account and be able to receive donations"
              />
            </div>
            <h5 class="centered is-size-5 is-size-5-mobile">
              <b>{{ $t("DonationBank") }}: 15€</b>
            </h5>
            <div class="centered is-size-5 subcard-text">
              {{ $t("DonationBankText") }}
            </div>
          </div>
          <div class="column subcard slot3">
            <div
              class="subcard-img placeholder"
              :style="`background-image: url(${
                require('@/assets/box.png').placeholder
              })`"
            >
              <img
                class="subcard-img"
                loading="lazy"
                :srcset="require('@/assets/box.png').srcSet"
                alt="drawing of a folder with various items, illustrating the fact that we have other fees to pay, such as domain name etc"
              />
            </div>
            <h5 class="centered is-size-5 is-size-5-mobile">
              <b>{{ $t("DonationOther") }}: 8€</b>
            </h5>
            <div class="centered is-size-5 subcard-text">
              {{ $t("DonationOtherText") }}
            </div>
          </div>
        </div>
        <h3 class="title is-size-4 is-size-4-mobile headings">
          {{ $t("DonationGoals") }}
        </h3>
        <div class="card">
          <div class="subcard subcard-row">
            <div
              class="subcard-img bigger placeholder"
              :style="`background-image: url(${
                require('@/assets/learn.png').placeholder
              })`"
            >
              <img
                loading="lazy"
                alt="drawing of woman teaching letters to a child"
                :srcset="require('@/assets/learn.png').srcSet"
                class="subcard-img bigger"
              />
            </div>
            <div class="subcard-text margin-text is-size-5">
              {{ $t("DonationGoalsText1") }}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="subcard subcard-row">
            <div
              class="subcard-img bigger placeholder"
              :style="`background-image: url(${
                require('@/assets/dev.webp').placeholder
              })`"
            >
              <img
                loading="lazy"
                alt="drawing of a person working with a computer"
                :srcset="require('@/assets/dev.webp').srcSet"
                class="subcard-img bigger"
              />
            </div>
            <div class="subcard-text margin-text is-size-5">
              {{ $t("DonationGoalsText2") }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  async mounted() {
    document.querySelector("iframe").onload = () => {
      this.newsCharged = true;
    };
    try {
      const res = await axios.get("/extras/amounts");
      if (res.status == 200) {
        if (res.data?.amount && res.data?.amount != 0) {
          this.donationAmount = res.data.amount;
          this.donators = res.data.donators;
        } else {
          this.donationAmount = res.data.pastAmount;
          this.donators = res.data.pastDonators;
        }
        this.cycleDonators();
      }
    } catch (err) {}
  },
  data() {
    return {
      newsCharged: false,
      done: true,
      donationAmount: "",
      donators: [],
      donator: "",
    };
  },
  methods: {
    cycleDonators() {
      if (this.donators.length > 0) {
        this.donator = this.donators.shift();
        this.donators.push(this.donator);
      }
      setTimeout(this.cycleDonators, 5000);
    },
  },
};
</script>

<style scoped>
.donators {
  margin-top: 0.75em;
  display: flex;
  flex-direction: column;
  max-height: 14em;
  overflow-y: auto;
  padding: 0.75em 2em;
  border-radius: 24px;
}

.donator-name {
  text-shadow: 0px 1px 1px #777;
}

.section {
  padding: 1em;
  padding-top: 0rem;
  padding-bottom: 3rem;
}

.centeredtext {
  text-align: center;
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
  background-color: #edf1f5;
}

.subcard-img {
  border-radius: 12px;
  aspect-ratio: 1 / 1;
  height: 20vmin;
  max-height: 200px;
  object-fit: cover;
}

.bigger {
  min-height: 30vmin;
}

.placeholder {
  background-size: cover;
  background-position: center;
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
  display: flex;
  margin: 0 auto;
  width: 100%;
  height: 57.5vh;
  background-color: #f5f5f5;
}

.donation-amount {
  font-size: clamp(1em, 12vw, 10em);
  max-height: 200px;
  margin-top: clamp(-0.3em, -5vw, -0.1em);
  background: linear-gradient(
    45deg,
    rgba(131, 151, 255, 1) 20%,
    rgba(255, 87, 87, 1) 45%,
    rgba(255, 87, 87, 1) 55%,
    rgba(131, 151, 255, 1) 80%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

body {
  margin: 0px;
}

#container {
  position: absolute;
  margin-top: clamp(7em, 6vw, 8em);
  width: 100vw;
  height: 80pt;
  top: 0;
  bottom: 0;
  filter: url(#threshold) blur(0.6px);
}

.donator-name {
  width: 100%;
  display: inline-block;
  font-family: "Raleway", sans-serif;
  font-weight: 1000;
  font-size: min(2.5em, 5vmax);
  text-align: center;
  user-select: none;
  color: #ff5757;
  filter: blur(0.6px);
}
.donators-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
}
.donation-img {
  transition: 300ms ease;
}
.donation-img:hover {
  filter: brightness(0.85);
  scale: 0.92;
}

@media screen and (max-width: 768px) {
  #text1,
  #text2 {
    font-size: 14vw;
  }

  #container {
    margin-top: calc(100px - 7vw);
  }

  .donation-amount {
    font-size: 20vw;
  }

  .subcard-img {
    height: 20vh;
  }
}
</style>
