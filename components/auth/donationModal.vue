<template>
  <div class="modal-card">
    <header class="modal-card-head"></header>
    <section class="modal-card-body" style="flex-grow: 0; padding: 1rem 2rem;">
      <div class="subtitle">
        <p v-html="$t('DonationText' + textAlt)"></p>
        <img :srcset="require('@/assets/pictalk-brothers.webp').srcSet" style="margin: 1rem 0rem;" />
        <br>
        <div class="button-container">
          <b-button class="button customButton" type="is-success" @click="createSubscription()">
            {{ $t("DonationTextCta" + textAlt) }}
          </b-button>
          <b-button v-if="textAlt == 1 || textAlt == 3" class="button customButton" type="is-info"
            @click="createSubscription()">
            {{ $t("DonationTextOther") }}
          </b-button>
          <b-button class="button customButton" type="is-danger" @click="$parent.close()">
            {{ $t("DonationTextDecline" + textAlt) }}
          </b-button>
        </div>
        <br>
      </div>
    </section>
    <footer class="modal-card-foot"></footer>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "donationModal",
  data() {
    return {
      amount: 10000,
      name: "",
      currency: "eur",
      textAlt: Math.floor(Math.random() * 4) + 1,
      donationArray: {}
    };
  },
  async mounted() {
    this.donationArray = await this.getCountryByIP();
  },
  methods: {
    async createSubscription() {
      try {
        var res = await axios.post(`https://donations-api.pictalk.org/v1/subscriptions`, {
          email: this.$store.getters.getUser.email,
          name: "Alex",
          locale: this.$i18n.locale,
          currency: this.currency,
          amount: 500,
        });
        const sessionId = res.data.sessionId;
        if (res.data.checkoutUrl) window.open(res.data.checkoutUrl, "_blank");
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
    async getIPAdress() {
      try {
        var res = await axios.get(`https://api.ipify.org?format=json`);
        if (res.data.ip) {
          return res.data.ip;
        } else {
          return false;
        }
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
    async getCountryByIP() {
      try {
        var ip = await this.getIPAdress();
        var res = await axios.post(`https://donations-api.pictalk.org/v1/donation-amount-panel`, {
          ip: ip
        });
        this.currency = res.data.currency.toLowerCase();
        console.log("res ", res);
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
  }
};
</script>
<style scoped>
.button-container {
  flex-wrap: wrap;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

div.media-content {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

.scrollableDiv {
  border: solid;
  border-width: 1px;
  border-color: #00000040;
  background-color: #f5f5f5;
  max-height: 20vh;
  overflow: scroll;
}

.headers {
  margin-bottom: 0.5rem;
  padding: 0.4rem;
}

.leftAlign {
  display: inline-block;
}

.centerImage {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marginAuto {
  margin: auto;
  display: block;
}

.customButton {
  font-size: clamp(0.8em, 4vw, 1.15em);
  font-weight: 600;
  color: #171717;
  border: 2px solid #666;
  transition: all 0.05s;
  margin: 0 2px;
}

.customButton:hover {
  box-shadow: 0px 0px 12px #00000090;
}
</style>