<template>
  <div style="display: flex; flex-direction: column; width: 100%; z-index: 30; position: sticky; top: 0px;">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" :to="localePath('/')" style="padding: 0%; padding-right: 1vw; padding-left: 1vw">
          <img src="~/assets/logo_compressed.png" alt="Logo of a web app that help speach-disabled people" height="48px"
            style="aspect-ratio: 411 / 130" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item id="index" tag="nuxt-link" :to="localePath('/')" :class="navtabs.index">
          <b class="bolder">{{ $t("Home") }}</b></b-navbar-item>
        <!-- <b-navbar-item id="news" tag="nuxt-link" :to="localePath('/news')" :class="navtabs.news"><b class="bolder">{{
          $t("News") }}</b> &#127881;</b-navbar-item>
        <b-navbar-item id="informations" tag="nuxt-link" :to="localePath('/informations')"
          :class="navtabs.informations"><b class="bolder">{{ $t("Informations") }}</b> 👐</b-navbar-item> -->
        <b-navbar-item id="tutorials" tag="nuxt-link" :to="localePath('/tutorials/')" :class="navtabs.tutorials"><b
            class="bolder">{{ $t("Tutorial") }}</b> 🚀</b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-dropdown tag="div" collapsible :label="getEmoji(localeIso())">
          <b-navbar-item href="#" v-for="locale in availableLocales" :key="locale.code"
            @click.prevent.stop="$i18n.setLocale(locale.code)">{{ getEmoji(locale.iso) }}</b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="div">
          <div class="buttons bottomOffset">
            <b-button data-cy="navbar-signin-button" class="bolder customButton" v-if="!isLogged"
              @click="openSignInModal()" type="is-primary">{{ $t("LogIn") }}</b-button>
            <b-button v-else class="bolder customButton" tag="nuxt-link" :to="pictalkHome" type="is-primary"
              icon-right="home"></b-button>

            <b-button class="bolder customButton" v-if="!isLogged" @click="openSignUpModal()" type="is-success"
              outlined>{{ $t("SignUp") }}</b-button>
            <b-button v-else class="bolder customButton" type="is-light" icon-right="logout" @click="onLogout" />
            <b-button class="bolder customButton" outlined v-if="!isLogged" tag="nuxt-link"
              to="/public?fatherCollectionId=284083" type="is-primary" icon-right="arrow-right-box">{{
                $t("TryPictalk") }}</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <div
      style="display: flex; gap: 1rem; justify-content: center; width: 100%; background-color: #f9fafb; color:#272727; padding: 0.75rem 1rem; box-shadow: 0px 0px 9px #00000050;">
      <p style="text-align: center; font-weight: 500; color: #373737;">
        {{ $t(`Banner${Math.floor(Math.random() * 4) + 1}`) }}
      </p>
      <a :href="`https://www.pictalk.org/${$i18n.locale}/agenda/`"
        style="display: flex; text-decoration: underline; align-items: center; gap: 0.5rem; font-weight: 500; color: #171717; padding: 0rem 1rem; cursor: pointer; border: none; background-color: transparent;">
        {{ $t("BannerCta") }}
        <svg xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;"
          viewBox="0 0 24 24"><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path stroke-dasharray="20" stroke-dashoffset="20" d="M3 12h17.5">
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0" />
            </path>
            <path stroke-dasharray="12" stroke-dashoffset="12" d="M21 12l-7 7M21 12l-7 -7">
              <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="12;0" />
            </path>
          </g>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
import lang from "@/mixins/lang";
import navbar from "@/mixins/navbar";
import emoji from "@/mixins/emoji";
import signin from "@/components/auth/signinModal";
import signup from "@/components/auth/signupModal";
import Security from "@/components/auth/securityModal";
export default {
  mixins: [lang, emoji, navbar],
  data() {
    return {
      trueValue: true,
      search: "",
      navtabs: {
        index: "unfocus",
        news: "unfocus",
        informations: "unfocus",
        tutorials: "unfocus",
      },
    };
  },
  watch: {
    $route(to, from) {
      console.log(to.name, from.name);
      this.navtabs[to.name] = "focus";
      this.navtabs[from.name] = "unfocus";
    },
  },
  components: {
    signin,
    signup,
    Security,
  },

  mounted() {
    this.navtabs[this.$route.name] = "focus";
  },
  computed: {
    getFilteredPictoList() {
      return this.pictos.filter((picto) =>
        picto.meaning[this.getUserLang]?.includes(this.search)
      );
    },
    pictalkHome() {
      if (this.$store.getters.getRootId) {
        return "/pictalk/?fatherCollectionId=" + this.$store.getters.getRootId;
      } else {
        return "/pictalk/";
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
        path: `/public/`,
        query: { ...this.$route.query, search: this.search },
      });
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

.navbar {
  box-shadow: none !important;
  border-color: #ccc !important;
}

.noPadding {
  padding: 0%;
}

.bottomOffset {
  margin-bottom: 0px;
}

.tab {
  transition: 500ms;
}

.unfocus {
  filter: grayscale(1);
}

.unfocus:hover {
  filter: grayscale(0);
  color: #ee0000;
}

.focus {
  filter: grayscale(0);
  color: #ee0000;
  border: solid #ff5757;
  border-width: 0px 0px 2px 0px;
}

.bolder {
  font-weight: 600;
}

.buttons {
  gap: 5px;
}

.buttons>.button {
  margin-right: 0.15rem !important;
}

.customButton {
  font-size: clamp(0.8em, 4vw, 1.15em);
  font-weight: 600;
  color: #171717;
  border: 2px solid #666;
  transition: all 0.05s;
  margin: 0 2px;
}

.customButton:hover {
  box-shadow: 0px 0px 12px #00000090;
}

@media screen and (max-width: 1215px) {
  .focus {
    border-width: 0px 0px 0px 6px;
  }
}
</style>
