<template>
  <!-- Desktop browser: the web app is the one action; stores shrink to a text line. Elsewhere: the store button. -->
  <div class="buddy-cta" :class="{ 'is-stacked': stacked }">
    <template v-if="showWebApp">
      <b-button tag="a" :href="webAppUrl" target="_blank" rel="noopener noreferrer" type="is-primary"
        size="is-medium" icon-left="web">{{ $t('BuddyOpenWeb') }}<svg class="cta-arrow" viewBox="0 0 10 16" aria-hidden="true"><path d="M0 0H2L10 8L2 16H0V0ZM6.22667 8L2.66667 4.44V11.56L6.22667 8Z" fill="currentColor" /></svg></b-button>
      <p class="buddy-other-stores">
        {{ $t('BuddyOnPhone') }}
        <a v-if="!isAndroid" :href="appStoreUrl" target="_blank" rel="noopener noreferrer"
          :aria-label="`${$t('BuddyStepDownload')} – App Store`">App Store</a>
        <template v-if="!isAndroid && !isApple"> · </template>
        <a v-if="!isApple" :href="playStoreUrl" target="_blank" rel="noopener noreferrer"
          :aria-label="`${$t('BuddyStepDownload')} – Google Play`">Google Play</a>
      </p>
    </template>
    <div v-else class="buttons buddy-stores">
      <b-button v-if="!isAndroid" tag="a" :href="appStoreUrl" target="_blank" rel="noopener noreferrer"
        type="is-primary" size="is-medium" :aria-label="`${$t('BuddyStepDownload')} – App Store`">
        <img class="store-logo" :srcset="require('@/assets/AppleStoreLogo.png').srcSet" alt="" />App Store<svg class="cta-arrow" viewBox="0 0 10 16" aria-hidden="true"><path d="M0 0H2L10 8L2 16H0V0ZM6.22667 8L2.66667 4.44V11.56L6.22667 8Z" fill="currentColor" /></svg>
      </b-button>
      <b-button v-if="!isApple" tag="a" :href="playStoreUrl" target="_blank" rel="noopener noreferrer"
        type="is-primary" size="is-medium" :aria-label="`${$t('BuddyStepDownload')} – Google Play`">
        <img class="store-logo" :srcset="require('@/assets/PlayStoreLogo.png').srcSet" alt="" />Google Play<svg class="cta-arrow" viewBox="0 0 10 16" aria-hidden="true"><path d="M0 0H2L10 8L2 16H0V0ZM6.22667 8L2.66667 4.44V11.56L6.22667 8Z" fill="currentColor" /></svg>
      </b-button>
    </div>
  </div>
</template>

<script>
import buddy from "@/mixins/buddy";
export default {
  name: "buddyCta",
  mixins: [buddy],
  props: {
    // Full-width buttons, one per row (modal B's narrow hero column)
    stacked: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.buddy-cta {
  margin-top: 0.75rem;
}

.buddy-stores {
  margin: 0;
  gap: 0.5rem;
}

/* Spacing comes from gap; out-rank Bulma's .buttons .button:not(:last-child) margins */
.buttons.buddy-stores .button.button {
  margin: 0;
}

.is-stacked .button {
  flex: 1 1 100%;
  width: 100%;
}

/* #c62828: the brand red darkened for AA contrast with white text; wrap instead of overflowing at 200% text size */
.buddy-cta .button.is-primary {
  background-color: #c62828;
  border-color: transparent;
  color: #fff;
  white-space: normal;
  height: auto;
}

.buddy-cta .button.is-primary:hover {
  background-color: #a51f1f;
}

.buddy-cta a:focus-visible,
.buddy-cta .button:focus-visible {
  outline: 3px solid #1a1a1a;
  outline-offset: 2px;
  box-shadow: none;
}

.buddy-other-stores {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #595959;
}

.buddy-other-stores a {
  color: #c62828;
  text-decoration: underline;
}

.cta-arrow {
  width: 0.75rem;
  height: 0.75rem;
  margin-inline-start: 0.6rem;
  vertical-align: middle;
  animation: bounce-side 1s 3;
}

[dir="rtl"] .cta-arrow {
  transform: scaleX(-1);
  animation-name: bounce-side-rtl;
}

@keyframes bounce-side {
  0%, 100% { transform: translateX(0); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateX(25%); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}

@keyframes bounce-side-rtl {
  0%, 100% { transform: scaleX(-1) translateX(0); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: scaleX(-1) translateX(25%); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}

@media (prefers-reduced-motion: reduce) {
  .cta-arrow {
    animation: none;
  }
}

.store-logo {
  height: 1.2rem;
  margin-inline-end: 0.5rem;
  vertical-align: middle;
}
</style>
