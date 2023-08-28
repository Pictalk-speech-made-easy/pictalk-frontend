<template>
  <b-navbar fixed-top>
    <template slot="brand">
      <b-tooltip 
        position="is-bottom"
        multilined
        size="is-small"
        type="is-primary"
        :label="$t('TooltipReturn')"
        :delay="1000"
        :triggers="['hover']"
        style="margin-top: 3px"
      >
        <b-button
            :disabled="parseInt($route.query.fatherCollectionId) == $store.getters.getUser.root"
            class="customButton"
            style="background-color: hsl(210, 100%, 60%); min-width: 80px"
            @click="navigateToParentCollection()"
            icon-right="arrow-left"
        />
        </b-tooltip>
      <b-navbar-item
        v-if="!$route.query.isAdmin"
        class="logo"
        tag="nuxt-link"
        v-bind:to="$route.query.isAdmin ? '/': ''"
        style="padding: 0%; padding-right: 1px; padding-left: 1vw;"
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
      </b-navbar-item>
      <div
        :style="this.$route.path.includes('pictalk') ? '' : 'display:none'"
        class="columns is-mobile margins"
      >
        <div
          v-if="$route.query.isAdmin && !checkCopyCollectionId"
          class="column noPadding dropdown"
        >
          <b-dropdown
            :disabled="!isEditorFatherId && !isToUserFatherId"
            id="nav-create"
            class="column"
            :mobile-modal="false"
            trap-focus
            :triggers="['click', 'hover']"
            aria-role="list"
          >
            <template #trigger>
              <b-button
                :disabled="!isEditorFatherId && !isToUserFatherId"
                style="background-color: hsl(154, 100%, 65%)"
                data-cy="pictalk-navbar-create-button"      
                icon-right="plus"
                :label="$t('Create')"
                class="customButton"
              />
            </template>
            <b-dropdown-item
              class="verticalPadding"
              @click="addPicto(true)"
              aria-role="listitem"
              data-cy="pictalk-navbar-create-pictogram-button"
              ><b>{{ $t("Pictogram") }}</b> <b-icon icon="image" />
            </b-dropdown-item>
            <b-dropdown-item
              class="verticalPadding"
              @click="addPicto(false)"
              aria-role="listitem"
              data-cy="pictalk-navbar-create-collection-button"
              ><b>{{ $t("Collection") }}</b> <b-icon icon="folder-table" />
            </b-dropdown-item>
          </b-dropdown>
        </div>

        <div
          v-if="checkCopyCollectionId && $route.query.isAdmin"
          class="column noPadding"
        >
          <b-button
            class="customButton"
            style="background-color: hsl(210, 100%, 60%); min-width: 80px"
            @click="copyCollection()"
            icon-right="content-paste"
          />
        </div>
        <div
          v-if="checkCopyCollectionId && $route.query.isAdmin"
          class="column noPadding"
        >
          <b-button
            class="customButton"
            style="background-color: hsl(0, 0%, 96%); min-width: 80px"
            @click="cancelCopy()"
            icon-right="close"
          />
        </div>
      </div>
    </template>
    <template slot="start">
      <b-navbar-dropdown data-cy="pictalk-navbar-dropdown" :label="$t('Menu')">
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
            to="/administration/"
          />
          <b-tooltip 
          position="is-bottom"
            multilined
            size="is-small"
            type="is-primary"
            :label="$t('TooltipAdmin')"
            :delay="1000"
            :triggers="['hover']"
            >
          <div
          v-if="!checkCopyCollectionId || !$route.query.isAdmin"
          class="column noPadding"
          >
            <b-button
              style="background-color: hsl(44, 100%, 65%)"
              data-cy="pictalk-navbar-admin-button"
              :icon-left="iconIsAdmin"
              :label="$route.query.isAdmin ? $t('Viewer') : $t('Editor')"
              @click="adminModeChoose()"
              class="fullWidth customButton rotateArrow"
            />
          </div>
          </b-tooltip>
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
              style="color: white"
              icon-right="menu-down"
              :icon-left="icon"
              :class="'customButton ' + colorClass"
            />
          </b-tooltip>

          <b-tooltip
            v-if="this.notifications.length != 0"
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
                <b-button
                  style="background-color: hsl(0, 100%, 100%); color: #ff5757"
                  icon-right="bell-alert"
                  class="customButton"
                />
              </template>
              <b-dropdown-item
                aria-role="menu-item"
                :focusable="false"
                custom
                class="lessPadding limitHeight"
              >
                <div
                  v-for="notification in this.notifications"
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
                            :src="notification.image"
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
              style="background-color: hsl(207, 100%, 65%)"
              @click="goToAccount()"
              icon-right="cog"
              class="customButton"
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
              style="background-color: hsl(34, 100%, 55%)"
              icon-right="bug"
              class="customButton"
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
            <b-button
              style="background-color: hsl(0, 100%, 100%)"
              icon-right="logout"
              class="customButton"
              @click="onLogout"
            />
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
    if (process.client) {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel("offline-ready");
      bc.onmessage = (event) => {
        if (event.isTrusted) {
          this.offlineReadyTotal = event.data.total;
          this.offlineReadyProgress = event.data.progress;
        }
      };
      const bc1 = new BroadcastChannel("authenticated-webworker");
      console.log("Posting message to webworker")
      if (this.$store.getters.getJwtFromCookie && this.$store.getters.getJwtExpDateFromCookie) {
        bc1.postMessage({jwt: this.$store.getters.getJwtFromCookie, expDate: this.$store.getters.getJwtExpDateFromCookie});
      }
      bc1.onmessage = (event) => {
        console.log("Received authenticated event from webworker")
        if (event.isTrusted) {
          if (event.data === "authenticated") {
            bc1.postMessage({jwt: this.$store.getters.getJwtFromCookie, expDate: this.$store.getters.getJwtExpDateFromCookie});
          }
        }
      };
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
    }
  },
  async fetch() {
    if (process.client) {
      this.notifications = await this.$store.dispatch("getNotifications");
    }
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
      notifications : [],
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
    publicMode() {
      return this.$route.path.includes("public");
    },
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
    async isEditorFatherId() {
      const collection = await this.getCollectionFromId(parseInt(this.$route.query.fatherCollectionId, 10))
      return collection?.editors.find(
          (editor) => editor == this.$store.getters.getUser.username
        ) != undefined
    },
    async isToUserFatherId() {
      const collection = await this.getCollectionFromId(parseInt(this.$route.query.fatherCollectionId, 10))
      return collection?.userId == this.$store.getters.getUser.id
    }
  },
  methods: {
    navigateToParentCollection() {
      const speechCollectionArray = this.$store.getters.getSpeech.filter((picto) => !picto.sidebar && picto.collection);
      const speechCollectionArrayBeforePosition = speechCollectionArray.slice(0, speechCollectionArray.findIndex((picto) => picto.id == parseInt(this.$route.query.fatherCollectionId)));
      if (speechCollectionArrayBeforePosition.length < 1) {
        if (this.publicMode) {
          this.$router.push(
            { path: "/public/",
            query: { ...this.$route.query, fatherCollectionId: 346 },
          });
        } else {
          if (this.$store.getters.getRootId) {
            this.$router.push({
              query: { ...this.$route.query, isAdmin: this.$route.query.isAdmin, fatherCollectionId: this.$store.getters.getRootId },
            });
          } else {
            this.$router.push({
              query: { ...this.$route.query, isAdmin: this.$route.query.isAdmin },
            });
          }
        }
      } else {
        this.$router.push({
          path: this.publicMode ? "/public" : "/pictalk",
          query: { ...this.$route.query, fatherCollectionId: speechCollectionArrayBeforePosition[speechCollectionArrayBeforePosition.length - 1]?.id },
        });
      }
    },
    isAdministrator() {
      return this.$store.getters.getUser.admin;
    },
    cancelCopy() {
      this.$store.commit("resetCopyCollectionId");
      this.$store.commit("resetShortcutCollectionId");
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
      this.fits = window.innerWidth > 600;
    },
    async getCollectionFromId(id) {
      return this.$store.getters.getCollectionFromId(id)
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
              fatherCollectionId: this.$route.query.fatherCollectionId,
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
                fatherCollectionId: this.$route.query.fatherCollectionId,
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
                parseInt(this.$route.query.fatherCollectionId, 10)
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
          query: { ...this.$route.query, fatherCollectionId: notification.affected },
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
.logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
@media (min-width: 1216px) {
  .logo {
    left: 0;
    transform: none;
    position: relative;
  }
}
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
  margin-left: 20px;
  margin-right: 1vw;
  margin-top: 4px;
  height: 44px;
  align-items: center;
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
