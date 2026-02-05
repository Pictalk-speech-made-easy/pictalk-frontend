<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="subtitle">
        <!-- Step 1: Initial Screen -->
        <div v-if="currentStep === 1">
          <h1>{{ donationTitle }}</h1>
          <p v-html="donationSubtitle"></p>
          <br>
          <div class="campaign-progress">
            <div class="progress-header">
              <span class="progress-current">{{ campaign.donationCount }} ({{ Math.round(campaign.progressPercent)
                }}%)</span>
              <span class="progress-target">{{ campaign.currentTarget }}</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" :style="{ width: campaign.progressPercent + '%' }"></div>
            </div>
            <div class="reward-text">{{ currentLevelReward }}</div>
          </div>
          <br>
          <div class="initial-buttons">
            <b-button class="button step-button" outlined @click="handleAlreadyGive()">
              Je soutiens déjà
            </b-button>
            <b-button class="button step-button" type="is-primary" @click="goToStep2A()">
              Je soutiens
            </b-button>
          </div>
          <div class="bottom-link">
            <b-button class="button" type="is-text" @click="goToStep2B()">
              <u>Je ne soutiens pas</u>
            </b-button>
          </div>
        </div>

        <!-- Step 2.A: Donation Selector -->
        <div v-else-if="currentStep === 2">
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
            <b-button class="button customButton" :loading="loading" type="is-success"
              @click="isMonthly ? createSubscription() : createUniqueDonation()">
              <p v-if="isMonthly">Soutenir</p>
              <p v-else>Aide ponctuelle</p>
            </b-button>
          </div>
          <div class="bottom-link">
            <b-button class="button" type="is-text" @click="currentStep = 1">
              Retour
            </b-button>
          </div>
        </div>

        <!-- Step 2.B: Reasons for Not Supporting -->
        <div v-else-if="currentStep === 3">
          <h1>Pourquoi ne souhaitez-vous pas soutenir ?</h1>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button" @click="handleReason('too-expensive')">
              1€/mois c'est trop cher
            </b-button>
            <b-button class="button reason-button" @click="handleReason('dont-want')">
              Je ne veux pas soutenir
            </b-button>
            <b-button class="button reason-button" @click="handleReason('not-happy')">
              Je ne suis pas satisfait de l'application
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" type="is-text" @click="currentStep = 1">
              Retour
            </b-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "donationModal",
  props: {
    campaign: {
      type: Object,
      required: true
    },
    donationArray: {
      type: Object,
      required: true
    },
    suggestedPrompts: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentStep: 1,
      amount: 10000,
      name: "",
      currency: "eur",
      textAlt: Math.floor(Math.random() * 4) + 1,
      isMonthly: true,
      selectedAmount: 10,
      customAmount: null,
      loading: false,
      amountLabels: ["Soutien", "Basique", "Populaire", "Généreux", "Impact", "Mécène"]
    };
  },
  computed: {
    userType() {
      const user = this.$store.getters.getUser;
      if (!user || !user.settings || !user.settings.userType) return 'parent';
      if (user.settings.userType === 'parent') return 'parent';
      return 'professional';
    },
    donationStatus() {
      const user = this.$store.getters.getUser;
      if (!user || !user.donationStatus) return 'active';
      if (user.donationStatus === 'never_donated') return 'never';
      if (user.donationStatus === 'one_time_donor') return 'onetime';
      return 'active';
    },
    abcVariant() {
      const variant = this.$posthog.getFeatureFlag('ab_test_donation_modal_v2');
      if (variant === 'B') return 'B';
      if (variant === 'C') return 'C';
      return 'A';
    },
    translationParams() {
      const minAmount = this.donationArray.amounts[0] || 2;
      return {
        donationCount: this.campaign.donationCount,
        currentTarget: this.campaign.currentTarget,
        remaining: Math.max(0, this.campaign.currentTarget - this.campaign.donationCount),
        minAmount: minAmount,
        minAmountAfterTax: (minAmount * 0.34).toFixed(2).replace('.00', ''),
        symbol: this.donationArray.symbol
      };
    },
    donationTitle() {
      const key = `DonationTitle_${this.userType}_${this.donationStatus}_${this.abcVariant}`;
      let title = this.$t(key);
      Object.keys(this.translationParams).forEach(param => {
        title = title.replace(new RegExp(`{${param}}`, 'g'), this.translationParams[param]);
      });
      return title;
    },
    donationSubtitle() {
      const key = `DonationSubtitle_${this.userType}_${this.donationStatus}_${this.abcVariant}`;
      let subtitle = this.$t(key);
      Object.keys(this.translationParams).forEach(param => {
        subtitle = subtitle.replace(new RegExp(`{${param}}`, 'g'), this.translationParams[param]);
      });
      return subtitle;
    },
    currentLevelReward() {
      const levels = [
        { target: 150, key: 'DonationRewardLevel1' },
        { target: 450, key: 'DonationRewardLevel2' },
        { target: 625, key: 'DonationRewardLevel3' },
        { target: 1000, key: 'DonationRewardLevel4' },
        { target: 1500, key: 'DonationRewardLevel5' },
        { target: 2000, key: 'DonationRewardLevel6' },
        { target: 2500, key: 'DonationRewardLevel7' }
      ];
      const currentLevel = levels.find(level => level.target === this.campaign.currentTarget) || levels[0];
      return this.$t(currentLevel.key);
    }
  },
  async mounted() {
    this.$posthog.capture(`donation-shown`);
    this.donationPromptShown();
    console.log("Campaign data: ", this.campaign);
    console.log("Donation array: ", this.donationArray);
    console.log("Suggested prompts: ", this.suggestedPrompts);
  },
  methods: {
    goToStep2A() {
      this.$posthog.capture('donation-step-support-clicked');
      this.currentStep = 2;
    },
    goToStep2B() {
      this.$posthog.capture('donation-step-no-support-clicked');
      this.currentStep = 3;
    },
    handleAlreadyGive() {
      this.$posthog.capture('donation-already-give-clicked');
      this.$parent.close();
    },
    handleReason(reason) {
      this.$posthog.capture('donation-no-support-reason', { reason });
      this.$parent.close();
    },
    getAmountLabel(index) {
      return this.amountLabels[index] || "";
    },
    getFinalAmount() {
      if (this.customAmount && this.customAmount > 0) return this.customAmount * 100;
      return this.selectedAmount * 100;
    },

    async createUniqueDonation() {
      try {
        this.loading = true;
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
        this.loading = false;
        if (res.data.checkoutUrl) window.open(res.data.checkoutUrl, "_blank");
      } catch (error) {
        console.log("error ", error);
        this.loading = false;
        return false;
      }
    },
    async createSubscription() {
      try {
        this.loading = true;
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
        this.loading = false;
        if (res.data.checkoutUrl) window.open(res.data.checkoutUrl, "_blank");
      } catch (error) {
        console.log("error ", error);
        this.loading = false;
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
.modal-card-body {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

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

.reward-text {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  font-weight: 500;
}

.initial-buttons {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.step-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.bottom-link {
  text-align: center;
  margin-top: 1.5rem;
}

.bottom-link .button {
  color: #666;
  text-decoration: underline;
  font-size: 0.9rem;
}

.reason-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.reason-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  border: 2px solid #E0E0E0;
  transition: all 0.2s ease;
}

.reason-button:hover {
  border-color: #E86C4F;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 108, 79, 0.15);
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
  .modal-card-body {
    display: flex;
    flex-direction: column;
    min-height: 70vh;
  }

  .subtitle>div[v-if] {
    display: flex;
    flex-direction: column;
    min-height: 70vh;
  }

  .subtitle h1 {
    margin-top: 10vh;
  }

  .initial-buttons {
    margin-top: auto;
    margin-bottom: 2rem;
    flex-direction: column;
  }

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