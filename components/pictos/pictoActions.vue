<template>
  <div class="modal-card small-card">
    <section class="modal-card-body">
      <p class="modal-card-title centered">{{ $t("PictoActions") }}</p>
      <p v-if="!isOnline" class="subtitle">❗{{ $t("PictoActionsOffline") }}</p>
      <div class="option">
        <b-button
          :disabled="!(isEditor || isToUser) || !isOnline"
          style="background-color: hsl(210, 100%, 75%)"
          icon-left="pencil"
          :label="$t('EditPicto')"
          @click="editPicto()"
          class="fullWidth modeButton"
        />
      </div>
      <div class="option">
        <b-button
          :disabled="!(isEditor || isToUser) || !isOnline"
          style="background-color: hsl(0, 100%, 75%)"
          icon-left="delete"
          :label="$t('DeletePicto')"
          @click="deletePicto()"
          class="fullWidth modeButton"
        />
      </div>
      <div
        v-if="!(isEditor || isToUser || isViewer) && picto.collection"
        class="option"
      >
        <b-button
          :disabled="!isOnline"
          style="background-color: hsl(210, 100%, 75%)"
          icon-left="plus"
          :label="$t('CopyPicto')"
          @click="setCopyCollectionId(picto.id, !picto.collection)"
          class="fullWidth modeButton"
        />
      </div>
      <div
        v-if="(isEditor || isToUser || isViewer) && picto.collection"
        class="option"
      >
        <b-button
          :disabled="!isOnline"
          style="background-color: hsl(45, 100%, 75%)"
          icon-left="vector-arrange-below"
          :label="$t('CopyPicto')"
          @click="setCopyCollectionId(picto.id, !picto.collection)"
          class="fullWidth modeButton"
        />
      </div>
      <div
        v-if="(isEditor || isToUser || isViewer) && picto.collection"
        class="option"
      >
        <b-button
          :disabled="!isOnline"
          style="background-color: hsl(140, 100%, 75%)"
          icon-left="vector-link"
          :label="$t('LinkPicto')"
          @click="setShortcutCollectionId(picto.id, !picto.collection)"
          class="fullWidth modeButton"
        />
      </div>
      <div
        v-if="(isEditor || isToUser || isViewer) && picto.collection"
        class="option"
      >
        <b-button
          :disabled="!isOnline"
          style="background-color: hsl(270, 100%, 75%)"
          icon-left="share-variant"
          :label="$t('SharePicto')"
          @click="sharePicto()"
          class="fullWidth modeButton"
        />
      </div>
      <div
        v-if="picto.collection && this.$store.getters.getUser.admin"
        class="option"
      >
        <b-button
          :disabled="!isOnline"
          :loading="publishLoad"
          :style="
            picto.public
              ? 'background-color: hsl(120, 100%, 75%)'
              : 'background-color: hsl(120, 0%, 96%)'
          "
          icon-left="web"
          :label="picto.public ? $t('Unpublish') : $t('Publish')"
          @click="publishPicto()"
          class="fullWidth modeButton"
        />
      </div>
      <div
        :class="{ option: true, 'priority-wrapper': true, offline: !isOnline }"
      >
        <b-button
          :disabled="!isOnline"
          :style="colorPriority"
          @click="alternateStar(false)"
          class="priority-button priority-label"
          label="-"
        />
        <b class="priority-label" :style="colorPriority">{{
          showPriorityOrStarred
        }}</b>
        <b-button
          :disabled="!isOnline"
          :style="colorPriority"
          @click="alternateStar()"
          class="priority-button priority-label"
          label="+"
        />
      </div>
    </section>
  </div>
</template>
<script >
import deleteItem from "@/components/pictos/deleteItem";
import PictoSteps from "@/components/pictos/pictoSteps";
import shareItem from "@/components/pictos/shareItem";
export default {
  props: {
    picto: {
      type: Object,
      required: true,
    },
    publicMode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    sidebarMode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  methods: {
    async setShortcutCollectionIdDirectlyToRoot(collectionId, isPicto) {
      let collection = JSON.parse(
        JSON.stringify(this.getCollectionFromId(this.$store.getters.getRootId))
      );
      if (isPicto) {
        collection.pictos.push({ id: collectionId });
        try {
          await this.$store.dispatch("editCollection", {
            id: collection.id,
            collections: collection.pictos,
          });
          const notif = this.$buefy.toast.open({
            message: this.$t("PublicCopy"),
            type: "is-success",
          });
        } catch (err) {
          throw new Error(
            "Could not add shortcut to root collection: " +
              JSON.stringify(collection.id)
          );
        }
      } else {
        collection.collections.push({ id: collectionId });
        try {
          await this.$store.dispatch("editCollection", {
            id: collection.id,
            collections: collection.collections,
          });
          const notif = this.$buefy.toast.open({
            message: this.$t("PublicCopy"),
            type: "is-success",
          });
        } catch (err) {
          throw new Error(
            "Could not add shortcut to root collection: " +
              JSON.stringify(collection.id)
          );
        }
      }
    },
    setCopyCollectionId(collectionId, isPicto) {
      this.$store.commit("setCopyCollectionId", {
        collectionId: collectionId,
        isPicto: isPicto,
      });
      this.$store.commit("resetShortcutCollectionId");
    },
    setShortcutCollectionId(collectionId, isPicto) {
      this.$store.commit("setShortcutCollectionId", {
        collectionId: collectionId,
        isPicto: isPicto,
      });
      this.$store.commit("resetCopyCollectionId");
    },
    async addToSpeech() {
      this.$store.commit("addSpeech", {
        ...this.picto,
        sidebar: this.sidebarMode,
      });
      if (this.picto.collection == true) {
        if (this.sidebarMode) {
          this.$router.push({
            query: {
              ...this.$route.query,
              sidebarPictoId: this.picto.id,
            },
          });
        } else {
          this.$router.push({
            path: this.pictoLink,
            query: { ...this.$route.query },
          });
        }
      }
      if (this.$store.getters.getUser.settings?.pronounceClick) {
        this.pronounce(
          this.picto.speech[this.getUserLang],
          this.getUserLang,
          this.voiceURI,
          this.pitch,
          this.rate
        );
      }
    },
    deletePicto() {
      this.$buefy.modal.open({
        parent: this,
        props: {
          object: { ...this.picto },
        },
        component: deleteItem,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    sharePicto() {
      this.$buefy.modal.open({
        parent: this,
        props: {
          picto: JSON.parse(JSON.stringify(this.picto)),
        },
        component: shareItem,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    async publishPicto() {
      try {
        this.publishLoad = true;
        await this.$store.dispatch("publish", this.picto);
        this.publishLoad = false;
      } catch (error) {
        console.log(error);
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("SomeThingBadHappened"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "account",
        });
      }
    },
    editPicto() {
      this.$buefy.modal.open({
        parent: this,
        props: {
          picto: JSON.parse(JSON.stringify(this.picto)),
          create: false,
          isPicto: !this.picto.collection,
        },
        component: PictoSteps,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    async alternateStar(sign = true, delay = 0) {
      try {
        if (this.picto.starred === true) {
          this.picto.priority = 1;
        } else if (this.picto.starred === false) {
          this.picto.priority = 10;
        }
        if (sign) {
          this.picto.priority = this.picto.priority + 1;
        } else {
          this.picto.priority = this.picto.priority - 1;
        }
        if (this.picto.priority > 10) {
          this.picto.priority = 1;
        } else if (this.picto.priority < 1) {
          this.picto.priority = 10;
        }
        await this.$store.dispatch(
          this.picto.collection
            ? "alternateCollectionStar"
            : "alternatePictoStar",
          {
            ...this.picto,
            priority: this.picto.priority,
          }
        );
        $nuxt.$emit("resyncPictoList", delay);
      } catch (error) {
        console.log(error);
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("SomeThingBadHappened"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "account",
        });
      }
    },
  },
  computed: {
    isToUser() {
      return this.$store.getters.getUser.id == this.picto.userId;
    },
    isEditor() {
      return (
        this.picto.editors?.find(
          (editor) => editor == this.$store.getters.getUser.username
        ) != undefined
      );
    },
    isViewer() {
      return (
        this.picto.viewers?.find(
          (viewer) => viewer == this.$store.getters.getUser.username
        ) != undefined
      );
    },
    isOnline() {
      console.log(window.navigator.onLine);
      return window.navigator.onLine;
    },
    showPriorityOrStarred() {
      if (this.picto.priority) {
        return this.picto.priority;
      } else {
        return this.picto.starred === true ? 1 : 10;
      }
    },
    colorPriority() {
      return (
        "color: hsl(" + (100 - this.showPriorityOrStarred * 10) + ", 100%, 60%)"
      );
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.offline {
  filter: opacity(0.5);
}
.priority-button {
  border: none;
  border-radius: 0%;
}
.button:focus:not(:active),
.button.is-focused:not(:active) {
  box-shadow: none !important;
}
.priority-wrapper:hover {
  box-shadow: 0px 0px 12px #00000090;
}
.priority-label {
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
  padding: 0px;
  background-color: #ffffff00;
  height: 100%;
  width: 100%;
  font-size: 2.25rem !important;
  font-weight: 900 !important;
  -webkit-text-stroke: 1.5px black !important;
}
.priority-wrapper {
  background-color: #edf1f5;
  padding: 0px !important;
  margin: 0.3em 0;
  border-radius: 6px;
  border: 2px solid #666;
  transition: all 0.05s;
}
.buttonBorder {
  border: solid;
  border-width: 1px;
  border-color: #48c78e;
}
.option {
  display: flex;
  align-items: center;
  padding: 0.3em 0;
}
.small-card {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 300px;
  min-width: 220px;
  max-height: 600px;
  min-height: 200px;
  border-radius: 12px;
}
.centered {
  text-align: center;
  margin-bottom: 0.5em;
}
.fullWidth {
  width: 100%;
  justify-content: left;
}
.modeButton {
  font-size: 1.2em;
  font-weight: 600;
  color: #171717;
  border: 2px solid #666;
  transition: all 0.05s;
}
.modeButton:hover {
  box-shadow: 0px 0px 12px #00000090;
}
</style>
