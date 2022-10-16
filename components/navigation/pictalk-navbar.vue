<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-navbar-item
        style="
          padding: 0%;
          padding-right: 1px;
          padding-left: 1vw;
          pointer-events: none;
        "
      >
        <img
          style="margin-right: 0.5vw"
          v-if="fits"
          src="~/assets/logo_compressed.png"
          alt="Logo of a web app that help speach-disabled people"
        />
        <img
          style="margin-right: 0.5vw"
          v-if="!fits"
          src="~/assets/small_logo.jpg"
          alt="Logo of a web app that help speach-disabled people"
        />
        <b-tooltip
          style="margin-right: 3px"
          position="is-right"
          type="is-dark"
          :triggers="['hover', 'click']"
        >
          <div
            class="downloadDiv"
            :style="
              percent == 100
                ? 'border-color: #48C78E; color: #48C78E;'
                : 'border-color: #3e8ed0; color: #3e8ed0;'
            "
          >
            <b-icon
              style="margin-left: 0px; max-width: 28px; margin-top: 1px"
              :type="percent == 100 ? 'is-success' : 'is-info'"
              icon="cloud-download"
              size="is-medium"
            ></b-icon>
            {{ percentage }}
          </div>
          <template v-slot:content>
            <p v-if="!offlineReadyTotal">
              {{ $t("NoStorage") }}
            </p>
            <p v-if="offlineImagesSavedRatio == 100">
              {{ $t("ReadyOffline") }} ✈️
            </p>
          </template>
        </b-tooltip>
      </b-navbar-item>
      <div
        :style="this.$route.path.includes('pictalk') ? '' : 'display:none'"
        class="columns is-mobile margins"
      >
        <b-dropdown
          :mobile-modal="false"
          v-if="$route.query.isAdmin && !checkCopyCollectionId"
          trap-focus
          :triggers="['click']"
          aria-role="list"
        >
          <template #trigger>
            <b-button label="Create" type="is-success" icon-right="plus" />
          </template>

          <b-dropdown-item @click="addPicto(true)" aria-role="listitem"
            >{{ $t("Pictogram") }} <b-icon icon="image"
          /></b-dropdown-item>
          <b-dropdown-item @click="addPicto(false)" aria-role="listitem"
            >{{ $t("Collection") }} <b-icon icon="folder-table"
          /></b-dropdown-item>
        </b-dropdown>
        <div
          v-if="checkCopyCollectionId && $route.query.isAdmin"
          class="column noPadding"
        >
          <b-button
            class="addButton"
            @click="copyCollection()"
            type="is-info"
            icon-right="content-paste"
          />
        </div>

        <div class="column noPadding">
          <b-button
            class="lock"
            :rounded="!$route.query.isAdmin"
            expanded
            type="is-warning"
            :focused="Boolean($route.query.isAdmin)"
            @click="adminModeChoose()"
            :icon-right="iconIsAdmin"
          />
        </div>
      </div>
    </template>
    <template slot="start">
      <b-navbar-item tag="nuxt-link" to="/"> {{ $t("Home") }}</b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/tutorials"
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
              class="buttonBorder"
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
              type="is-success is-light"
              icon-right="folder-account"
              :to="sharedLink"
              tag="nuxt-link"
              class="buttonBorder"
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
              type="is-success is-light"
              icon-right="page-layout-sidebar-right"
              :to="sidebarLink"
              tag="nuxt-link"
              class="buttonBorder"
            />
          </b-tooltip>
          <b-tooltip
            v-if="getUserNotifications.length != 0"
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
                class="lessPadding limitHeight"
              >
                <div
                  v-for="notification in getUserNotifications"
                  :key="notification.operation + Math.random()"
                  class="card lessPadding notification"
                >
                  <div class="card-content noPadding">
                    <div class="media">
                      <div class="media-content noPadding centered">
                        <p class="title is-6 notifTitle">
                          <a
                            :href="'mailto:' + notification.username"
                            class="subtitle is-6 mailto"
                            >{{
                              notification.username
                                .split("@")[0]
                                .replace(".", " ")
                            }}</a
                          >
                          {{ notificationText(notification) }}
                        </p>
                        <figure class="image is-64x64">
                          <img
                            @click="
                              notificationGoToCollectionOrReturn(notification)
                            "
                            :src="getNotificationImage(notification)"
                            alt="Placeholder image"
                          />
                        </figure>
                        <p class="title is-6 notifTitle greyback">
                          <!--<b-icon
                            :icon="notificationIcon(notification)"
                            size="is-big"
                            :type="notificationType(notification)"
                          />-->
                          {{ getNotificationMeaning(notification) }}
                        </p>
                      </div>
                    </div>
                  </div>
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
            :label="$t('TooltipFeedback')"
            :delay="1000"
            :triggers="['hover']"
          >
            <b-button
              type="is-warning"
              icon-right="bug"
              @click="openFeedbackModal()"
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
<script>
import lang from "@/mixins/lang";
import navbar from "@/mixins/navbar";
import PictoSteps from "@/components/pictos/pictoSteps";
import feedbackModal from "@/components/auth/feedbackModal";
import Security from "@/components/auth/securityModal";
export default {
  mixins: [lang, navbar],
  components: {
    PictoSteps,
    Security,
  },
  async created() {
    const bc = new BroadcastChannel("offline-ready");
    bc.onmessage = (event) => {
      if (event.isTrusted) {
        this.offlineReadyTotal = event.data.total;
        this.offlineReadyProgress = event.data.progress;
      }
    };
  },
  data() {
    return {
      percent: -1,
      intervalId: null,
      fits: false,
      offlineReadyTotal: null,
      offlineReadyProgress: null,
    };
  },
  destroyed() {
    clearInterval(this.intervalId);
    window.removeEventListener("resize", this.fitsBigger);
  },
  mounted() {
    this.fitsBigger();
    window.addEventListener("resize", this.fitsBigger);
    this.intervalId = setInterval(async () => {
      if (window.navigator.onLine) {
        try {
          this.$store.dispatch("getNotifications");
        } catch (err) {
          console.log(err);
          clearInterval(this.intervalId);
          return [];
        }
      }
    }, 15000);
  },
  computed: {
    percentage() {
      this.percent = Math.floor(this.offlineImagesSavedRatio);
      return this.percent >= 0 && this.percent < 100 ? this.percent + "%" : "";
    },
    isOfflineReady() {
      return this.offlineReadyProgress == 0;
    },
    offlineImagesSavedRatio() {
      return (
        ((this.offlineReadyTotal - this.offlineReadyProgress) /
          this.offlineReadyTotal) *
        100
      );
    },
    getUserNotifications() {
      return this.$store.getters.getUser.notifications;
    },
    iconIsAdmin() {
      return this.$route.query.isAdmin ? "lock-open-variant" : "lock";
    },
    checkCopyCollectionId() {
      return (
        this.$store.getters.getCopyCollectionId?.collectionId ||
        this.$store.getters.getShortcutCollectionId?.collectionId
      );
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
      return "/pictalk/" + this.$store.getters.getSharedId + this.admin;
    },
    sidebarLink() {
      return "/pictalk/" + this.$store.getters.getSidebarId + this.admin;
    },
  },
  methods: {
    getNotificationImage(notification) {
      return this.getCollectionFromId(parseInt(notification.affected, 10))
        ?.image;
    },
    openFeedbackModal() {
      this.$buefy.modal.open({
        parent: this,
        component: feedbackModal,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    fitsBigger() {
      this.fits =
        window.innerWidth > 767 &&
        !(window.innerWidth > 1023 && window.innerWidth < 1160);
    },
    getCollectionFromId(id) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === id
      );
      return this.$store.getters.getCollections[index];
    },
    adminModeChoose() {
      if (this.admin) {
        this.$router.push({
          path: this.homeLink,
          query: { ...this.$route.query, isAdmin: undefined },
        });
      } else {
        if (this.$store.getters.getUser.settings.securityMode) {
          this.goToAdminWithEnforced({
            path: this.$route.path,
            query: {
              ...this.$route.query,
              isAdmin: true,
            },
          });
        } else {
          this.$router.push({
            path: this.$route.path,
            query: {
              ...this.$route.query,
              isAdmin: true,
            },
          });
        }
      }
    },
    goToAdminWithEnforced(path) {
      let cb = function (t) {
        t.$router.push(path);
      };
      this.$buefy.modal.open({
        parent: this,
        component: Security,
        hasModalCard: true,
        props: {
          callback: cb,
        },
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    addPicto(isPicto) {
      this.$buefy.modal.open({
        parent: this,
        component: PictoSteps,
        hasModalCard: true,
        props: { create: true, isPicto: isPicto },
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    async copyCollection() {
      if (this.$store.getters.getCopyCollectionId?.collectionId) {
        try {
          if (this.$store.getters.getCopyCollectionId.isPicto) {
            const copiedPicto = await this.$store.dispatch("copyPictoById", {
              pictoId: this.$store.getters.getCopyCollectionId.collectionId,
              fatherCollectionId: this.$route.params.fatherCollectionId,
            });
            /*
            $nuxt.$emit("addPictogram", copiedPicto);
            */
            $nuxt.$emit("resyncPictoList");
          } else {
            const copiedCollection = await this.$store.dispatch(
              "copyCollectionById",
              {
                collectionId:
                  this.$store.getters.getCopyCollectionId.collectionId,
                fatherCollectionId: this.$route.params.fatherCollectionId,
              }
            );
            //$nuxt.$emit("addPictogram", copiedCollection);
            $nuxt.$emit("resyncPictoList");
          }
          this.$store.commit("resetCopyCollectionId");
        } catch (error) {
          if (error?.response?.status == 401) {
            this.$buefy.toast.open({
              message: this.$t("NotAuthorized"),
              position: "is-top",
              type: "is-danger",
            });
          } else {
            console.log(error);
            this.$buefy.toast.open({
              message: this.$t("CouldNotPaste"),
              position: "is-top",
              type: "is-danger",
            });
          }
        }
      } else if (this.$store.getters.getShortcutCollectionId?.collectionId) {
        try {
          let collection = JSON.parse(
            JSON.stringify(
              this.getCollectionFromId(
                parseInt(this.$route.params.fatherCollectionId, 10)
              )
            )
          );
          if (this.$store.getters.getShortcutCollectionId.isPicto) {
            collection.pictos.push({
              id: this.$store.getters.getShortcutCollectionId.collectionId,
            });

            await this.$store.dispatch("editCollection", {
              id: collection.id,
              pictos: collection.pictos,
            });
            $nuxt.$emit("resyncPictoList");
          } else {
            collection.collections.push({
              id: this.$store.getters.getShortcutCollectionId.collectionId,
            });
            await this.$store.dispatch("editCollection", {
              id: collection.id,
              collections: collection.collections,
            });
            $nuxt.$emit("resyncPictoList");
          }

          this.$store.commit("resetShortcutCollectionId");
        } catch (error) {
          if (error.response.status == 401) {
            this.$buefy.toast.open({
              message: this.$t("NotAuthorized"),
              position: "is-top",
              type: "is-danger",
            });
          } else {
            this.$buefy.toast.open({
              message: this.$t("CouldNotPaste"),
              position: "is-top",
              type: "is-danger",
            });
          }
        }
      }
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
        const meaning = notification.meaning[this.getUserLang];
        if (meaning) {
          return meaning;
        } else {
          const lang = Object.keys(notification.meaning)[0];
          return notification.meaning[lang];
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
    notificationText(notif) {
      if (notif.operation == "share") {
        return this.$t("Shared");
      } else if (notif.operation == "unshare") {
        return this.$t("UnShared");
      } else if (notif.operation == "modified") {
        return this.$t("ModifyRights");
      } else {
        return this.$t("Changed");
      }
    },

    deleteUserNotifications() {
      this.$store.dispatch("deleteNotifications");
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
      if (this.admin || !this.$store.getters.getUser.settings.securityMode) {
        this.$router.push("/account" + this.admin);
      } else {
        this.goToAdminWithEnforced({ path: "/account" + this.admin });
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
.notifTitle {
  margin-bottom: 0.5em;
}
.greyback {
  background-color: #f5f5f5;
  padding: 0.2em;
  border-radius: 2px;
}
.mailto {
  color: #ee0000 !important;
  text-decoration: underline;
}
.limitHeight {
  height: 80vh;
  max-height: 600px;
  overflow-y: auto;
  min-width: 260px;
}
.lock {
  border: solid;
  border-color: #4c4329;
  border-width: 1px;
  height: 100%;
}
.addButton {
  border: solid;
  border-color: #4c4329;
  border-width: 1px;
  height: 100%;
  width: 95%;
}
.margins {
  width: 50vw;
  min-width: 130px;
  max-width: 260px;
  margin-left: 1vw;
  margin-right: 1vw;
  margin-top: 5px;
  height: 44px;
}
.noPadding {
  padding: 0%;
}
.lessPadding {
  padding: 0.38rem;
}
.downloadDiv {
  border: solid;
  border-width: 1px;
  border-radius: 20px;
  min-width: 40px;
  max-width: 20vw;
  height: 40px;

  padding-left: 5px;
  padding-right: 10px;
  align-items: center;
  display: flex;
  font-size: 0.85em;
}
.notification {
  margin: 0.6rem;
}
.centered {
  align-items: center;
  display: flex;
  flex-direction: column;
}
.buttonBorder {
  border: solid;
  border-width: 1px;
  border-color: #48c78e;
}
</style>
