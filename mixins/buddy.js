import deviceInfos from "@/mixins/deviceInfos";

// Pictalk AAC shutdown date, shown everywhere the migration to Pictalk Buddy is announced.
export const DEADLINE = new Date(2026, 11, 31);
// From this date the migration popup also shows on app open (subject to the reminder cadence).
export const REMIND_ON_OPEN_FROM = new Date(2026, 10, 15);
// Locales that have a pictalk.org/{locale}/buddy/ page; the others fall back to English.
const BUDDY_PAGE_LOCALES = ["en", "fr", "de", "es", "it", "pt", "fi", "nl"];

export default {
  mixins: [deviceInfos],
  data() {
    return {
      appStoreUrl: "https://apps.apple.com/fr/app/agenda-caa/id6502835578",
      playStoreUrl: "https://play.google.com/store/apps/details?id=org.pictime.application.twa",
      webAppUrl: "https://buddy.pictalk.org",
    };
  },
  computed: {
    // Store rules: never show the other platform's store. iPhone/iPad UAs report as "Mac/iOS", Android as "Linux".
    isApple() {
      return ["Mac/iOS", "iPad", "iPhone"].includes(this.getOSInfo());
    },
    isAndroid() {
      return ["Android", "Linux"].includes(this.getOSInfo());
    },
    // Web app link only for desktop-sized browsers (Bulma's 1024px desktop breakpoint), not the installed PWA.
    // iPadOS reports a Mac UA, so touch support is what tells a large iPad apart from a real Mac.
    showWebApp() {
      const ua = navigator.userAgent;
      const isPwa = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
      const isDesktopSize = window.matchMedia("(min-width: 1024px)").matches;
      return isDesktopSize && !isPwa && !/Android|iPhone|iPad|Mobile/i.test(ua) && !(/Mac/.test(ua) && navigator.maxTouchPoints > 1);
    },
    buddyPageUrl() {
      const locale = BUDDY_PAGE_LOCALES.includes(this.$i18n.locale) ? this.$i18n.locale : "en";
      return `https://www.pictalk.org/${locale}/buddy/`;
    },
    dir() {
      return this.$i18n.locale === "ar" ? "rtl" : "ltr";
    },
    deadlineText() {
      return DEADLINE.toLocaleDateString(this.$i18n.locale, { day: "numeric", month: "long", year: "numeric" }).replace(/ /g, " ");
    },
  },
};
