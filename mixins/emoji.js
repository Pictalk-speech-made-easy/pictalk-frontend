import { countryCodeEmoji } from "country-code-emoji";
export default {
	methods: {
		getEmoji(language) {
			if (language?.match(/[a-z]{2}_[A-Z]{2}/g)) {
				language = language.replace("_", "-");
			}
			if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
				return countryCodeEmoji(language.split("-")[1]);
			} else {
				return language;
			}
		},
	}
}