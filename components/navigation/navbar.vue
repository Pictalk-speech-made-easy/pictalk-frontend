<template>
  <div>
    <b-navbar fixed-top>
      <template slot="brand">
        <b-navbar-item
          tag="nuxt-link"
          to="/"
          style="padding: 0%; padding-right: 1vw; padding-left: 1vw"
        >
          <img
            v-if="fits"
            src="~/assets/logo_compressed.png"
            alt="Logo of a web app that help speach-disabled people"
            height="100px"
            width="150px"
          />
          <img
            v-if="!fits"
            src="~/assets/small_logo.jpg"
            alt="Logo of a web app that help speach-disabled people"
          />
        </b-navbar-item>
        <b-navbar-item
          :style="
            this.$route.path.includes('public')
              ? 'display:none'
              : 'padding-left: 0%; padding-right: 0%'
          "
        >
          <b-input
            class="searchSection"
            v-model="search"
            aria-label="search input"
            :placeholder="$t('SearchPictoPlaceholder')"
            clearable
            @keyup.native.enter="searchPicto()"
          >
          </b-input>
          <b-button
            aria-label="search button"
            type="is-info"
            @click="searchPicto()"
            icon-right="magnify"
          />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item v-if="$route.path != '/'" tag="nuxt-link" to="/">
          {{ $t("Home") }}</b-navbar-item
        >
        <b-navbar-item tag="nuxt-link" to="/pictograms"
          >{{ $t("Pictograms") }} 👐</b-navbar-item
        >
        <b-navbar-dropdown collapsible :label="$t('More')">
          <b-navbar-item tag="nuxt-link" to="/about">{{
            $t("Infos")
          }}</b-navbar-item>
          <b-navbar-item tag="nuxt-link" to="/contact"
            >{{ $t("BugsAndSuggestions") }} 👨‍💻</b-navbar-item
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
              tag="nuxt-link"
              :to="pictalkHome"
              type="is-primary"
              icon-right="home"
            ></b-button>

            <b-button
              v-if="!isLogged"
              @click="openSignUpModal()"
              type="is-success"
              outlined
              >{{ $t("SignUp") }}</b-button
            >
            <b-button
              v-else
              type="is-light"
              icon-right="logout"
              @click="onLogout"
            />
            <b-button
              outlined
              v-if="!isLogged"
              tag="nuxt-link"
              to="/public/346"
              type="is-primary"
              icon-right="arrow-right-box"
              >{{ $t("TryPictalk") }}</b-button
            >
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
import lang from "@/mixins/lang";
import navbar from "@/mixins/navbar";
import emoji from "@/mixins/emoji";
import enforcedSecurity from "@/mixins/enforcedSecurity";
import signin from "@/components/auth/signinModal";
import signup from "@/components/auth/signupModal";
export default {
  mixins: [lang, emoji, navbar, enforcedSecurity],
  data() {
    return {
      trueValue: true,
      search: "",
      fits: false,
    };
  },
  components: {
    signin,
    signup,
  },
  destroyed() {
    window.removeEventListener("resize", this.fitsBigger);
  },
  mounted() {
    this.fitsBigger();
    window.addEventListener("resize", this.fitsBigger);
  },
  computed: {
    getFilteredPictoList() {
      return this.pictos.filter((picto) =>
        picto.meaning[this.getUserLang]?.includes(this.search)
      );
    },
    pictalkHome() {
      if (this.$store.getters.getRootId) {
        return "/pictalk/" + this.$store.getters.getRootId;
      } else {
        return "/pictalk";
      }
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    searchPicto() {
      this.$router.push({
        path: `/public`,
        query: { ...this.$route.query, search: this.search },
      });
    },
    fitsBigger() {
      this.fits =
        window.innerWidth > 767 &&
        !(window.innerWidth > 1023 && window.innerWidth < 1215);
    },
    openSignInModal() {
      this.$buefy.modal.open({
        parent: this,
        component: signin,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
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
<style scoped>
.searchSection {
  min-width: 100px;
  max-width: 156px;
}
.noPadding {
  padding: 0%;
}
</style>

