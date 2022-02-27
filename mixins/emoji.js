import { countryCodeEmoji } from "country-code-emoji";
export default {
	methods: {
		getEmoji(language) {
			if (language?.match(/[a-z]{2}_[A-Z]{2}/g)) {
				language = language.replace("_", "-");
			}
			let emojiOrText;
			let languageRegex = language?.match(/[a-z]{2}-[A-Z]{2}/g);
			if (languageRegex && languageRegex.length >= 1) {
				languageRegex = languageRegex[0];
				try {
					emojiOrText = countryCodeEmoji(languageRegex.split("-")[1]);
				} catch (err) {
					emojiOrText = languageRegex;
					throw new Error("Could not get emoji from language: " + languageRegex);
				}
				return emojiOrText;
			} else {
				return language;
			}
		},
	}
}