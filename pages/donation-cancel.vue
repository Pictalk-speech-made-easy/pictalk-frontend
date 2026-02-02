<template>
  <div>CANCEL</div>
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