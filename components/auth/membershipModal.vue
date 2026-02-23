<template>
  <div class="modal-card" style="max-width: none !important;">
    <section class="modal-card-body">
      <div class="subtitle"
        style="height: 100%; display: flex; flex-direction: column; max-width: 48rem !important; margin: 0px auto;">
        <div v-if="currentStep === 1"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="goToDecline()">✕</b-button>
          </div>
          <div style="color: #ff5757; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('membership-pro-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('membership-step1-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.25rem;">
            {{ $t('membership-step1-body') }}
          </p>
          <p
            style="text-align: left; font-size: 1.5rem; border-width: 0px 0px 0px 5px; border-style: solid; border-color: #ff5757; background-color: #f3f4f6; padding: 0.75rem 1rem; border-radius: 0 12px 12px 0; margin-bottom: 1.25rem;">
            {{ $t('membership-step1-quote') }}
            <br>
            <span style="font-size: 1rem; color: #999; font-style: normal;">{{ $t('membership-step1-quote-cite')
              }}</span>
          </p>
          <div class="comments-wall" ref="commentsWall">
            <div class="comment-item" v-for="(comment, index) in comments" :key="index">
              <div class="comment-header">
                <span class="comment-author">{{ comment.customerName }}</span>
              </div>
              <p class="comment-text">"{{ truncate(comment.comment) }}"</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; margin: 1rem 0 1.5rem;">
            <div class="av av-red">M</div>
            <div class="av av-dark">S</div>
            <div class="av av-gray">L</div>
            <div class="av av-purple">A</div>
            <div class="av av-blue">T</div>
            <span style="font-size: 0.9rem; color: #666; margin-left: 10px;">{{ $t('membership-pros-count') }}</span>
          </div>
          <div style="flex: 1;"></div>
          <h1
            style="font-size: 2rem; color: #1f2937; line-height: 1.95rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('membership-step1-transition') }}
          </h1>
          <b-button class="button step-button"
            style="border: solid 2px; border-color: gray;height: auto; max-height: none;" type="is-primary"
            @click="currentStep = 2">
            {{ $t('membership-step1-cta') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="handleRemindLater()">
            {{ $t('membership-remind-later') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 2"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">

          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="goToDecline()">✕</b-button>
          </div>
          <div style="color: #ff5757; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('membership-risk-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('membership-step2-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.25rem;">
            {{ $t('membership-step2-body') }}
          </p>
          <div class="card-content">
            <div style="text-align: right; font-size: 0.9rem; color: #666; font-style: italic; margin-bottom: 0.25rem;">
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
            <p style="font-size: 0.85rem; color: #666; text-align: center; margin-top: 0.5rem; font-style: italic;">
              {{ $t('membership-campaign-label') }}
            </p>
          </div>
          <div
            style="border: 1.5px solid #ffd5d3; background: #fff9f9; border-radius: 14px; padding: 1rem; margin-bottom: 1.5rem;">
            <p style="font-size: 0.9rem; font-weight: 700; color: #ff5757; margin-bottom: 0.75rem;">
              {{ $t('membership-at-stake-title') }}
            </p>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
              <li>✓ {{ $t('membership-at-stake-1') }}</li>
              <li>✓ {{ $t('membership-at-stake-2') }}</li>
              <li>✓ {{ $t('membership-at-stake-3') }}</li>
            </ul>
          </div>
          <div style="flex: 1;"></div>
          <b-button class="button step-button"
            style="border: solid 2px; border-color: gray;height: auto; max-height: none;" type="is-primary"
            @click="currentStep = 3">
            {{ $t('membership-step2-cta') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="currentStep = 1">
            {{ $t('return') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 3"
          style="width: 100%; margin: 1rem auto; height: 100%; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
            <b-button type="is-text" style="color: #666;" @click="goToDecline()">✕</b-button>
          </div>
          <div style="color: #ff5757; margin-right: auto; margin-bottom: 0.5rem; padding: 0.25rem 0.5rem;">
            {{ $t('membership-action-badge') }}
          </div>
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('membership-step3-title') }}
          </h1>
          <p style="text-align: left; font-size: 1.25rem; margin-bottom: 1.25rem;">
            {{ $t('membership-step3-body') }}
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div v-for="(pill, idx) in stepPills" :key="idx"
              style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.75rem; background: #f3f4f6; border-radius: 12px; border: 1px solid #e5e7eb;">
              <div
                style="width: 28px; height: 28px; background: #ff5757; color: #fff; border-radius: 50%; font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                {{ idx + 1 }}
              </div>
              <div style="font-size: 0.9rem; line-height: 1.5; color: #444; text-align: left;">
                <strong style="color: #1f2937; display: block; margin-bottom: 0.125rem; font-size: 0.95rem;">{{
                  $t(pill.titleKey) }}</strong>
                {{ $t(pill.bodyKey) }}
              </div>
            </div>
          </div>
          <div style="flex: 1;"></div>
          <b-button class="button step-button"
            style="border: solid 2px; border-color: gray;height: auto; max-height: none;" type="is-primary"
            @click="downloadSlides()">
            {{ $t('membership-download-slides') }}
          </b-button>
          <b-button class="button step-button" style="margin-top: 0.75rem; border-radius: 12px;"
            @click="openCalendly()">
            {{ $t('membership-book-call') }}
          </b-button>
          <b-button class="button" style="font-size: 1rem; margin-top: 0.75rem;" type="is-text"
            @click="currentStep = 2">
            {{ $t('return') }}
          </b-button>
        </div>
        <div v-else-if="currentStep === 99">
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('why-not-support') }}
          </h1>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleRemindLater()">
              {{ $t('membership-reason-later') }}
            </b-button>
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('not_using')">
              {{ $t('i-dont-use-app') }}
            </b-button>
            <b-button class="button reason-button" style="border: solid 2px; border-color: gray;"
              @click="handleReason('other')">
              {{ $t('other-reason-specify') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = stepBeforeDecline">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>
        <div v-else-if="currentStep === 100">
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('whats-wrong') }}
          </h1>
          <p style="font-size: 1rem; color: #666; margin-bottom: 1.5rem; text-align: left;">
            {{ $t('your-feedback-helps') }}
          </p>
          <br>
          <div class="reason-buttons">
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('missing-features') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="toggleDontUseReason('missing-features')">
              {{ $t('missing-important-features') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('too-many-bugs') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="toggleDontUseReason('too-many-bugs')">
              {{ $t('too-many-bugs') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('not-my-needs') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="toggleDontUseReason('not-my-needs')">
              {{ $t('not-my-needs') }}
            </b-button>
            <b-button class="button reason-button"
              :style="selectedDontUseReasons.includes('other-dont-use') ? 'border: solid 2px; border-color: #E86C4F; background: rgba(232, 108, 79, 0.1);' : 'border: solid 2px; border-color: gray;'"
              @click="toggleDontUseReason('other-dont-use')">
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
                style="border-radius: 12px;"></b-input>
            </b-field>
            <b-button class="button step-button" style="background: #E86C4F; color: white; margin-top: 1rem;"
              @click="submitDontUseFeedback" :loading="loading">
              {{ $t('Send') }}
            </b-button>
          </div>
          <br>
          <div class="bottom-link">
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = 99">
              {{ $t('return') }}
            </b-button>
          </div>
        </div>
        <div v-else-if="currentStep === 101">
          <h1
            style="font-size: 3rem; color: #1f2937; line-height: 2.5rem; margin: 0px; margin-bottom: 1rem; text-align: left;">
            {{ $t('explain-to-us') }}
          </h1>
          <p style="font-size: 1rem; color: #666; margin-bottom: 1.5rem; text-align: left;">
            {{ $t('what-prevents-contribution') }}
          </p>
          <br>
          <b-field>
            <b-input v-model="otherReasonComment" type="textarea" :placeholder="$t('your-feedback-placeholder')"
              rows="5" style="border-radius: 12px;"></b-input>
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
            <b-button class="button" style="font-size: 1rem;" type="is-text" @click="currentStep = 99">
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
  name: "membershipModal",
  props: {
    campaign: {
      type: Object,
      required: true
      // { donationCount, progressPercent, currentTarget, levelDeadline }
    }
  },
  data() {
    return {
      comments: [],
      autoScrollInterval: null,
      currentStep: 1,
      stepBeforeDecline: 1,
      loading: false,
      selectedDontUseReasons: [],
      dontUseComment: "",
      otherReasonComment: "",
      stepPills: [
        { titleKey: 'membership-pill1-title', bodyKey: 'membership-pill1-body' },
        { titleKey: 'membership-pill2-title', bodyKey: 'membership-pill2-body' },
        { titleKey: 'membership-pill3-title', bodyKey: 'membership-pill3-body' },
      ]
    };
  },
  computed: {
    fileUrl() {
      return `https://www.pictalk.org/${this.$i18n.locale}/pictalk/pros?print`
    },
    daysLeft() {
      const today = new Date();
      const endDate = new Date(this.campaign.levelDeadline);
      const timeDiff = endDate - today;
      if (timeDiff <= 0) return this.$t("campaign-ended");
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return this.$t("campaign-days-left").replace("{days}", days);
    }
  },
  beforeDestroy() {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
  },
  async mounted() {
    this.$posthog?.capture("membership-modal-shown");
    await this.getComments();
    this.startAutoScroll();
  },
  methods: {
    truncate(text) {
      if (!text) return "";
      if (text.length <= 300) return text;
      return text.substring(0, 300) + "...";
    },
    startAutoScroll() {
      if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = setInterval(() => {
        const container = this.$refs.commentsWall;
        if (container) {
          const itemHeight = container.querySelector(".comment-item")?.offsetHeight || 100;
          if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
            container.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            container.scrollBy({ top: itemHeight, behavior: "smooth" });
          }
        }
      }, 5000);
    },
    async getComments() {
      try {
        const res = await axios.get("https://donations-api.pictalk.org/v1/donations/comments");
        this.comments = res.data.comments;
      } catch (error) {
        console.log("error", error);
      }
    },
    async donationPromptShown(action) {
      // action: "email" | "slides" | "meeting" | "decline" | "reschedule" | "followup_answer"
      // anwser: "not_yet" | "sent" | "responded" | "joined"
      // response: "positive" | "hesitant" | "negative"
      try {
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/shown`
          , {
            type: this.$store.getters.getUser.settings.userType || "unknown",
            action: action,
            // rescheduleDate: ...CONDITION && { rescheduleDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          });
        const prompts = this.$store.getters.getSuggestedPrompts;
        prompts.membership = false;
        this.$store.commit("setSuggestedPrompts", prompts);
        this.$store.dispatch("fetchSuggestedPrompts");
      } catch (error) {
        console.log("error", error);
      }
    },
    goToDecline() {
      this.stepBeforeDecline = this.currentStep;
      this.selectedDontUseReasons = [];
      this.dontUseComment = "";
      this.otherReasonComment = "";
      this.currentStep = 99;
    },
    async handleRemindLater() {
      this.$posthog?.capture("membership-modal-remind-later");
      this.donationPromptShown("reschedule");
      this.$parent.close();
    },
    async handleReason(reason) {
      this.$posthog?.capture(`membership-no-support-${reason}`);
      if (reason === "not_using") { this.currentStep = 100; return; }
      if (reason === "other") { this.currentStep = 101; return; }
    },
    toggleDontUseReason(reason) {
      if (this.selectedDontUseReasons.includes(reason)) {
        this.selectedDontUseReasons = this.selectedDontUseReasons.filter(r => r !== reason);
      } else {
        this.selectedDontUseReasons.push(reason);
      }
    },
    async submitDontUseFeedback() {
      if (!this.selectedDontUseReasons || this.selectedDontUseReasons.length === 0) return;
      try {
        this.loading = true;
        this.$posthog?.capture(`membership-not-using-${this.selectedDontUseReasons.join(",")}`);
        this.donationPromptShown("decline");
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          {
            reason: "not_using",
            metadata: { locale: this.$i18n.locale, issues: this.selectedDontUseReasons },
            comment: this.dontUseComment
          }
        );
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
        this.$parent.close();
      }
    },
    async submitOtherReasonFeedback() {
      if (!this.otherReasonComment || this.otherReasonComment.trim() === "") return;
      try {
        this.loading = true;
        this.$posthog?.capture("membership-other-reason");
        this.donationPromptShown("decline");
        await axios.post(
          `https://donations-api.pictalk.org/v1/users/${this.$store.getters.getUser.username}/donation-prompt/declined`,
          { reason: "other", comment: this.otherReasonComment }
        );
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
        this.$parent.close();
      }
    },
    downloadSlides() {
      this.$posthog?.capture("membership-slides-downloaded");
      this.donationPromptShown("slides");
      window.open(this.fileUrl, "_blank");
      this.$parent.close();
    },
    openCalendly() {
      this.$posthog?.capture("membership-calendly-clicked");
      this.donationPromptShown("meeting");
      window.open("https://calendar.app.google/3XpRac9XBXTXZxtv9", "_blank");
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

/* Comments wall */
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

.comment-text {
  color: #4b5563;
  font-style: italic;
  margin: 0;
}

/* Progress bar */
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

/* Buttons */
.step-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;
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
  height: auto;
  word-break: break-word;
}

.reason-button:hover {
  border-color: #ff5757;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 87, 87, 0.15);
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

@media (max-width: 600px) {
  .modal-card-body {
    padding: 1rem;
    min-height: 70vh;
  }
}
</style>