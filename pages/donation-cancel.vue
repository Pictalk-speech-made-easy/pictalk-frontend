<template>
  <div style="display: flex; flex-direction: column; padding: 2rem;">
    <svg xmlns="http://www.w3.org/2000/svg" style="width: 8rem; height: 8rem; color: orangered; margin: 0px auto;"
      viewBox="0 0 24 24"><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path stroke-dasharray="64" stroke-dashoffset="64"
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
        </path>
        <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 12l4 4M12 12l-4 -4M12 12l-4 4M12 12l4 -4">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
        </path>
      </g>
    </svg>
    <p style="font-size: 3rem; font-weight: bolder; text-align: center; margin-bottom: 0.5rem;">{{
      $t('DonationTransactionFail_Title') }}</p>
    <p style="font-size: medium; text-align: center;">{{ $t('DonationTransactionFail_Description') }}</p>
    <b-button style="margin-top: 2rem;" type="is-primary" tag="nuxt-link" :to="pictalkHome">{{ $t('Home') }}</b-button>
  </div>
</template>
<script>
import lang from "@/mixins/lang";
import axios from "axios";
export default {
  name: "donation-cancel",
  nuxtI18n: false,
  layout: "pictalk",
  mixins: [lang],
  data() {
    return {
      donationInterval: null,
    };
  },
  mounted() {
    const sessionId = this.$route.query.session_id;
    if (!sessionId) return;
    this.donationInterval = setInterval(async () => {
      const session = await this.getSessionStatus();
      if (session.status === "expired") {
        this.$posthog.capture(`${session.donationType}_donation_cancelled`);
        clearInterval(this.donationInterval);
        this.donationInterval = null;
      }
    }, 10000);
  },
  computed: {
    pictalkHome() {
      if (this.$store.getters.getRootId) {
        return "/pictalk/?fatherCollectionId=" + this.$store.getters.getRootId;
      } else {
        return "/pictalk/";
      }
    }
  },
  methods: {
    async getSessionStatus() {
      try {
        const sessionId = this.$route.query.session_id;
        if (!sessionId) return null;
        const res = await axios.get(`https://donations-api.pictalk.org/v1/checkout/${sessionId}/status`);
        return res.data;
      } catch (error) {
        console.log("error ", error);
        return false;
      }
    },
  }
};
</script>