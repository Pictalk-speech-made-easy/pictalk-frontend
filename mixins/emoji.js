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
        if (language.includes("sk") || language.includes("SK")) {
          return String.fromCodePoint(0x1F1F8, 0x1F1F0) + " " + "Slovenský";
        }
        if (language.includes("nl") || language.includes("NL")) {
          return String.fromCodePoint(0x1F1F3, 0x1F1F1) + " " + "Nederlands";
        }
        if (language.includes("dk") || language.includes("DK")) {
          return String.fromCodePoint(0x1F1E9, 0x1F1F0) + " " + "Dansk";
        }
        if (language.includes("fi") || language.includes("FI")) {
          return String.fromCodePoint(0x1F1EB, 0x1F1EE) + " " + "Suomi";
        }
        if (language.includes("no") || language.includes("NO")) {
          return String.fromCodePoint(0x1F1F3, 0x1F1F4) + " " + "Norsk";
        }
        if (language.includes("sv") || language.includes("SE")) {
          return String.fromCodePoint(0x1F1F8, 0x1F1EA) + " " + "Svenska";
        }
      }
      return language;
    },
  }
}