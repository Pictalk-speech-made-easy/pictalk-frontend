<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p align="center" class="modal-card-title">{{ $t('BuddyMigrationTitle') }}</p>
    </header>
    <section class="modal-card-body">
      <div class="buddy-content">
        <a :href="buddyStoreUrl" target="_blank" rel="noopener noreferrer" class="buddy-screenshot">
          <img :src="require('@/assets/pictalk_buddy.webp')" alt="Pictalk Buddy screenshot" />
        </a>
        <div class="buddy-features-card">
          <p class="is-size-6">{{ $t('BuddyMigrationIntro') }}</p>
          <ul class="buddy-benefits">
            <li>{{ $t('BuddyMigrationBenefit1') }}</li>
            <li>{{ $t('BuddyMigrationBenefit2') }}</li>
            <li>{{ $t('BuddyMigrationBenefit3') }}</li>
            <li>{{ $t('BuddyMigrationBenefit4') }}</li>
            <li v-if="isProfessional">{{ $t('BuddyMigrationBenefitPro') }}</li>
          </ul>
        </div>
      </div>
      <p class="has-text-centered buddy-learn-more">
        <a :href="`https://www.pictalk.org/${$i18n.locale}/buddy/`" target="_blank" rel="noopener noreferrer">{{
          $t('BannerCta') }}</a>
      </p>
      <p v-if="!isProfessional" class="buddy-pricing-note">{{ $t('BuddyMigrationPricingFamily') }}</p>
    </section>
    <footer class="modal-card-foot buddy-migration-foot">
      <a :href="buddyStoreUrl" target="_blank" rel="noopener noreferrer" class="fullWidth">
        <b-button type="is-primary" class="fullWidth" icon-right="arrow-right">
          {{ $t('BuddyMigrationCTA') }}
        </b-button>
      </a>
      <p class="has-text-centered buddy-reassurance">{{ $t('BuddyMigrationReassurance') }}</p>
      <b-button type="is-text" class="fullWidth" @click="$parent.close()">{{ $t('BuddyMigrationRemindLater') }}</b-button>
    </footer>
  </div>
</template>

<script>
import deviceInfos from "@/mixins/deviceInfos";
export default {
  name: "buddyMigrationModal",
  mixins: [deviceInfos],
  computed: {
    userType() {
      const user = this.$store.getters.getUser;
      if (!user || !user.settings || !user.settings.userType) return 'parent';
      if (user.settings.userType === 'parent') return 'parent';
      return 'professional';
    },
    isProfessional() {
      return this.userType === 'professional';
    },
    buddyStoreUrl() {
      const os = this.getOSInfo();
      if (os == "Mac/iOS" || os == "iPad" || os == "iPhone") {
        return "https://apps.apple.com/fr/app/agenda-caa/id6502835578";
      }
      return "https://play.google.com/store/apps/details?id=org.pictime.application.twa";
    },
  },
};
</script>

<style scoped>
.fullWidth {
  width: 100%;
}

.modal-card-body {
  flex-grow: 0;
}

.buddy-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.buddy-screenshot {
  flex: 0 0 40%;
  max-width: 40%;
}

.buddy-screenshot img {
  width: 100%;
  height: auto;
  display: block;
}

.buddy-features-card {
  flex: 1;
}

.buddy-benefits {
  list-style-type: disc;
  margin-left: 1.2rem;
  padding: 0;
}

.buddy-benefits li {
  margin-bottom: 0.25rem;
}

.buddy-learn-more {
  margin-top: 1rem;
}

.buddy-pricing-note {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.buddy-migration-foot {
  flex-direction: column;
  gap: 0.35rem;
}

.buddy-reassurance {
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}

@media screen and (max-width: 480px) {
  .buddy-content {
    flex-direction: column;
  }

  .buddy-screenshot {
    flex: none;
    max-width: 70%;
    margin: 0 auto;
  }
}
</style>
