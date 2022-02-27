import { countryCodeEmoji } from "country-code-emoji";
export default {
	methods: {
		getEmoji(language) {
			if (language?.match(/[a-z]{2}_[A-Z]{2}/g)) {
				language = language.replace("_", "-");
			}
			let emojiOrText;
			if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
				try {
					emojiOrText = countryCodeEmoji(language.split("-")[1]);
				} catch (err) {
					emojiOrText = language;
					throw new Error("Could not get emoji from language: " + language);
				}
				return emojiOrText;
			} else {
				return language;
			}
		},
	}
}