export function convertToSimpleLanguage(language) {
	return language?.replace(/[^a-z]/g, "");
};