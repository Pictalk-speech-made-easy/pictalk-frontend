export default {
	methods: {
		localeIso() {
			return this.$i18n.locales.filter(
				(i) => i.code == this.$i18n.locale
			)[0].iso;
		},
		localeCode() {
			return this.$i18n.locales.filter(
				(i) => i.code == this.$i18n.locale
			)[0].code;
		},
	},
	computed: {
		getUserLang() {
			const user = this.$store.getters.getUser;
			if (user?.language) {
				return Object.keys(user.language)[0].replace(/[^a-z]/g, "");
			}
			if (user?.displayLanguage) {
				return user.displayLanguage;
			}
			return window.navigator.language.replace(/[^a-z]/g, "");
		},
		availableLocales() {
			return this.$i18n.locales.filter(
				(i) => i.code !== this.$i18n.locale
			);
		},
	}
}