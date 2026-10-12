<template>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="buddy-modal-title" :dir="dir">
    <header class="modal-card-head">
      <div>
        <h2 id="buddy-modal-title" class="modal-card-title">{{ $t(isNewUser ? 'BuddySignupTitle' : 'BuddyReadyTitle') }}</h2>
        <p v-if="isNewUser" class="buddy-subtitle">{{ $t('BuddySignupIntro') }}</p>
        <p v-else class="buddy-deadline">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M4 11h16" />
          </svg>
          {{ $t('BuddyDeadline', { date: deadlineText }) }}
        </p>
      </div>
    </header>
    <section class="modal-card-body">
      <div class="buddy-hero" :class="{ 'is-compact': !isNewUser }">
        <img class="buddy-screenshot" :srcset="require('@/assets/pictalk_buddy.webp').srcSet" sizes="200px" alt="" />
        <div class="buddy-hero-text">
          <p v-if="!isNewUser" class="buddy-lead">{{ $t('BuddyReadyIntro') }}</p>
          <div class="buddy-stats">
            <div>
              <p class="buddy-stat-value">{{ ratingText }}<span class="is-sr-only"> / 5</span></p>
              <p class="buddy-stars" aria-hidden="true">★★★★★</p>
            </div>
            <div>
              <p class="buddy-stat-value">{{ usersText }}</p>
              <p class="buddy-stat-label">{{ $t('BuddyStatUsers') }}</p>
            </div>
          </div>
          <buddy-cta v-if="isNewUser" stacked />
        </div>
      </div>
      <template v-if="!isNewUser">
        <p class="buddy-steps-title">{{ $t('BuddyStepsLeft') }}</p>
        <!-- role="list": Safari drops list semantics when list-style is none -->
        <ol class="buddy-timeline" role="list">
          <li class="is-done">
            <span class="buddy-dot" aria-hidden="true">✓</span>
            <div class="buddy-step">
              <p class="buddy-step-title"><span class="is-sr-only">{{ $t('BuddyStepDone') }} : </span>{{ $t('BuddyStepAccount') }}</p>
              <p class="buddy-step-desc">{{ $t('BuddyStepAccountDesc') }}</p>
            </div>
          </li>
          <li class="is-current" aria-current="step">
            <span class="buddy-dot">1</span>
            <div class="buddy-step">
              <p class="buddy-step-title">{{ $t(showWebApp ? 'BuddyStepOpen' : 'BuddyStepDownload') }}</p>
              <buddy-cta />
            </div>
          </li>
          <li class="is-next">
            <span class="buddy-dot">2</span>
            <div class="buddy-step">
              <p class="buddy-step-title">{{ $t('BuddyStepSignIn') }}</p>
              <p v-if="email" class="buddy-step-desc buddy-email">{{ email }}</p>
            </div>
          </li>
        </ol>
        <p class="buddy-reassurance">{{ $t('BuddyMigrationReassurance') }}</p>
      </template>
    </section>
    <footer class="modal-card-foot buddy-foot">
      <a v-if="isNewUser" :href="buddyPageUrl" target="_blank"
        rel="noopener noreferrer">{{ $t('BannerCta') }}</a>
      <b-button v-else type="is-text" @click="openInfo">{{ $t('BuddyWhySwitch') }}</b-button>
      <b-button type="is-text" @click="$parent.close()">
        {{ $t(isNewUser ? 'Close' : 'BuddyMigrationRemindLater') }}
      </b-button>
    </footer>
  </div>
</template>

<script>
import buddy, { DEADLINE } from "@/mixins/buddy";
import BuddyCta from "@/components/auth/buddyCta";
import BuddyInfoModal from "@/components/auth/buddyInfoModal";
const LAST_SHOWN_KEY = "buddyModalLastShown";
export default {
  name: "buddyMigrationModal",
  // Reminder cadence tightens as the shutdown approaches: weekly, every 3 days under 30 days left, daily under 7.
  isReminderDue(now = Date.now()) {
    const daysLeft = (DEADLINE - now) / 864e5;
    const gapDays = daysLeft <= 7 ? 1 : daysLeft <= 30 ? 3 : 7;
    let lastShown = 0;
    try { lastShown = +localStorage.getItem(LAST_SHOWN_KEY) || 0; } catch (e) { }
    return now - lastShown >= gapDays * 864e5;
  },
  components: { BuddyCta },
  mixins: [buddy],
  props: {
    isNewUser: { type: Boolean, default: false },
  },
  mounted() {
    if (this.isNewUser) return;
    try { localStorage.setItem(LAST_SHOWN_KEY, Date.now()); } catch (e) { }
  },
  computed: {
    email() {
      return this.$store.getters.getUser?.username;
    },
    ratingText() {
      return (4.8).toLocaleString(this.$i18n.locale, { minimumFractionDigits: 1 });
    },
    usersText() {
      return (6000).toLocaleString(this.$i18n.locale) + "+";
    },
  },
  methods: {
    openInfo() {
      this.$buefy.modal.open({
        parent: this,
        component: BuddyInfoModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ["escape", "outside"],
      });
    },
  },
};
</script>

<style scoped>
/* Colours are WCAG AA on white and on the tinted step card: #c62828 is the accessible variant of the brand red */
.modal-card-head,
.modal-card-foot {
  background: #fff;
}

.modal-card-head {
  border-bottom: none;
  padding: 16px 20px 0;
}

.modal-card-title {
  flex-shrink: 1;
  font-weight: 600;
}

.buddy-subtitle {
  margin-top: 0.25rem;
  color: #666;
}

.modal-card-body {
  flex-grow: 0;
}

.buddy-lead {
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}

.buddy-deadline {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-style: italic;
  color: #c62828;
}

.buddy-deadline svg {
  vertical-align: -0.15em;
  margin-inline-end: 0.15rem;
}

.buddy-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem 1.5rem;
}

.buddy-screenshot {
  max-height: 160px;
  width: auto;
}

.buddy-hero-text {
  flex: 0 1 320px;
}

.buddy-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.buddy-stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
}

.buddy-stat-label,
.buddy-stars {
  font-size: 0.875rem;
  color: #666;
}

.buddy-stars {
  color: #a15c00;
}

.buddy-steps-title {
  margin: 1rem 0 0.5rem;
  font-weight: 600;
}

/* Vertical timeline: icon rail with a connecting line, one tinted card per step */
.buddy-timeline {
  list-style: none;
  margin: 0;
}

.buddy-timeline li {
  position: relative;
  display: flex;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}

.buddy-timeline li:not(:last-child)::before {
  content: "";
  position: absolute;
  inset-inline-start: 11px;
  top: calc(0.45rem + 24px);
  bottom: 0.25rem;
  width: 2px;
  background: #ddd;
}

.buddy-dot {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 0.45rem;
  border: 2px solid #c62828;
  border-radius: 50%;
  background: #fff;
  color: #c62828;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}

.buddy-step {
  flex: 1;
  min-width: 0;
  background: rgba(255, 87, 87, 0.08);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}

.buddy-step-title {
  color: #c62828;
  font-weight: 600;
}

.buddy-step-desc {
  font-size: 0.9rem;
  color: #555;
}

.is-current .buddy-step {
  border: 2px solid #c62828;
}

.is-current .buddy-step-title {
  font-size: 1.1rem;
}

.is-next .buddy-dot {
  border-color: #6b6b6b;
  color: #6b6b6b;
}

.is-next .buddy-step {
  background: #f5f5f5;
}

.is-next .buddy-step-title {
  color: #555;
  font-weight: 500;
}

.is-done .buddy-dot {
  border-color: #257a52;
  background: #257a52;
  color: #fff;
}

.is-done .buddy-step {
  background: #f5f5f5;
}

.is-done .buddy-step-title,
.is-done .buddy-step-desc {
  color: #595959;
}

.buddy-email {
  font-family: monospace;
  overflow-wrap: anywhere;
}

.buddy-reassurance {
  margin-inline-start: 2.25rem;
  font-size: 0.9rem;
  color: #6b6b6b;
}

.buddy-foot {
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding: 0.25rem 20px;
  gap: 1rem;
  font-size: 0.95rem;
}

/* 44px touch targets; both footer actions are deliberately quiet so the CTA stays the only strong button */
.buddy-foot a,
.buddy-foot .button {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  height: auto;
  padding-inline: 0;
  justify-content: flex-start;
  text-align: start;
  white-space: normal;
  color: #595959;
  text-decoration: underline;
}

/* Only the long left label wraps; the short close label keeps one line */
.buddy-foot > :last-child {
  flex-shrink: 0;
}

.modal-card a:focus-visible,
.modal-card .button:focus-visible {
  outline: 3px solid #1a1a1a;
  outline-offset: 2px;
  box-shadow: none;
}

@media (max-width: 480px) {
  .is-compact .buddy-screenshot {
    max-height: 75px;
  }
}
</style>
