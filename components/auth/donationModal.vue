<template>
  <div class="modal-card" style="max-width: none !important;">
    <section class="modal-card-body">
      <div class="subtitle"
        style="height: 100%; display: flex; flex-direction: column; max-width: 48rem !important; margin: 0px auto;">
        <div v-if="currentStep === 1"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">

          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('DonationFinanceSolidarity') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('DonationWhyTitle', { count: since }) }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem;">{{ donationWhyDescription }}</p>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin-top: 2rem; margin-bottom: 1rem; text-align: left;">
            {{ donationHowTitle }}
          </h1>
          <p
            style="text-align: left; font-size: 1.5rem; border-width: 0px 0px 0px 5px; border-style: solid; border-color: #999; background-color: #f3f4f6; padding-left: 4px;">
            {{ $t('DonationHowDescription') }}</p>
          <ul style="font-size: 1.25rem; margin-bottom: 2rem;">
            <li>✓ {{ $t('Advantages_no-ads') }}</li>
            <li>✓ {{ $t('Advantages_no-shareholders') }}</li>
            <li>✓ {{ $t('Advantages_independent') }}</li>
            <li>✓ {{ $t('Advantages_private-data') }}</li>
            <li>✓ {{ $t('Advantages_accessible') }}</li>
          </ul>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            @click="goToStep2A()">
            {{ $t('DonationCTA') }}
          </b-button>
          <p style="text-align: center; margin-top: 0.25rem;">
            <span style="font-weight: 400; color: #1f2937; font-style: italic;">{{
              $t('donate-from-x').replace('{minAmount}',
                formatAmount(donationArray.currency === "EUR" ? 1 : donationArray.amounts[0])).replace('{symbol}',
                  donationArray.symbol) }}</span>
          </p>
          <div style=" margin: 3rem auto;">
            <svg xmlns="http://www.w3.org/2000/svg" style="width: 3rem; height: 3rem; color: #000;"
              viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
              <path fill="currentColor"
                d="m12 22l-7-7l1.4-1.425l4.6 4.6V11h2v7.175l4.6-4.575L19 15zM11 9V6h2v3zm0-5V2h2v2z" />
            </svg>
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ donationTitle }}</h1>
          <p style="text-align: left; font-size: 1.25rem;" v-html="donationSubtitle"></p>
          <br>
          <div class="campaign-progress card">
            <div class="card-content">
              <div
                style="text-align: right; font-size: 0.9rem; color: #666; font-style: italic; margin-bottom: 0.25rem;">
                {{ daysLeft }}
              </div>
              <div class="progress-header">
                <span class="progress-current">{{ campaign.donationCount }} ({{ Math.round(campaign.progressPercent)
                }}%)</span>
                <span class="progress-target">{{ campaign.currentTarget }}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: campaign.progressPercent + '%' }"></div>
              </div>
              <div v-if="!isExpanded">
                <p class="reward-text">{{ currentLevelReward }}</p>
                <div style="text-align: center; margin-top: 0.5rem; cursor: pointer; color: #666;"
                  @click="isExpanded = true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                    viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
                    <path fill="currentColor" d="m12 15.375l-6-6l1.4-1.4l4.6 4.6l4.6-4.6l1.4 1.4z" />
                  </svg>
                </div>
              </div>
              <div v-else>
                <p class="reward-text" style="font-style: italic; margin-bottom: 1rem;">{{ daysLeft }}</p>
                <ul class="timeline timeline-vertical">
                  <li v-for="(reward, idx) in visibleRewards" :key="idx" :class="{
                    'timeline-item-past': reward.status === 'past',
                    'timeline-item-current': reward.status === 'current',
                    'timeline-item-pending': reward.status === 'pending',
                    'timeline-item-first': idx === 0,
                    'timeline-item-last': idx === visibleRewards.length - 1
                  }">
                    <div class="timeline-middle"
                      :style="{ color: reward.status === 'past' ? '#4CAF50' : reward.status === 'current' ? '#ff5757' : '#9CA3AF' }">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor"
                          d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
                      </svg>
                    </div>
                    <div class="timeline-end timeline-box"
                      :class="{ 'box-current': reward.status === 'current', 'box-pending': reward.status === 'pending' }">
                      <span>{{ $t(reward.key) }}</span>
                    </div>
                  </li>
                </ul>

                <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
                  <a href="http://www.pictalk.org/fr/support-us" target="_blank">
                    <b-button class="is-text">
                      {{ $t('KnowMore') }}
                    </b-button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <br>
          <div class="comments-wall" ref="commentsWall">
            <div class="comment-item" v-for="(comment, index) in comments" :key="index">
              <div class="comment-header">
                <span class="comment-author">{{ comment.customerName }}</span>
                <span class="comment-amount" v-if="comment.amount">{{ comment.amount / 100 }} {{ comment.currency
                }}</span>
              </div>
              <p class="comment-text">"{{ truncate(comment.comment) }}"</p>
            </div>
          </div>
          <br>
          <div style="padding-bottom: 2rem; width: 100%;">
            <b-button class="button" style="font-size: 1.125rem; width: 100%;" @click="goToStep2B()">
              {{ $t('i-dont-support') }}
            </b-button>
          </div>
        </div>
        <div v-else-if="currentStep === 2" style="height: 100%; width: 100%; display: flex; flex-direction: column;">
          <div style="margin-top: 2rem;">
            <div class="amount-grid">
              <button v-for="(amount, index) in displayedAmounts" :key="index"
                :class="['amount-btn', { selected: selectedAmount === amount }]" @click="selectedAmount = amount">
                <div class="amount-value">{{ formatAmount(amount) }}</div>
              </button>
            </div>
            <div class="custom-amount">
              <input type="number" min="0" v-model.number="customAmount"
                :placeholder="`Prix libre (${donationArray.symbol})`" @focus="selectedAmount = null"
                class="custom-amount-input" />
            </div>
            <div v-if="currentMessage" class="selected-message"
              style="margin-top: 1rem; padding: 1rem; background-color: #f3f4f6; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h3 v-if="currentMessage.title" style="font-weight: 700; margin-bottom: 0.25rem; color: #1f2937;">{{
                currentMessage.title }}</h3>
              <p style="text-align: left; margin: 0; color: #4b5563; font-size: 0.95rem; line-height: 1.4;">{{
                currentMessage.body }}</p>
            </div>
            <p style="margin-top: 1.5rem; text-align: left;">
              <span>{{ $t('donation-why-monthly') }}</span>
              <span style="font-weight: 600;">{{ $t('donate-from-x').replace('{minAmount}',
                formatAmount(donationArray.currency === "EUR" ? 1 : displayedAmounts[0])).replace('{symbol}',
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
              {{ $t('ThatIs').replace('{amount}', formatAmount(amountAfterTax)) }}<span v-if="isMonthly">{{
                $t('per-month') }}</span>
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
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('why-not-support') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem;">{{ $t('why-not-support-description', { count: since }) }}</p>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('prefer-unique')">
              {{ $t('prefers-unique') }}
            </b-button>
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('not_using')">
              {{ $t('i-dont-use-app') }}
            </b-button>
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('no_money')">
              {{ $t('no-money-now') }}
            </b-button>
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('other')">
              {{ $t('other-reason-specify') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = 1">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>

        <div v-else-if="currentStep === 4">
          <h1 style="font-size: 2rem; color: #1f2937; line-height: 1.75rem; margin-bottom: 1rem; text-align: left;">
            {{ $t('whats-wrong') }}
          </h1>
          <p style="font-size: 1rem; color: #666; margin-bottom: 1.5rem; text-align: left;">
            {{ $t('your-feedback-helps') }}
          </p>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('missing-features') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="selectedDontUseReasons.includes('missing-features') ? selectedDontUseReasons = selectedDontUseReasons.filter(r => r !== 'missing-features') : selectedDontUseReasons.push('missing-features')">
              {{ $t('missing-important-features') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('too-many-bugs') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="selectedDontUseReasons.includes('too-many-bugs') ? selectedDontUseReasons = selectedDontUseReasons.filter(r => r !== 'too-many-bugs') : selectedDontUseReasons.push('too-many-bugs')">
              {{ $t('too-many-bugs') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('not-my-needs') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="selectedDontUseReasons.includes('not-my-needs') ? selectedDontUseReasons = selectedDontUseReasons.filter(r => r !== 'not-my-needs') : selectedDontUseReasons.push('not-my-needs')">
              {{ $t('not-my-needs') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('other-dont-use') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="selectedDontUseReasons.includes('other-dont-use') ? selectedDontUseReasons = selectedDontUseReasons.filter(r => r !== 'other-dont-use') : selectedDontUseReasons.push('other-dont-use')">
              {{ $t('other-reason-specify') }}
            </b-button>
          </div>
          <br>
          <div v-if="selectedDontUseReasons.length > 0" style="margin-top: 1rem;">
            <p style="font-size: 1rem; color: #333; margin-bottom: 0.5rem; text-align: left; font-weight: 600;">
              {{ $t('what-should-we-change') }}
            </p>
            <b-field>
              <b-input v-model="dontUseComment" type="textarea" :placeholder="$t('your-feedback-placeholder')" rows="4"
                style="border-radius: 12px;">
              </b-input>
            </b-field>
            <b-button class="button step-button" style="background: #E86C4F; color: white; margin-top: 1rem;"
              @click="submitDontUseFeedback" :loading="loading">
              {{ $t('Send') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = 3">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>
        <div v-else-if="currentStep === 5">
          <h1 style="font-size: 2rem; color: #1f2937; line-height: 1.75rem; margin-bottom: 1rem; text-align: center;">
            {{ $t('we-understand') }}
          </h1>
          <p style="font-size: 1.1rem; color: #444; margin: 2rem 0; text-align: center; line-height: 1.6;">
            {{ $t('solidarity-model-message') }}
          </p>
          <br>
          <div class="initial-buttons">
            <b-button class="button step-button" style="background: #E86C4F; color: white;" @click="handleNoMoneyClose">
              {{ $t('continue-using-pictalk') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = 3">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>
        <div v-else-if="currentStep === 6">
          <h1 style="font-size: 2rem; color: #1f2937; line-height: 1.75rem; margin-bottom: 1rem; text-align: left;">
            {{ $t('explain-to-us') }}
          </h1>
          <p style="font-size: 1rem; color: #666; margin-bottom: 1.5rem; text-align: left;">
            {{ $t('what-prevents-contribution') }}
          </p>
          <br>
          <b-field>
            <b-input v-model="otherReasonComment" type="textarea" :placeholder="$t('your-feedback-placeholder')"
              rows="5" style="border-radius: 12px;">
            </b-input>
          </b-field>
          <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem; text-align: left;">
            💡 {{ $t('feedback-helps-financing') }}
          </p>
          <br>
          <b-button class="button step-button" style="background: #E86C4F; color: white; margin-top: 1rem;"
            @click="submitOtherReasonFeedback" :loading="loading">
            {{ $t('Send') }}
          </b-button>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = 3">
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
import dayjs from "~/utils/dayjs";
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
      comments: [],
      autoScrollInterval: null,
      currentStep: 1,
      amount: 10000,
      name: "",
      currency: "eur",
      textAlt: Math.floor(Math.random() * 4) + 1,
      isMonthly: true,
      selectedAmount: 10,
      customAmount: null,
      loading: false,
      isExpanded: false,
      selectedDontUseReasons: [],
      dontUseComment: "",
      otherReasonComment: ""
    };
  },
  computed: {
    since() {
      return dayjs.duration(dayjs().diff(dayjs.unix(this.$store.getters.getUser.createdDate / 1000), 'days'), 'days').locale(this.$i18n.locale).humanize();
    },
    displayedAmounts() {
      if (this.isMonthly) return this.donationArray.amounts;
      const amounts = [...this.donationArray.amounts];
      return [...amounts.slice(1), amounts[amounts.length - 1] * 2];
    },
    daysLeft() {
      const today = new Date();
      const endDate = new Date(this.campaign.levelDeadline);
      const timeDiff = endDate - today;
      if (timeDiff <= 0) return this.$t('campaign-ended');
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return this.$t('campaign-days-left').replace('{days}', days);
    },
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
        count: this.since,
        donationCount: this.campaign.donationCount,
        currentTarget: this.campaign.currentTarget,
        remaining: Math.max(0, this.campaign.currentTarget - this.campaign.donationCount),
        minAmount: minAmount,
        minAmountAfterTax: (minAmount * 0.34).toFixed(2).replace('.00', ''),
        symbol: this.donationArray.symbol,
      };
    },
    donationWhyTitle() {
      const key = `DonationWhyTitle_${this.abcVariant}`;
      let text = this.$t(key);
      Object.keys(this.translationParams).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), this.translationParams[param]);
      });
      return text;
    },
    donationWhyDescription() {
      const key = `DonationWhyDescription_${this.abcVariant}`;
      let text = this.$t(key);
      Object.keys(this.translationParams).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), this.translationParams[param]);
      });
      return text;
    },
    donationHowTitle() {
      const key = `DonationHowTitle_${this.abcVariant}`;
      let text = this.$t(key);
      Object.keys(this.translationParams).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), this.translationParams[param]);
      });
      return text;
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
    },
    selectedAmountIndex() {
      if (!this.displayedAmounts) return -1;
      return this.displayedAmounts.indexOf(this.selectedAmount) + 1;
    },
    currentMessage() {
      const index = this.selectedAmountIndex;
      if (index === -1) return null;
      const titleKey = `${this.isMonthly ? '' : 'OneTime'}DonationMessage_${index}_Title`;
      const bodyKey = `${this.isMonthly ? '' : 'OneTime'}DonationMessage_${index}_Body`;

      const hasTitle = this.$te(titleKey);
      const hasBody = this.$te(bodyKey);

      if (!hasBody && !hasTitle) return null;

      return {
        title: hasTitle ? this.$t(titleKey) : '',
        body: hasBody ? this.$t(bodyKey) : ''
      };
    }
  },
  beforeDestroy() {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
  },
  async mounted() {
    this.$posthog.capture(`donation-shown`);
    this.donationPromptShown();
    await this.getComments();
    this.startAutoScroll();
  },
  methods: {
    truncate(text) {
      if (!text) return '';
      if (text.length <= 300) return text;
      return text.substring(0, 300) + '...';
    },
    startAutoScroll() {
      if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = setInterval(() => {
        const container = this.$refs.commentsWall;
        if (container) {
          const itemHeight = container.querySelector('.comment-item')?.offsetHeight || 100;
          if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ top: itemHeight, behavior: 'smooth' });
          }
        }
      }, 5000);
    },
    async getComments() {
      try {
        const res = await axios.get(`https://donations-api.pictalk.org/v1/donations/comments`);
        return this.comments = res.data.comments;
      } catch (error) {
        console.log("error ", error);
        return [];
      }
    },
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
    async handleReason(reason, comment = null) {
      this.$posthog.capture(`donation-no-support-${reason}`);

      if (reason === 'prefer-unique') {
        this.isMonthly = false;
        this.currentStep = 2;
        return;
      }

      if (reason === 'not_using') {
        this.currentStep = 4;
        return;
      }

      if (reason === 'no_money') {
        this.currentStep = 5;
        return;
      }

      if (reason === 'other') {
        this.currentStep = 6;
        return;
      }

      // Fallback for any other reason
      await axios.post(`https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`, {
        reason: reason,
        comment: comment
      });
      this.$parent.close();
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
    },
    async submitDontUseFeedback() {
      if (!this.selectedDontUseReasons || this.selectedDontUseReasons.length === 0) return;

      try {
        this.loading = true;
        this.$posthog.capture(`donation-not-using-${this.selectedDontUseReasons.join(',')}`);

        await axios.post(`https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`, {
          reason: 'not_using',
          metadata: {
            locale: this.$i18n.locale,
            issues: this.selectedDontUseReasons,
          },
          comment: this.dontUseComment
        });

        this.loading = false;
        this.$parent.close();
      } catch (error) {
        console.log("error ", error);
        this.loading = false;
      }
    },
    async handleNoMoneyClose() {
      try {
        this.$posthog.capture('donation-no-money');
        await axios.post(`https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`, {
          reason: 'no_money'
        });

        this.$parent.close();
      } catch (error) {
        console.log("error ", error);
        this.$parent.close();
      }
    },
    async submitOtherReasonFeedback() {
      if (!this.otherReasonComment || this.otherReasonComment.trim() === '') {
        return;
      }

      try {
        this.loading = true;
        this.$posthog.capture('donation-other-reason');

        await axios.post(`https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`, {
          reason: 'other',
          comment: this.otherReasonComment
        });

        this.loading = false;
        this.$parent.close();
      } catch (error) {
        console.log("error ", error);
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.comments-wall {
  max-height: 150px;
  overflow-y: auto;
  margin-bottom: 1rem;
  scrollbar-width: thin;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.comments-wall::-webkit-scrollbar {
  width: 6px;
}

.comments-wall::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.comment-item {
  scroll-snap-align: start;
  margin-bottom: 0.75rem;
  background: #f5f5f5;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.4;
  text-align: left;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  color: #666;
}

.comment-author {
  font-weight: 700;
  color: #333;
}

.comment-amount {
  background: #e6f4ea;
  color: #1e7e34;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.8rem;
}

.comment-text {
  color: #4b5563;
  font-style: italic;
  margin: 0;
}

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
  color: #333131;
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
  white-space: normal;
  /* allows text to wrap */
  height: auto;
  /* lets the button grow with the content */
  word-break: break-word;
  /* optional: handles very long single words */
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

/* Timeline styles (DaisyUI-inspired vertical timeline) */
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

/* Continuous vertical line running through the dots */
.timeline-vertical>li::before {
  content: '';
  position: absolute;
  left: 9px;
  /* center of the 20px column */
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #d1d5db;
}

/* Hide line above first item */
.timeline-vertical>li.timeline-item-first::before {
  top: 50%;
}

/* Hide line below last item */
.timeline-vertical>li.timeline-item-last::before {
  bottom: 50%;
}

/* Only item: no line at all */
.timeline-vertical>li.timeline-item-first.timeline-item-last::before {
  display: none;
}

/* Color the line for past items */
.timeline-vertical>li.timeline-item-past::before {
  background-color: #4CAF50;
}

/* Color the line for current item: top half colored, bottom half gray */
.timeline-vertical>li.timeline-item-current::before {
  background: linear-gradient(to bottom, #ff5757 50%, #d1d5db 50%);
}

/* The dot in the middle */
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

/* The content box */
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