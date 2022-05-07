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
      <b-navbar-item @click="openTutorialModal()"
        >{{ $t("Tutorial") }} 🚀</b-navbar-item
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
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipHome')"
            :delay="1000"
            :triggers="['hover']"
          >
            <b-button
              type="is-primary"
              @click="eraseSpeech()"
              icon-right="home"
            />
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipPublic')"
            :delay="1000"
            :triggers="['hover']"
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
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipShared')"
            :delay="1000"
            :triggers="['hover']"
          >
            <b-button
              type="is-primary is-light"
              icon-right="folder-account"
              :to="sharedLink"
              tag="nuxt-link"
            />
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipSidebar')"
            :delay="1000"
            :triggers="['hover']"
          >
            <b-button
              type="is-primary is-light"
              icon-right="page-layout-sidebar-right"
              :to="sidebarLink"
              tag="nuxt-link"
            />
          </b-tooltip>
          <b-tooltip
            v-if="notificationsCount != 0"
            position="is-bottom"
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipNotifications')"
            :delay="1000"
            :triggers="['hover']"
          >
            <b-dropdown
              position="is-bottom-left"
              aria-role="menu"
              trap-focus
              append-to-body
              ><template #trigger>
                <a class="navbar-item" role="button">
                  <b-icon icon="bell-alert"></b-icon>
                </a>
              </template>
              <b-dropdown-item
                aria-role="menu-item"
                :focusable="false"
                custom
                class="lessPadding"
              >
                <div
                  v-for="notification in getUserNotifications"
                  :key="notification.operation + Math.random()"
                  class="notification lessPadding"
                  @click="notificationGoToCollectionOrReturn(notification)"
                >
                  <b-field expanded>
                    <b-icon
                      :icon="notificationIcon(notification)"
                      size="is-medium"
                      :type="notificationType(notification)"
                    />

                    <p align="center" style="width: 100%">
                      {{ notification.username }}
                    </p>
                  </b-field>
                  <div v-if="notification.operation == 'share'">
                    {{ $t("SharedWithYou") }}
                  </div>
                  <div v-if="notification.operation == 'unshare'">
                    {{ $t("UnsharedWithYou") }}
                  </div>
                  {{ getNotificationMeaning(notification) }}
                </div>
                <b-button
                  class="is-danger center"
                  icon-left="delete"
                  expanded
                  @click="deleteUserNotifications()"
                />
              </b-dropdown-item>
            </b-dropdown>
          </b-tooltip>
          <b-tooltip
            v-if="this.$route.path.includes('pictalk')"
            position="is-bottom"
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipAcount')"
            :delay="1000"
            :triggers="['hover']"
          >
            <b-button
              v-if="this.$route.path.includes('pictalk')"
              type="is-info"
              icon-right="cog"
              @click="goToAccount()"
            />
          </b-tooltip>
          <b-tooltip
            position="is-bottom"
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipHelp')"
            :delay="1000"
            :triggers="['hover']"
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
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipLogout')"
            :delay="1000"
            :triggers="['hover']"
          >
            <b-button type="is-light" icon-right="logout" @click="onLogout" />
          </b-tooltip>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script difer>
import lang from "@/mixins/lang";
import axios from "axios";
import navbar from "@/mixins/navbar";
import enforcedSecurity from "@/mixins/enforcedSecurity";
import Tutorial from "@/components/navigation/tutorial";
export default {
  mixins: [lang, navbar, enforcedSecurity],
  data() {
    return {
      notificationsCount: 0,
      intervalId: null,
    };
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  mounted() {
    this.intervalId = setInterval(async () => {
      if (window.navigator.onLine) {
        try {
          const notificationsRequest = await axios.get("/user/notification");
          if (notificationsRequest.status == 200) {
            const notifications = notificationsRequest.data;
            if (notifications.length != this.notificationsCount) {
              this.$store.dispatch("downloadCollections");
              this.notificationsCount = notifications.length;
            }
            notifications.forEach((notification) => {
              if (notification.meaning) {
                notification.meaning = JSON.parse(notification?.meaning);
              }
            });
          }
          return notifications;
        } catch (err) {
          clearInterval(this.intervalId);
          return [];
        }
      }
    }, 15000);
  },
  computed: {
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
      return "/pictalk/" + this.$store.getters.getSharedId + this.admin;
    },
    sidebarLink() {
      return "/pictalk/" + this.$store.getters.getSidebarId + this.admin;
    },
  },
  methods: {
    openTutorialModal() {
      this.$buefy.modal.open({
        parent: this,
        component: Tutorial,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    notificationGoToCollectionOrReturn(notification) {
      if (
        notification.operation == "unshare" ||
        notification.type != "collection"
      ) {
        return;
      } else {
        this.$router.push({
          path: "/pictalk/" + notification.affected,
          query: { ...this.$route.query },
        });
      }
    },
    getNotificationMeaning(notification) {
      if (notification.meaning) {
        const meaning = notification?.meaning[this.getUserLang];
        if (meaning) {
          return meaning;
        } else {
          const lang = Object.keys(notification.meaning)[0];
          return notification?.meaning[lang];
        }
      } else {
        return "";
      }
    },
    notificationIcon(notif) {
      if (notif.operation.includes("share")) {
        return "share-variant";
      } else if (notif.operation == "modified") {
        return "folder-edit";
      } else {
        return "help";
      }
    },
    notificationType(notif) {
      if (notif.operation == "share") {
        return "is-success";
      } else if (notif.operation == "unshare") {
        return "is-danger";
      } else if (notif.operation == "modified") {
        return "is-info";
      } else {
        return "is-light";
      }
    },
    deleteUserNotifications() {
      this.$store.dispatch("deleteNotifications");
      this.notificationsCount = 0;
    },
    eraseSpeech() {
      this.$store.commit("eraseSpeech");
      if (this.$store.getters.getRootId) {
        this.$router.push({
          path: "/pictalk/" + this.$store.getters.getRootId,
          query: {
            isAdmin: this.$route.query.isAdmin,
            sidebarPictoId: this.$store.getters.getSidebarId,
          },
        });
      } else {
        this.$router.push({
          path: "/pictalk",
          query: {
            isAdmin: this.$route.query.isAdmin,
            sidebarPictoId: this.$store.getters.getSidebarId,
          },
        });
      }
    },
    goToAccount() {
      if (this.admin) {
        this.$router.push("/account" + this.admin);
      } else {
        if (this.$store.getters.getUser.settings.securityMode) {
          let postFunction = function (t) {
            t.$router.push("/account");
          };
          this.enforcedSecurityMinor(postFunction);
        } else {
          this.$router.push("/account");
        }
      }
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
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.lessPadding {
  padding: 0.3rem;
}
</style>
