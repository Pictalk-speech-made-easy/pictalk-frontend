<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-navbar-item @click="eraseSpeech()">
        <img
          src="~/assets/logo_compressed.png"
          alt="A web app that help speach-disabled people"
          height="100px"
        />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="nuxt-link" to="/">{{ $t("Home") }}</b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/getstarted"
        >{{ $t("GetStarted") }} 🚀</b-navbar-item
      >
      <b-navbar-dropdown collapsible label="Info">
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
      <b-navbar-item tag="div">
        <div class="buttons b-tooltips">
          <b-tooltip
            position="is-bottom"
            type="is-primary"
            :label="$t('TooltipHome')"
            :delay="1000"
          >
            <b-button
              type="is-primary"
              @click="eraseSpeech()"
              icon-right="home"
            />
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            type="is-primary"
            :label="$t('TooltipPublic')"
            :delay="1000"
          >
            <b-button
              type="is-success is-light"
              icon-right="web"
              tag="nuxt-link"
              to="/public"
            />
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            type="is-primary"
            :label="$t('TooltipShared')"
            :delay="1000"
          >
            <b-button
              type="is-primary is-light"
              icon-right="folder-account"
              :to="sharedLink"
              tag="nuxt-link"
            />
          </b-tooltip>
          <b-tooltip
            v-if="getUserNotifications.length != 0"
            position="is-bottom"
            type="is-primary"
            :label="$t('TooltipNotifications')"
            :delay="1000"
          >
            <b-dropdown position="is-bottom-left" aria-role="menu" trap-focus
              ><template #trigger>
                <a class="navbar-item" role="button">
                  <b-icon icon="bell-badge"></b-icon>
                </a>
              </template>
              <b-dropdown-item
                aria-role="menu-item"
                :focusable="false"
                custom
                paddingless
              >
                <div class="modal-card" style="width: 300px">
                  <section class="modal-card-body">
                    <div
                      v-for="notification in getUserNotifications"
                      :key="notification.operation + Math.random()"
                      class="notification"
                    >
                      {{ notification }}
                    </div>
                    <b-button
                      class="is-danger"
                      icon-left="delete"
                      @click="deleteUserNotifications()"
                    />
                  </section>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            type="is-primary"
            :label="$t('TooltipAcount')"
            :delay="1000"
          >
            <b-button
              v-if="this.$route.path.includes('pictalk')"
              type="is-info"
              icon-right="cog"
              tag="nuxt-link"
              to="/account"
            />
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            type="is-primary"
            :label="$t('TooltipHelp')"
            :delay="1000"
          >
            <b-button
              type="is-light"
              tag="nuxt-link"
              to="/help"
              icon-right="help-circle"
            />
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            type="is-primary"
            :label="$t('TooltipLogout')"
            :delay="1000"
          >
            <b-button type="is-light" icon-right="logout" @click="onLogout" />
          </b-tooltip>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script>
export default {
  computed: {
    getUserNotifications() {
      return this.$store.getters.getUser.notifications ?? [];
    },
    admin() {
      return this.$route.query.isAdmin ? "?isAdmin=true" : "";
    },
    homeLink() {
      return this.$route.path;
    },
    publicLink() {
      return "/public" + this.admin;
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
    sharedLink() {
      //this.$store.commit('eraseSpeech');
      return "/pictalk/" + this.$store.getters.getSharedId + this.admin;
    },
  },
  methods: {
    deleteUserNotifications() {
      this.$store.dispatch("deleteNotifications");
    },
    async refreshPictos() {
      try {
        await this.$store.dispatch("downloadCollections");
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("PictosFetched"),
          position: "is-top-right",
          type: "is-success",
          hasIcon: true,
          icon: "refresh",
        });
      } catch (err) {
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("ServerOffline"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          icon: "danger",
        });
      }
    },
    eraseSpeech() {
      this.$store.commit("eraseSpeech");
      if (this.$store.getters.getRootId) {
        this.$router.push(
          "/pictalk/" + this.$store.getters.getRootId + this.admin
        );
      } else {
        this.$router.push("/pictalk" + this.admin);
      }
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
  },
};
</script>
<style lang="scss" scoped>
.b-tooltips {
  .b-tooltip:not(:last-child) {
    margin-right: 0.5em;
  }
  .b-tooltip {
    margin-bottom: 0.5em;
  }
}
</style>
