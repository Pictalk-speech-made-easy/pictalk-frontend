export default {
  methods: {
    getEmoji(language) {
      if (language?.match(/[a-z]{2}_[A-Z]{2}/g) || language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
        language = language.replace("_", "-");
        if (language.includes("fr") || language.includes("FR")) {
          return String.fromCodePoint(0x1F1EB, 0x1F1F7) + " " + "Français";
        }
        if (language.includes("en") || language.includes("GB")) {
          return String.fromCodePoint(0x1F1EC, 0x1F1E7) + " " + "English";
        }
        if (language.includes("es") || language.includes("ES")) {
          return String.fromCodePoint(0x1F1EA, 0x1F1F8) + " " + "Español";
        }
        if (language.includes("pt") || language.includes("PT")) {
          return String.fromCodePoint(0x1F1F5, 0x1F1F9) + " " + "Português";
        }
        if (language.includes("de") || language.includes("DE")) {
          return String.fromCodePoint(0x1F1E9, 0x1F1EA) + " " + "Deutsch";
        }
        if (language.includes("el") || language.includes("GR")) {
          return String.fromCodePoint(0x1F1EC, 0x1F1F7) + " " + "Ελληνικά";
        }
        if (language.includes("it") || language.includes("IT")) {
          return String.fromCodePoint(0x1F1EE, 0x1F1F9) + " " + "Italiano";
        }
        if (language.includes("ro") || language.includes("RO")) {
          return String.fromCodePoint(0x1F1F7, 0x1F1F4) + " " + "Română";
        }
        if (language.includes("ar") || language.includes("AR")) {
          return String.fromCodePoint(0x1F1F8, 0x1F1E6) + " " + "اللغة العربية";
        }
      }
      return language;
    },
  }
}