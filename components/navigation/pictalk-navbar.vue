<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-navbar-item
        tag="nuxt-link"
        to="/"
        style="padding: 0%; padding-right: 1px; padding-left: 1vw"
      >
        <img
          v-if="fits"
          src="~/assets/logo_compressed.png"
          alt="Logo of a web app that help speach-disabled people"
          height="44px"
					style="aspect-ratio: 411 / 130; margin-right: 0.5em"
        />
        <img
					style="aspect-ratio: 1 / 1; margin-right: 0.5em"
          height="44px"
          v-if="!fits"
					src="~/assets/small_logo.png"
          alt="Logo of a web app that help speach-disabled people"
        />

        <!--<b-tooltip
          v-if="$route.query.isAdmin"
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
        </b-tooltip>-->
      </b-navbar-item>
			<p class="version">{{ $config.clientVersion }}</p>
      <div
        :style="this.$route.path.includes('pictalk') ? '' : 'display:none'"
        class="columns is-mobile margins"
      >
        <div
          v-if="$route.query.isAdmin && !checkCopyCollectionId"
          class="column noPadding dropdown"
        >
          <b-dropdown
            id="nav-create"
            class="column"
            :mobile-modal="false"
            trap-focus
            :triggers="['click', 'hover']"
            aria-role="list"
          >
            <template #trigger>
              <b-button
                class="dropdown-button rounded"
                type="is-success"
                icon-right="plus"
                expanded
                ><b>{{ $t("Create") }}</b></b-button
              >
            </template>
            <b-dropdown-item
              class="verticalPadding"
              @click="addPicto(true)"
              aria-role="listitem"
              ><b>{{ $t("Pictogram") }}</b> <b-icon icon="image" />
            </b-dropdown-item>
            <b-dropdown-item
              class="verticalPadding"
              @click="addPicto(false)"
              aria-role="listitem"
              ><b>{{ $t("Collection") }}</b> <b-icon icon="folder-table" />
            </b-dropdown-item>
          </b-dropdown>
        </div>

        <div
          v-if="checkCopyCollectionId && $route.query.isAdmin"
          class="column noPadding"
        >
          <b-button
            class="addButton rounded"
            @click="copyCollection()"
            type="is-info"
            icon-right="content-paste"
          />
        </div>
        <div
          v-if="checkCopyCollectionId && $route.query.isAdmin"
          class="column noPadding"
        >
          <b-button
            class="addButton rounded"
            @click="cancelCopy()"
            type="is-light"
            icon-right="close"
          />
        </div>

        <div v-if="!checkCopyCollectionId" class="column noPadding">
          <b-button
            class="lock rounded"
            type="is-warning"
            :focused="Boolean($route.query.isAdmin)"
            @click="adminModeChoose()"
            :icon-right="$route.query.isAdmin ? '' : 'arrow-left'"
            :icon-left="iconIsAdmin"
            :label="$route.query.isAdmin ? $t('Viewer') : $t('Editor')"
          />
        </div>
      </div>
    </template>
    <template slot="start">
      <b-navbar-dropdown :label="$t('Menu')">
        <b-navbar-item tag="nuxt-link" to="/"> {{ $t("Home") }}</b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/news"
          >{{ $t("News") }} &#127881;</b-navbar-item
        >
        <b-navbar-item tag="nuxt-link" to="/informations"
          >{{ $t("Informations") }} 👐</b-navbar-item
        >
      </b-navbar-dropdown>
      <b-navbar-item tag="nuxt-link" to="/tutorials"
        >{{ $t("Tutorial") }} 🚀</b-navbar-item
      >
    </template>
    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons b-tooltips">
          <b-button
            v-if="isAdministrator()"
            type="is-success is-light"
            icon-right="poll"
            tag="nuxt-link"
            to="/administration"
          />

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
              @click="openModeModal()"
              :icon-left="icon"
              :class="'modeButton ' + colorClass"
              icon-right="menu-down"
            />
          </b-tooltip>

          <b-tooltip
            v-if="getUserNotifications() && getUserNotifications().length != 0"
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
              class="notificationsdrop"
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
                  v-for="notification in getUserNotifications()"
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
          <!--
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
          -->
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
import modeModal from "@/components/navigation/modeModal.vue";
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
    if (window.navigator.onLine) {
      try {
        await this.$store.dispatch("getNotifications");
      } catch (err) {}
    }
    this.intervalId = setInterval(async () => {
      if (window.navigator.onLine) {
        try {
          let notifCount = this.$store.getters.getUser.notifications.length;
          await this.$store.dispatch("getNotifications");
          if (notifCount < this.$store.getters.getUser.notifications.length) {
            this.$buefy.notification.open({
              message: this.$t("UnreadNotifications"),
              type: "is-info",
            });
          }
        } catch (err) {
          console.log(err);
          clearInterval(this.intervalId);
          return [];
        }
      }
    }, 60000);
  },
  data() {
    return {
      icon: "",
      colorClass: "",
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
    if (this.$route.path.includes("pictalk")) {
      this.icon = "home";
      this.colorClass = "mainColor";
    }
    if (this.$route.path.includes("public")) {
      this.icon = "web";
      this.colorClass = "publicColor";
    }
    if (this.$route.path.includes(this.sharedLink)) {
      this.icon = "folder-account";
      this.colorClass = "sharedColor";
    }
    if (this.$route.path.includes(this.sidebarLink)) {
      this.icon = "page-layout-sidebar-right";
      this.colorClass = "sidebarColor";
    }
  },
  watch: {
    $route(to, from) {
      if (to.path.includes("pictalk")) {
        this.icon = "home";
        this.colorClass = "mainColor";
      }
      if (to.path.includes("public")) {
        this.icon = "web";
        this.colorClass = "publicColor";
      }
      if (to.path.includes(this.sharedLink)) {
        this.icon = "folder-account";
        this.colorClass = "sharedColor";
      }
      if (to.path.includes(this.sidebarLink)) {
        this.icon = "page-layout-sidebar-right";
        this.colorClass = "sidebarColor";
      }
    },
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
    isAdministrator() {
      return this.$store.getters.getUser.admin;
    },
    getUserNotifications() {
      return this.$store.getters.getUser.notifications;
    },
    cancelCopy() {
      this.$store.commit("resetCopyCollectionId");
      this.$store.commit("resetShortcutCollectionId");
    },
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
    openModeModal() {
      this.$buefy.modal.open({
        parent: this,
        component: modeModal,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x", "outside"],
      });
    },
    fitsBigger() {
      this.fits = window.innerWidth > 560;
    },
    getCollectionFromId(id) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === id
      );
      return this.$store.getters.getCollections[index];
    },
    adminModeChoose() {
      if (this.admin) {
        this.$store.commit("setDragndrop", null);
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
        let meaning = notification.meaning[this.getUserLang];
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
  max-height: 600px;
  overflow-y: auto;
}
.lock {
  width: 90%;
  display: flex;
  border: solid;
  border-color: #4c4329;
  border-width: 1px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
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
  margin-top: 4px;
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

.dropdown {
  display: flex;
  align-items: center;
  justify-content: center;
}
.dropdown-button {
  height: 44px;
}
.verticalPadding {
  padding-top: 0.75em;
  padding-bottom: 0.75em;
}
.rounded {
  border-radius: 24px;
}
.modeButton {
  color: white;
  border-color: transparent;
}
.modeButton:hover {
  color: #f1f1f1;
}
.version {
	display: flex;
	align-items: flex-end;
	font-size: 00.65em;
	margin-bottom: 2px;
	margin-left: -2em;
	width: 5px;
}
</style>
