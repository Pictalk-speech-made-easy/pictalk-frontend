<template>
  <div v-if="loading">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
      viewBox="0 0 24 24"><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
          <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate"
            values="0 12 12;360 12 12" />
        </path>
        <path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity=".3"
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0" />
        </path>
      </g>
    </svg>
  </div>
  <div class="subtitle" v-else>
    <svg xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 1rem; color: #10b981; max-height: 10rem;" fill="none"
      viewBox="0 0 24 24"><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path stroke-dasharray="64" stroke-dashoffset="64"
          d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
        </path>
        <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12l3 3l5 -5">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0" />
        </path>
      </g>
    </svg>
    <h1 style="font-size: 2rem; color: #1f2937; line-height: 1.75rem; margin-bottom: 1rem; text-align: left;">
      {{
        $t('DonationThanks') }}</h1>
    <p style="text-align: left;">{{ $t('DonationThanksDonor').replace('{name}', session.customerName) }}</p>
    <p style="margin-bottom: 0; font-style: italic">{{ $t('DonationTransactionOk') }}</p>
    <div class="donation-details">
      <div class="detail-row">
        <span class="detail-label">{{ $t('DonationAmount') }}</span>
        <span class="detail-value">{{ displayedAmount }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">{{ $t('DonationEmail') }}</span>
        <span class="detail-value">{{ session.customerEmail }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">{{ $t('DonationReference') }}</span>
        <span class="detail-value">{{ session.subscriptionId ?? session.paymentIntentId }}</span>
      </div>
    </div>
    <b-message class="message-box" type="is-success" v-if="session.countryCode === 'FR'">
      <h2>{{ $t('DonationAmountReduction').replace('{amount}', reducedAmount) }}</h2>
      <p>{{ $t('DonationAmountReductionExplanation') }}</p>
    </b-message>
    <b-message class="message-box" type="is-info">
      <h2>{{ $t('DonationImpact') }}</h2>
      <p>{{ $t('DonationImpactExplanation') }}</p>
    </b-message>
    <b-button type="is-primary" tag="nuxt-link" :to="pictalkHome">{{ $t('Home') }}</b-button>
  </div>
</template>
<script>
import lang from "@/mixins/lang";
import axios from "axios";
export default {
  name: "donation-success",
  nuxtI18n: false,
  layout: "pictalk",
  mixins: [lang],
  data() { return { session: null, loading: true, } },
  computed: {
    pictalkHome() {
      if (this.$store.getters.getRootId) {
        return "/pictalk/?fatherCollectionId=" + this.$store.getters.getRootId;
      } else {
        return "/pictalk/";
      }
    },
    displayedAmount() {
      if (!this.session) return ''; const amountVal = this.session.amountTotal / 100; const
        amount = this.session.symboleFirst ? `${this.session.symbol}${amountVal}` : `${amountVal}${this.session.symbol}`;
      return this.session.donationType === 'monthly' ? `${amount}/mois` : amount;
    }, reducedAmount() {
      if
        (!this.session) return ''; const calculatedAmount = (this.session.amountTotal * 0.34) / 100; const
          roundedAmount = this.session.amountTotal > 500000 ? Math.round(calculatedAmount) : calculatedAmount.toFixed(2);

      let formattedAmount = this.session.symboleFirst
        ? `${this.session.symbol}${roundedAmount}`
        : `${roundedAmount}${this.session.symbol}`;

      return this.session.donationType === 'monthly' ? `${formattedAmount}/mois` : formattedAmount;
    }
  },
  async mounted() {
    const sessionId = this.$route.query.session_id;
    if (!sessionId) {
      this.loading = false;
      return;
    }
    this.session = await this.getSessionStatus(sessionId);

    if (this.session && this.session.status === "complete") {
      if (this.$posthog) {
        this.$posthog.capture(`${this.session.donationType}-donation-completed`);
      }
    }
    this.loading = false;
  },
  methods: {
    async getSessionStatus(sessionId) {
      try {
        if (!sessionId) return null;
        const res = await axios.get(`https://donations-api.pictalk.org/v1/checkout/${sessionId}/status`);
        return res.data;
      } catch (error) {
        console.log("error ", error);
        return null;
      }
    },
  }
};
</script>
<style scoped>
.subtitle {
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

.donation-details {
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 1.5rem 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 1rem;
  color: #374151;
  font-weight: 400;
}

.detail-value {
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
}

.message-box h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-align: left;
}

.message-box p {
  font-size: 0.9375rem;
  margin: 0;
  text-align: left;
  line-height: 1.5;
}
</style>