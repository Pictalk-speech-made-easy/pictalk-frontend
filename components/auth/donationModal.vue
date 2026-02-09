<template>
  <div class="modal-card" style="max-width: none !important;">
    <section class="modal-card-body">
      <div class="subtitle" style="height: 100%; display: flex; flex-direction: column;">
        <div v-if="currentStep === 1"
          style="max-width: 32rem; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <h1 style="font-size: 2rem; color: #1f2937; line-height: 1.75rem; margin-bottom: 1rem; text-align: left;">
            {{
              donationTitle }}</h1>
          <p style="text-align: left;" v-html="donationSubtitle"></p>
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
          <div
            style="display: flex; flex-direction: column; width: 100%; max-width: 24rem; margin: auto auto 0px auto;">
            <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
              @click="goToStep2A()">
              {{ $t('i-support') }}
            </b-button>
            <p style="text-align: center; margin-top: 0.25rem;">
              <span style="font-weight: 400; color: #1f2937; font-style: italic;">{{
                $t('donate-from-x').replace('{minAmount}',
                  formatAmount(donationArray.currency === "EUR" ? 1 : donationArray.amounts[0])).replace('{symbol}',
                    donationArray.symbol) }}</span>
            </p>
          </div>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="goToStep2B()">
              {{ $t('i-dont-support') }}
            </b-button>
          </div>
        </div>
        <div v-else-if="currentStep === 2" style="height: 100%; width: 100%; display: flex; flex-direction: column;">
          <div style="margin-top: 2rem;">
            <div class="amount-grid">
              <button v-for="(amount, index) in donationArray.amounts" :key="index"
                :class="['amount-btn', { selected: selectedAmount === amount }]" @click="selectedAmount = amount">
                <div class="amount-value">{{ formatAmount(amount) }}</div>
              </button>
            </div>
            <div class="custom-amount">
              <input type="number" v-model.number="customAmount" :placeholder="`Prix libre (${donationArray.symbol})`"
                @focus="selectedAmount = null" class="custom-amount-input" />
            </div>
            <p style="margin-top: 1.5rem; text-align: left;">
              <span>{{ $t('donation-why-monthly') }}</span>
              <span style="font-weight: 600;">{{ $t('donate-from-x').replace('{minAmount}',
                formatAmount(donationArray.currency === "EUR" ? 1 : donationArray.amounts[0])).replace('{symbol}',
                  donationArray.symbol) }}</span>
            </p>
          </div>
          <br>
          <div style="display: flex; flex-direction: column; margin-top: auto; gap: 0px;">
            <p style="font-size: 1.5rem; font-weight: normal; color: #1f2937; margin: 0px;"
              v-if="(selectedAmount != null || customAmount != null) && amountAfterTax != null">
              {{ formatAmount(selectedAmount ?? customAmount) }} <span v-if="isMonthly">{{ $t('per-month') }}</span>
            </p>
            <p style="font-size: 2rem; font-weight:900; color: black; margin: 0px;" v-else-if="amountAfterTax == null">
              {{ formatAmount(selectedAmount ?? customAmount) }}<span v-if="isMonthly">{{ $t('per-month') }}</span>
            </p>
            <p style="font-size: 2rem; font-weight:900; color: black; margin: 0px;" v-if="amountAfterTax">
              Soit {{ formatAmount(amountAfterTax) }}<span v-if="isMonthly">{{ $t('per-month') }}</span>
            </p>
            <p v-if="amountAfterTax" style="font-size: 1rem; margin: 0px; color: #ff5757;">{{ $t('after-reduction') }}
            </p>
            <b-button class="button customButton" style="margin-top: 2rem; min-height: 4rem; border-radius: 12px;"
              :loading="loading" type="is-success" @click="isMonthly ? createSubscription() : createUniqueDonation()">
              <p style="margin: 0px; font-size: 1.5rem; font-weight: 800; color: black;">
                <span v-if="isMonthly">{{ $t('support') }}</span>
                <span v-else>{{ $t('short-help') }}</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  style="width: 1.5rem; height: 1.5rem; display: inline-block; margin-left: 0.5rem; transform: translateY(0.25rem);"
                  viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
                  <path fill="currentColor"
                    d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z" />
                </svg>
              </p>
            </b-button>
          </div>
          <div style="display: flex; flex-direction: column;">
            <b-button class="button" type="is-text" @click="currentStep = 1">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>
        <div v-else-if="currentStep === 3">
          <h1 style="font-size: 2rem; color: #1f2937; line-height: 1.75rem; margin-bottom: 1rem; text-align: left;">
            {{ $t('why-not-support') }}
          </h1>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('too-expensive')">
              {{ $t('too-expensive').replace('{minAmount}', formatAmount(donationArray.currency === "EUR" ? 1 :
                donationArray.amounts[0])).replace('{symbol}',
                  donationArray.symbol) }}
            </b-button>
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('prefer-unique')">
              {{ $t('prefers-unique') }}
            </b-button>
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('dont-use-app')">
              {{ $t('i-dont-use-app') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = 1">
              {{ $t('return') }}
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
      loading: false
    };
  },
  computed: {
    amountAfterTax() {
      if (this.donationArray.countryCode !== "FR") return null;
      const amount = this.customAmount && this.customAmount > 0
        ? this.customAmount
        : this.selectedAmount;
      if (!amount) return null;
      const afterTax = (amount * 0.34).toFixed(2).replace('.00', '');
      return afterTax;
    },
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
      const variant = this.$posthog.getFeatureFlag('ab_test_donation_modal');
      if (variant === 'test') return 'B';
      if (variant === 'experiment') return 'C';
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
        symbol: this.donationArray.symbol,
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
  },
  methods: {
    formatAmount(amount) {
      if (amount === null || amount === undefined) return '';
      if (this.donationArray.symbolFirst) {
        return `${this.donationArray.symbol}${amount}`;
      }
      return `${amount}${this.donationArray.symbol}`;
    },
    goToStep2A() {
      this.$posthog.capture('donation-step-support-clicked');
      this.isMonthly = true;
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
      this.$posthog.capture(`donation-no-support-${reason}`);
      if (reason !== 'prefer-unique') {
        this.$parent.close();
        return;
      }
      this.isMonthly = false;
      this.currentStep = 2;
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
          locale: this.$i18n.locale,
          currency: this.currency,
          amount: finalAmount,
          app: "pictalk",
          successUrl: `${window.location.origin}/donation-success`,
          cancelUrl: `${window.location.origin}/donation-cancel`
        });
        this.loading = false;
        if (res.data.checkoutUrl) window.open(res.data.checkoutUrl);
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
        if (res.data.checkoutUrl) window.open(res.data.checkoutUrl);
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
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff5757 0%, #ff5757 50%, #ff5757 100%);
  border-radius: 4px;
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
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.amount-btn:hover {
  border-color: #ff5757;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 108, 79, 0.15);
}

.amount-btn.selected {
  background: #ff5757;
  border-color: #ff5757;
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
  min-height: 4rem;
  text-align: center;
  transition: all 0.2s ease;
  background: #F8F8F8;
  color: #1f2937;
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