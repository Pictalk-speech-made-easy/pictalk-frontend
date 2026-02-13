<template>
  <div class="hero-donation" @click="openDonationModal">
    <div class="hero-content">
      <div class="campaign-progress">
        <h2 class="reward-text">{{ currentLevelReward }}</h2>
        <div class="days-left">{{ daysLeft }}</div>
        <div class="progress-header">
          <span class="progress-target">{{ $t('MonthlySupport').replace('{count}', campaign.currentTarget) }}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{ width: campaign.progressPercent + '%' }"></div>
          <div class="progress-text">{{ campaign.donationCount }} ({{ Math.round(campaign.progressPercent) }}%)</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DonationModal from "@/components/auth/donationModal.vue";
export default {
  name: "HeroDonation",
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
      isExpanded: false
    };
  },
  methods: {
    toggleRewards() {
      this.isExpanded = !this.isExpanded;
    },
    openDonationModal() {
      setTimeout(() => {
        this.$buefy.modal.open({
          parent: this,
          props: {
            campaign: this.$store.getters.getCampaign,
            donationArray: this.$store.getters.getDonationPanel,
            suggestedPrompts: this.$store.getters.getSuggestedPrompts
          },
          component: DonationModal,
          hasModalCard: true,
          customClass: "custom-class custom-class-2",
          trapFocus: true,
          fullScreen: true,
          canCancel: ["escape", "x"]
        });
      }, 500);
    }
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
      const variant = this.$posthog.getFeatureFlag('ab_test_donation_modal');
      if (variant === 'test') return 'B';
      if (variant === 'experiment') return 'C';
      return 'A';
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
    daysLeft() {
      const today = new Date();
      const endDate = new Date(this.campaign.levelDeadline);
      const timeDiff = endDate - today;
      if (timeDiff <= 0) return this.$t('campaign-ended');
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return this.$t('campaign-days-left').replace('{days}', days);
    },
    currentLevelReward() {
      const currentLevel = this.levels.find(level => level.target === this.campaign.currentTarget) || this.levels[0];
      return this.$t(currentLevel.key);
    },
    levels() {
      return [
        { target: 150, key: 'DonationRewardLevel1' },
        { target: 450, key: 'DonationRewardLevel2' },
        { target: 625, key: 'DonationRewardLevel3' },
        { target: 1000, key: 'DonationRewardLevel4' },
        { target: 1500, key: 'DonationRewardLevel5' },
        { target: 2000, key: 'DonationRewardLevel6' },
        { target: 2500, key: 'DonationRewardLevel7' }
      ];
    },
    visibleRewards() {
      const currentTarget = this.campaign.currentTarget;
      const currentLevelIndex = this.levels.findIndex(l => l.target === currentTarget);

      const rewards = [];

      for (let i = 0; i < currentLevelIndex; i++) {
        rewards.push({ ...this.levels[i], status: 'past' });
      }

      if (currentLevelIndex !== -1) {
        rewards.push({ ...this.levels[currentLevelIndex], status: 'current' });
      }

      if (currentLevelIndex === 0) {
        rewards.push({ ...this.levels[1], status: 'pending' });
      }

      const level5Index = this.levels.findIndex(l => l.key === 'DonationRewardLevel5');
      if (level5Index !== -1 && currentLevelIndex < level5Index) {
        rewards.push({ ...this.levels[level5Index], status: 'pending' });
      }

      return rewards;
    }
  }
};
</script>

<style scoped>
.hero-donation {
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-donation:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.75rem;
  text-align: center;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #4b5563;
  margin: 0 0 1.5rem;
  text-align: center;
  line-height: 1.5;
}

.campaign-progress {
  background: #ff57570e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: solid 2px #ff5757;
}

.days-left {
  text-align: right;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: #171717;
}

.progress-target {
  color: #171717;
}

.progress-bar-container {
  width: 100%;
  height: 40px;
  background: #E8E8E8;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff5757 0%, #ff5757 50%, #ff5757 100%);
  border-radius: 20px;
  transition: width 0.5s ease;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: 1.125rem;
  color: #171717;
  z-index: 1;
  white-space: nowrap;
}

.reward-text {
  margin: 0;
  font-size: 1.5rem;
  color: #333131;
  text-align: left;
  font-weight: 500;
}

.rewards-toggle {
  margin-top: 1.5rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s;
}

.toggle-btn:hover {
  color: #ff5757;
}

.rewards-timeline {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
}

.cta-container {
  margin-top: 2rem;
  text-align: center;
}

.cta-button {
  background: #ff5757;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 87, 87, 0.3);
}

.cta-button:hover {
  background: #ff4040;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 87, 87, 0.4);
}

/* Timeline styles (same as donationModal) */
.timeline {
  list-style: none;
  padding: 0;
  margin: 0 0 0 0.5rem;
}

.timeline-vertical {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-vertical>li {
  display: grid;
  grid-template-columns: 20px 1fr;
  column-gap: 0.75rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.timeline-vertical>li:last-child {
  padding-bottom: 0;
}

.timeline-vertical>li::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #d1d5db;
}

.timeline-vertical>li.timeline-item-first::before {
  top: 50%;
}

.timeline-vertical>li.timeline-item-last::before {
  bottom: 50%;
}

.timeline-vertical>li.timeline-item-first.timeline-item-last::before {
  display: none;
}

.timeline-vertical>li.timeline-item-past::before {
  background-color: #4CAF50;
}

.timeline-vertical>li.timeline-item-current::before {
  background: linear-gradient(to bottom, #ff5757 50%, #d1d5db 50%);
}

.timeline-middle {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  position: relative;
  z-index: 1;
}

.timeline-middle svg {
  width: 20px;
  height: 20px;
  display: block;
  flex-shrink: 0;
  background: white;
  border-radius: 50%;
}

.timeline-end {
  grid-column: 2;
  grid-row: 1;
  align-self: center;
}

.timeline-box {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid transparent;
  background-color: rgba(231, 91, 60, 0.05);
  text-align: left;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  color: #e75b3c;
}

.timeline-box.box-current {
  border-color: #ff5757;
  color: #ff5757;
  background-color: rgba(255, 87, 87, 0.05);
}

.timeline-box.box-pending {
  opacity: 0.5;
  color: #9CA3AF;
}

@media (max-width: 600px) {
  .hero-donation {
    padding: 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .campaign-progress {
    padding: 1rem;
  }

  .progress-header {
    font-size: 1rem;
  }

  .progress-bar-container {
    height: 32px;
  }

  .progress-text {
    font-size: 1rem;
  }

  .cta-button {
    width: 100%;
    padding: 1rem 2rem;
  }
}
</style>
