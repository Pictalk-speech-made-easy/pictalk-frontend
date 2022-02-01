<template>
  <div>
    <b-navbar fixed-top>
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" to="/">
          <img
            src="~/assets/logo_compressed.png"
            alt="A web app that help speach-disabled people"
            height="100px"
            width="150px"
          />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="nuxt-link" to="/"> {{ $t("Home") }}</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/getstarted"
          >{{ $t("GetStarted") }} 🚀</b-navbar-item
        >
        <b-navbar-dropdown collapsible :label="$t('More')">
          <b-navbar-item tag="nuxt-link" to="/about">{{
            $t("Infos")
          }}</b-navbar-item>
          <b-navbar-item tag="nuxt-link" to="/contact"
            >{{ $t("BugsAndSuggestions") }} 👨‍💻</b-navbar-item
          >
          <b-navbar-item tag="nuxt-link" to="/pictograms"
            >{{ $t("Pictograms") }} 👐</b-navbar-item
          >
          <b-navbar-item tag="nuxt-link" to="/news"
            >{{ $t("NewsAndUpdates") }} &#127881;</b-navbar-item
          >
        </b-navbar-dropdown>
      </template>
      <template slot="end">
        <b-navbar-dropdown collapsible :label="getEmoji(localeIso())">
          <b-navbar-item
            v-for="locale in availableLocales"
            :key="locale.code"
            @click.prevent.stop="$i18n.setLocale(locale.code)"
            >{{ getEmoji(locale.iso) }}</b-navbar-item
          >
        </b-navbar-dropdown>
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button
              v-if="!isLogged"
              @click="openSignInModal()"
              type="is-primary"
              >{{ $t("LogIn") }}</b-button
            >
            <b-button
              v-else
              type="is-light"
              icon-right="logout"
              @click="onLogout"
            />
            <b-button
              v-if="!isLogged"
              @click="openSignUpModal()"
              type="is-light"
              >{{ $t("SignUp") }}</b-button
            >
            <b-button
              v-else
              tag="nuxt-link"
              to="/pictalk"
              type="is-primary"
              icon-right="home"
            ></b-button>
            <b-button
              v-if="!isLogged"
              tag="nuxt-link"
              to="/public"
              type="is-success is-light"
              icon-right="test-tube"
              >{{ $t("TryPictalk") }}</b-button
            >
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
import { countryCodeEmoji } from "country-code-emoji";
import signin from "@/components/auth/signinModal";
import signup from "@/components/auth/signupModal";
export default {
  data() {
    return {
      trueValue: true,
    };
  },
  components: {
    signin,
    signup,
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    localeIso() {
      return this.$i18n.locales.filter((i) => i.code == this.$i18n.locale)[0]
        .iso;
    },
    getEmoji(language) {
      if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
        return countryCodeEmoji(language.split("-")[1]);
      }
      return;
    },
    onLogout() {
      const a = Math.floor(Math.random() * 10 + 1);
      const b = Math.floor(Math.random() * 10 + 1);
      const res = a + b;
      this.$buefy.dialog.prompt({
        message: this.$t("SupervisorModeQuestion") + " : " + `${a} + ${b} ?`,
        inputAttrs: {
          type: "number",
          placeholder: this.$t("SupervisorModeInput"),
          value: "",
          maxlength: 2,
          min: 0,
          max: 20,
        },
        trapFocus: true,
        onConfirm: (value) => {
          if (value == res) {
            this.$store.dispatch("logout");
            this.$router.push("/");
          }
          return;
        },
      });
    },

    openSignInModal() {
      this.$buefy.modal.open({
        parent: this,
        component: signin,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
      });
    },
    openSignUpModal() {
      this.$buefy.modal.open({
        parent: this,
        component: signup,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        canCancel: ["escape", "x"],
        trapFocus: true,
      });
    },
  },
};
</script>
