<template>
  <div>SUCCESS</div>
</template>
<script>
import lang from "@/mixins/lang";
import axios from "axios";
export default {
  name: "donation-success",
  nuxtI18n: false,
  layout: "pictalk",
  mixins: [lang],
  async mounted() {
    const sessionId = this.$route.query.session_id;
    if (!sessionId) return;
    const session = await this.getSessionStatus();
    if (session.status === "complete") {
      this.$posthog.capture(`${session.donationType}-donation-completed`);
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