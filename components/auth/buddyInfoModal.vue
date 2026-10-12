<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p align="center" class="modal-card-title">{{ $t('BuddyMigrationTitle') }}</p>
    </header>
    <section class="modal-card-body">
      <p class="is-size-6">{{ $t('BuddyMigrationIntro') }}</p>
      <ul class="buddy-benefits">
        <li>{{ $t('BuddyMigrationBenefit1') }}</li>
        <li>{{ $t('BuddyMigrationBenefit2') }}</li>
        <li>{{ $t('BuddyMigrationBenefit3') }}</li>
        <li>{{ $t('BuddyMigrationBenefit4') }}</li>
        <li v-if="isProfessional">{{ $t('BuddyMigrationBenefitPro') }}</li>
      </ul>
      <p v-if="!isProfessional" class="buddy-pricing-note">{{ $t('BuddyMigrationPricingFamily') }}</p>
      <p class="has-text-centered buddy-learn-more">
        <a :href="buddyPageUrl" target="_blank" rel="noopener noreferrer">{{
          $t('BannerCta') }}</a>
      </p>
    </section>
    <footer class="modal-card-foot">
      <b-button class="fullWidth" @click="$parent.close()">{{ $t('Close') }}</b-button>
    </footer>
  </div>
</template>

<script>
import buddy from "@/mixins/buddy";
export default {
  name: "buddyInfoModal",
  mixins: [buddy],
  computed: {
    isProfessional() {
      const userType = this.$store.getters.getUser?.settings?.userType;
      return !!userType && userType !== 'parent';
    },
  },
};
</script>

<style scoped>
.fullWidth {
  width: 100%;
}

.modal-card-title {
  flex-shrink: 1;
}

.modal-card-body {
  flex-grow: 0;
}

.buddy-benefits {
  list-style-type: disc;
  margin: 0.75rem 0 0 1.2rem;
  padding: 0;
}

.buddy-benefits li {
  margin-bottom: 0.25rem;
}

.buddy-pricing-note {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.buddy-learn-more {
  margin-top: 0.75rem;
}
</style>
