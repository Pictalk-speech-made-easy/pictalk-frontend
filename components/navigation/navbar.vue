<template>
  <div>
    <b-navbar fixed-top>
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" :to="localePath('/')" style="padding: 0%; padding-right: 1vw; padding-left: 1vw">
          <img src="~/assets/logo_compressed.png" alt="Logo of a web app that help speach-disabled people" height="48px"
            style="aspect-ratio: 411 / 130" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item id="index" tag="nuxt-link" :to="localePath('/')" :class="navtabs.index">
          <b class="bolder">{{ $t("Home") }}</b></b-navbar-item>
      </template>
      <template slot="end">
        <client-only>
          <b-navbar-dropdown tag="div" collapsible :label="getEmoji(localeIso())">
            <b-navbar-item href="#" v-for="locale in availableLocales" :key="locale.code"
              @click.prevent.stop="$i18n.setLocale(locale.code)">{{ getEmoji(locale.iso) }}</b-navbar-item>
          </b-navbar-dropdown>
          <b-navbar-item tag="div">
            <div class="buttons bottomOffset">
              <div v-if="!isUserInitialized && !isUserAuthenticated">
                <b-button data-cy="navbar-signin-button" class="bolder" @click="openSignInModal()" type="is-primary">{{
          $t("LogIn") }}</b-button>

                <b-button class="bolder" @click="openSignUpModal()" type="is-success" outlined>{{
          $t("SignUp") }}</b-button>

              </div>
              <div v-if="!isUserInitialized && isUserAuthenticated">
                <b-button class="bolder" @click="openSignUpModal()" type="is-success" outlined>
                  {{ $t('InitializeSpace') }}</b-button>
              </div>
              <div v-if="isUserInitialized && isUserAuthenticated">
                <b-button class="bolder" tag="nuxt-link" :to="pictalkHome" type="is-primary"
                  icon-right="home"></b-button>
                <b-button type="is-light" icon-right="logout" @click="onLogout" />
              </div>
            </div>
          </b-navbar-item>
        </client-only>
      </template>
    </b-navbar>
  </div>
</template>

<script>
import lang from "@/mixins/lang";
import navbar from "@/mixins/navbar";
import emoji from "@/mixins/emoji";
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
    signup,
    Security,
  },
  mounted() {
    this.navtabs[this.$route.name] = "focus";
  },
  computed: {
    isUserAuthenticated() {
      return this.$keycloak.authenticated;
    },
    isUserInitialized() {
      return this.$store.getters.getIsUserInitialized;
    },
    getFilteredPictoList() {
      return this.pictos.filter((picto) =>
        picto.meaning[this.getUserLang]?.includes(this.search)
      );
    },
    pictalkHome() {
      if (this.$store.getters.getRootId && this.$store.getters.getSidebarId) {
        return `/pictalk/${this.$store.getters.getRootId}?sidebarPictoId=${this.$store.getters.getSidebarId}`;
      } else {
        return "/pictalk";
      }
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
  },
  methods: {
    async checkIsUserInitialized() {
      // Check if the user is authenticated with Keycloak and has an account in Pictalk
      try {
        if (this.$keycloak.authenticated) {
          await axios.get("/user/details/");
          this.$store.commit('setUserInitialized', true);
        }
      } catch (err) {
        if (err?.response?.status === 403) {
          this.$store.commit('setUserInitialized', false);
          // Open the signup modal if the user isn't authenticated
          this.$buefy.modal.open({
            parent: this,
            component: signupModal,
            hasModalCard: true,
            trapFocus: true,
            canCancel: false,
            onCancel: () => {
              this.$buefy.modal.close();
            },
          });
        }
      }
    },
    searchPicto() {
      this.$router.push({
        path: `/`,
        query: { ...this.$route.query, search: this.search },
      });
    },
    async openSignInModal() {
      this.loading = true;
      await this.$store.dispatch("authenticateUser", {
        keycloak: this.$keycloak,
        isUserInitialized: this.isUserInitialized,
      });
      return;
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

@media screen and (max-width: 1215px) {
  .focus {
    border-width: 0px 0px 0px 6px;
  }
}
</style>
