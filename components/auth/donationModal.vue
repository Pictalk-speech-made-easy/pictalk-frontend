<template>
  <div class="modal-card">
    <header class="modal-card-head"></header>
    <section class="modal-card-body" style="flex-grow: 0; padding: 1rem 2rem;">
      <div class="subtitle">
        <h1 v-if="this.$posthog.getFeatureFlag('ab_test_donation_modal') === 'test'">{{ $t('DonationTitleTest') }}</h1>
        <h1 v-else>{{ $t('DonationTitleControl') }}</h1>
        <p v-if="this.$posthog.getFeatureFlag('ab_test_donation_modal') === 'test'" v-html="$t('DonationSubtitleTest')">
        </p>
        <p v-else v-html="$t('DonationSubtitleControl')"></p>
        <br>
        <div v-if="campaign.currentTarget > 0" class="campaign-progress">
          <div class="progress-header">
            <span class="progress-current">{{ campaign.donationCount }} ({{ campaign.progressPercent }}%)</span>
            <span class="progress-target">{{ campaign.currentTarget }}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: campaign.progressPercent + '%' }"></div>
          </div>
        </div>
        <br>
        <div class="donation-selector">
          <div class="frequency-toggle">
            <button :class="['toggle-btn', { active: isMonthly }]" @click="isMonthly = true">
              Mensuel
            </button>
            <button :class="['toggle-btn', { active: !isMonthly }]" @click="isMonthly = false">
              Unique
            </button>
          </div>
          <div class="amount-grid">
            <button v-for="(amount, index) in donationArray.amounts" :key="index"
              :class="['amount-btn', { selected: selectedAmount === amount }]" @click="selectedAmount = amount">
              <div class="amount-value">{{ amount }}{{ donationArray.symbol }}</div>
              <div class="amount-label">{{ getAmountLabel(index) }}</div>
            </button>
          </div>
          <div class="custom-amount">
            <input type="number" v-model.number="customAmount" :placeholder="`Prix libre (${donationArray.symbol})`"
              @focus="selectedAmount = null" class="custom-amount-input" />
          </div>
        </div>
        <br>
        <div class="button-container">
          <p style="font-weight: bold" v-if="selectedAmount != null"> {{ selectedAmount }} {{ donationArray.symbol }}
          </p>
          <p style="font-weight: bold" v-else-if="customAmount != null"> {{ customAmount }} {{ donationArray.symbol }}
          </p>
          <b-button class="button customButton" type="is-success"
            @click="isMonthly ? createSubscription() : createUniqueDonation()">
            <p v-if="isMonthly">Soutenir</p>
            <p v-else>Aide ponctuelle</p>
          </b-button>
        </div>
        <b-button class="button" type="is-text" @click="$parent.close()">
          Je n'ai pas les moyens
        </b-button>
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
      donationArray: {
        countryCode: "fr",
        currency: "eur",
        amounts: [2, 5, 10, 20, 50, 100],
        symbol: "€",
        symbolFirst: false
      },
      campaign: {
        donationCount: 0,
        currentLevel: 0,
        currentTarget: 0,
        nextLevel: 0,
        nextTarget: 0,
        progressPercent: 0,
        levels: []
      },
      isMonthly: true,
      selectedAmount: 10,
      customAmount: null,
      amountLabels: ["Soutien", "Basique", "Populaire", "Généreux", "Impact", "Mécène"]
    };
  },
  async mounted() {
    this.$posthog.capture(`donation-shown`);
    await Promise.all([this.getCountryByIP(), this.getCampaign(), this.donationPromptShown()]);
  },
  methods: {
    getAmountLabel(index) {
      return this.amountLabels[index] || "";
    },
    getFinalAmount() {
      if (this.customAmount && this.customAmount > 0) return this.customAmount * 100;
      return this.selectedAmount * 100;
    },
    async getCampaign() {
      try {
        const res = await axios.get(`https://donations-api.pictalk.org/v1/campaign/goals`);
        this.campaign = res.data;
        return;
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
    async createUniqueDonation() {
      try {
        this.$posthog.capture(`create-unique-donation`);
        const finalAmount = this.getFinalAmount();
        const res = await axios.post(`https://donations-api.pictalk.org/v1/donations`, {
          email: this.$store.getters.getUser.username,
          name: "Alex",
          locale: this.$i18n.locale,
          currency: this.currency,
          amount: finalAmount,
          app: "pictalk",
          successUrl: `${window.location.origin}/donation-success`,
          cancelUrl: `${window.location.origin}/donation-cancel`
        });
        if (res.data.checkoutUrl) window.open(res.data.checkoutUrl, "_blank");
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
    async createSubscription() {
      try {
        this.$posthog.capture(`create-monthly-donation`);
        const finalAmount = this.getFinalAmount();
        const res = await axios.post(`https://donations-api.pictalk.org/v1/subscriptions`, {
          email: this.$store.getters.getUser.username,
          locale: this.$i18n.locale,
          currency: this.currency,
          amount: finalAmount,
          app: "pictalk",
          successUrl: `${window.location.origin}/donation-success`,
          cancelUrl: `${window.location.origin}/donation-cancel`
        });
        if (res.data.checkoutUrl) window.open(res.data.checkoutUrl, "_blank");
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
    async getIPAdress() {
      try {
        const res = await axios.get(`https://api.ipify.org?format=json`);
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
        const ip = await this.getIPAdress();
        const res = await axios.post(`https://donations-api.pictalk.org/v1/donation-amount-panel`, { ip: ip });
        this.currency = res.data.currency.toLowerCase();
        this.donationArray = res.data;
        return;
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
    async donationPromptShown() {
      try {
        await axios.post(`https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/shown`);
        return;
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    }
  }
};
</script>

<style scoped>
.subtitle h1 {
  font-size: 1.5rem;
  margin: 0 0 0.25rem;
  font-weight: 700;
  color: #171717;
  text-align: center;
}

.subtitle p {
  font-size: 1rem;
  margin: 0 0 1rem;
  color: #444;
  text-align: center;
  line-height: 1.4;
}

.campaign-progress {
  max-width: 500px;
  margin: 0 auto;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  color: #171717;
}

.progress-current {
  color: #171717;
}

.progress-target {
  color: #171717;
}

.progress-bar-container {
  width: 100%;
  height: 32px;
  background: #E8E8E8;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #E86C4F 0%, #E86C4F 50%, #E86C4F 100%);
  border-radius: 16px;
  transition: width 0.5s ease;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

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

.donation-selector {
  max-width: 500px;
  margin: 0 auto;
}

.frequency-toggle {
  display: flex;
  background: #E8E8E8;
  border-radius: 50px;
  padding: 4px;
  margin-bottom: 1rem;
  gap: 4px;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.toggle-btn.active {
  background: #E86C4F;
  color: white;
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.amount-btn {
  padding: 1.25rem 1rem;
  border: 2px solid #E0E0E0;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.amount-btn:hover {
  border-color: #E86C4F;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 108, 79, 0.15);
}

.amount-btn.selected {
  background: #E86C4F;
  border-color: #E86C4F;
  color: white;
}

.amount-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.amount-label {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.85;
}

.amount-btn.selected .amount-label,
.amount-btn.popular .amount-label {
  opacity: 1;
}

.custom-amount {
  margin-top: 0.5rem;
}

.custom-amount-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #E0E0E0;
  border-radius: 16px;
  font-size: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  background: #F8F8F8;
  color: #999;
}

.custom-amount-input:focus {
  outline: none;
  border-color: #E86C4F;
  background: white;
  color: #333;
}

.custom-amount-input::placeholder {
  color: #999;
  font-weight: 500;
}

@media (max-width: 600px) {
  .amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .amount-value {
    font-size: 1.25rem;
  }

  .amount-label {
    font-size: 0.75rem;
  }
}
</style>