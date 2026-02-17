<template>
  <div class="modal-card" style="max-width: none !important;">
    <section class="modal-card-body">
      <div class="subtitle"
        style="height: 100%; display: flex; flex-direction: column; max-width: 48rem !important; margin: 0px auto;">
        <div v-if="currentStep === 1"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('followup-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('followup-step1-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.5rem;">
            {{ $t('followup-step1-body') }}
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div v-for="option in followupOptions" :key="option.value"
              :class="['followup-card', { 'followup-card-selected': followupAnswer === option.value }]"
              @click="followupAnswer = option.value">
              <span style="font-size: 1.25rem; flex-shrink: 0; margin-top: 1px;">{{ option.icon }}</span>
              <div style="display: flex; flex-direction: column; gap: 2px; text-align: left;">
                <strong style="font-size: 0.95rem; font-weight: 700; color: #1f2937;">{{ $t(option.titleKey) }}</strong>
                <span style="font-size: 0.85rem; color: #666;">{{ $t(option.bodyKey) }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            :disabled="!followupAnswer" @click="submitFollowup()">
            {{ $t('followup-continue') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="$parent.close()">
            {{ $t('followup-not-now') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 2 && followupAnswer === 'not_yet'"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('followup-not-yet-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('followup-not-yet-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.5rem;">
            {{ $t('followup-not-yet-body') }}
          </p>
          <div class="card" style="margin-bottom: 1.5rem;">
            <div class="card-content">
              <p
                style="font-size: 0.85rem; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 0.75rem;">
                {{ $t('followup-folder-contains') }}
              </p>
              <div v-for="(feat, idx) in folderFeatures" :key="idx"
                :style="idx < folderFeatures.length - 1 ? 'display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;' : 'display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0;'">
                <span style="font-size: 0.9rem; color: #444;">{{ $t(feat.labelKey) }}</span>
                <span
                  :style="feat.soon ? 'font-size: 0.8rem; font-weight: 700; color: #ff5757;' : 'font-size: 0.8rem; font-weight: 700; color: #22c55e;'">
                  {{ feat.soon ? $t('followup-feat-soon') : '✓' }}
                </span>
              </div>
            </div>
          </div>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            @click="downloadSlides()">
            {{ $t('followup-redownload') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="$parent.close()">
            {{ $t('followup-do-it-later') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 2 && followupAnswer === 'sent'"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">

          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('followup-sent-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('followup-sent-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.5rem;">
            {{ $t('followup-sent-body') }}
          </p>
          <p
            style="text-align: left; font-size: 1.5rem; border-width: 0px 0px 0px 5px; border-style: solid; border-color: #ff5757; background-color: #f3f4f6; padding: 0.75rem 1rem; border-radius: 0 12px 12px 0; margin-bottom: 1.5rem;">
            {{ $t('followup-sent-quote') }}
            <br>
            <span style="font-size: 1rem; color: #999; font-style: normal;">{{ $t('followup-sent-quote-cite') }}</span>
          </p>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            @click="openCalendly()">
            {{ $t('followup-book-call') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="$parent.close()">
            {{ $t('followup-wait-response') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 2 && followupAnswer === 'responded'"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('followup-responded-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1.25rem; text-align: left;">
            {{ $t('followup-responded-title') }}
          </h1>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div v-for="option in directionOptions" :key="option.value"
              :class="['followup-card', { 'followup-card-selected': directionResponse === option.value }]"
              @click="directionResponse = option.value">
              <span style="font-size: 1.25rem; flex-shrink: 0; margin-top: 1px;">{{ option.icon }}</span>
              <div style="display: flex; flex-direction: column; gap: 2px; text-align: left;">
                <strong style="font-size: 0.95rem; font-weight: 700; color: #1f2937;">{{ $t(option.titleKey) }}</strong>
                <span style="font-size: 0.85rem; color: #666;">{{ $t(option.bodyKey) }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            :disabled="!directionResponse" @click="submitDirectionResponse()">
            {{ $t('followup-continue') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="$parent.close()">
            {{ $t('followup-not-now') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 3 && directionResponse === 'positive'"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('followup-positive-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('followup-positive-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.5rem;">
            {{ $t('followup-positive-body') }}
          </p>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            @click="openCalendly()">
            {{ $t('followup-book-call') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="$parent.close()">
            {{ $t('followup-send-link-myself') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 3 && directionResponse === 'hesitant'"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('followup-hesitant-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('followup-hesitant-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.5rem;">
            {{ $t('followup-hesitant-body') }}
          </p>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            @click="openCalendly()">
            {{ $t('followup-book-call-direction') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="$parent.close()">
            {{ $t('followup-handle-myself') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 3 && directionResponse === 'negative'"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div
            style="border: solid 2px #ff5757; border-radius: 24px; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('followup-negative-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('followup-negative-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.5rem;">
            {{ $t('followup-negative-body') }}
          </p>
          <div
            style="border: 1.5px solid #ffd5d3; background: #fff9f9; border-radius: 14px; padding: 1rem; margin-bottom: 1.25rem;">
            <p style="font-size: 0.9rem; font-weight: 700; color: #ff5757; margin-bottom: 0.5rem;">
              {{ $t('followup-negative-feedback-label') }}
            </p>
            <b-field>
              <b-input v-model="negativeComment" type="textarea"
                :placeholder="$t('followup-negative-feedback-placeholder')" rows="3"
                style="border-radius: 12px;"></b-input>
            </b-field>
          </div>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            :loading="loading" @click="submitNegativeFeedback()">
            {{ $t('followup-send-and-close') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="$parent.close()">
            {{ $t('followup-close-without-sending') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 2 && followupAnswer === 'joined'"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="$parent.close()">✕</b-button>
          </div>
          <div style="text-align: center; padding: 2rem 0 1.5rem;">
            <div style="font-size: 52px; margin-bottom: 1rem;">🎉</div>
            <div
              style="border: solid 2px #ff5757; border-radius: 24px; margin: 0 auto 0.5rem; padding: 0.25rem 0.5rem; display: inline-block;">
              {{ $t('followup-joined-badge') }}
            </div>
            <h1 style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 1rem 0; text-align: center;">
              {{ $t('followup-joined-title') }}
            </h1>
            <p style="text-align: center; font-size: 1.25rem; color: #444;">
              {{ $t('followup-joined-body') }}
            </p>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
            <div class="av av-red">M</div>
            <div class="av av-dark">S</div>
            <div class="av av-gray">L</div>
            <div class="av av-purple">A</div>
            <div class="av av-blue">T</div>
            <span style="font-size: 0.9rem; color: #666; margin-left: 10px;">{{ $t('followup-joined-count') }}</span>
          </div>
          <div style="flex: 1;"></div>
          <b-button class="button step-button" style="border: solid 2px; border-color: gray;" type="is-primary"
            @click="$parent.close()">
            {{ $t('followup-joined-cta') }}
          </b-button>
        </div>

      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "membershipFollowupModal",
  data() {
    return {
      currentStep: 1,
      loading: false,
      followupAnswer: null,
      directionResponse: null,
      negativeComment: "",
      followupOptions: [
        { value: 'not_yet', icon: '⏳', titleKey: 'followup-option-not-yet-title', bodyKey: 'followup-option-not-yet-body' },
        { value: 'sent', icon: '📨', titleKey: 'followup-option-sent-title', bodyKey: 'followup-option-sent-body' },
        { value: 'responded', icon: '💬', titleKey: 'followup-option-responded-title', bodyKey: 'followup-option-responded-body' },
        { value: 'joined', icon: '🎉', titleKey: 'followup-option-joined-title', bodyKey: 'followup-option-joined-body' },
      ],
      directionOptions: [
        { value: 'positive', icon: '👍', titleKey: 'followup-direction-positive-title', bodyKey: 'followup-direction-positive-body' },
        { value: 'hesitant', icon: '🤔', titleKey: 'followup-direction-hesitant-title', bodyKey: 'followup-direction-hesitant-body' },
        { value: 'negative', icon: '👎', titleKey: 'followup-direction-negative-title', bodyKey: 'followup-direction-negative-body' },
      ],
      folderFeatures: [
        { labelKey: 'followup-feat-savings', soon: false },
        { labelKey: 'followup-feat-association', soon: false },
        { labelKey: 'followup-feat-pro', soon: true },
        { labelKey: 'followup-feat-membership', soon: false },
      ]
    };
  },
  mounted() {
    this.$posthog?.capture("membership-followup-modal-shown");
  },
  methods: {
    async submitFollowup() {
      if (!this.followupAnswer) return;
      try {
        this.$posthog?.capture(`membership-followup-${this.followupAnswer}`);
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: `followup-${this.followupAnswer}` }
        );
      } catch (error) {
        console.log("error", error);
      }
      this.currentStep = 2;
    },
    async submitDirectionResponse() {
      if (!this.directionResponse) return;
      try {
        this.$posthog?.capture(`membership-direction-response-${this.directionResponse}`);
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: `direction-${this.directionResponse}` }
        );
      } catch (error) {
        console.log("error", error);
      }
      this.currentStep = 3;
    },
    async submitNegativeFeedback() {
      try {
        this.loading = true;
        this.$posthog?.capture("membership-direction-negative-feedback");
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: "direction-negative", comment: this.negativeComment }
        );
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
        this.$parent.close();
      }
    },
    downloadSlides() {
      this.$posthog?.capture("membership-followup-slides-downloaded");
      window.open("https://www.canva.com/design/DAHA8Fp2l4o/t4vm3Wguktz-UcHTN18F7A/edit?utm_content=DAHA8Fp2l4o&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton", "_blank");
      this.$parent.close();
    },
    openCalendly() {
      this.$posthog?.capture("membership-followup-calendly-clicked");
      window.open("https://calendly.com/pictalk/adhesion", "_blank");
      this.$parent.close();
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

/* Selector cards (followup answers, direction responses) */
.followup-card {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: #fff;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.followup-card:hover {
  border-color: #ff5757;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 87, 87, 0.15);
}

.followup-card-selected {
  border-color: #ff5757;
  background: #fff9f9;
}

/* Avatar stack */
.av {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.av:first-child {
  margin-left: 0;
}

.av-red {
  background: #ff5757;
}

.av-dark {
  background: #1f2937;
}

.av-gray {
  background: #888;
}

.av-purple {
  background: #7c3aed;
}

.av-blue {
  background: #0891b2;
}

/* Buttons */
.step-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;
}

@media (max-width: 600px) {
  .modal-card-body {
    padding: 1rem;
    min-height: 70vh;
  }
}
</style>