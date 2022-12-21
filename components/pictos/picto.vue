<template>
  <div class="pictowrapper">
    <div
      :class="[
        !picto.collection
          ? 'containing notification pictobackground pictogram'
          : 'containing  notification pictobackground pictogram has-background',
      ]"
    >
      <div id="pictogram-image-wrapper" style="width: 100%">
        <img
          class="image"
          :src="picto.image"
          :alt="picto.meaning[getUserLang]"
          @click="addToSpeech()"
          width="100%"
          crossorigin="anonymous"
          :style="`border: solid; border-color: ${this.picto.color}`"
        />
        <b-skeleton class="skeleton-wrapper" height="100%" :active="skeleton" />
      </div>
      <div class="meaning">
        {{ picto.meaning[getUserLang] }}
      </div>
      <div
        v-if="$route.query.isAdmin && !publicMode && !sidebarMode"
        class="adminMenu adminoption columns smallMargin"
      >
        <b-dropdown aria-role="menu" class="column noMargin is-mobile">
          <template #trigger="{ active }">
            <b-button
              type="is-info"
              :icon-right="active ? 'menu-up' : 'menu-down'"
            />
          </template>
          <b-dropdown-item aria-role="listitem">
            <b-button
              :disabled="!(isEditor || isToUser) || !isOnline"
              type="is-info"
              icon-left="pencil"
              :label="$t('EditPicto')"
              :expanded="true"
              @click="editPicto()"
            />
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem">
            <b-button
              :disabled="!isOnline || !isToUser"
              :expanded="true"
              type="is-danger"
              icon-left="delete"
              :label="$t('DeletePicto')"
              @click="deletePicto()"
            />
          </b-dropdown-item>
          <b-dropdown-item
            v-if="!(isEditor || isToUser || isViewer) && picto.collection"
            aria-role="listitem"
          >
            <b-button
              :expanded="true"
              type="is-success"
              icon-left="plus"
              :label="$t('CopyPicto')"
              @click="setCopyCollectionId(picto.id, !picto.collection)"
            />
          </b-dropdown-item>
          <b-dropdown-item
            v-if="(isEditor || isToUser || isViewer) && picto.collection"
            aria-role="listitem"
          >
            <b-button
              :expanded="true"
              type="is-warning"
              icon-left="vector-arrange-below"
              :label="$t('CopyPicto')"
              @click="setCopyCollectionId(picto.id, !picto.collection)"
            />
          </b-dropdown-item>
          <b-dropdown-item
            v-if="(isEditor || isToUser || isViewer) && picto.collection"
            aria-role="listitem"
          >
            <b-button
              :expanded="true"
              type="is-dark"
              icon-left="vector-link"
              :label="$t('LinkPicto')"
              @click="setShortcutCollectionId(picto.id, !picto.collection)"
            />
          </b-dropdown-item>
          <b-dropdown-item
            v-if="picto.collection && (isToUser || isViewer || isEditor)"
            aria-role="listitem"
          >
            <b-button
              :expanded="true"
              type="is-success"
              icon-left="share-variant"
              :label="$t('SharePicto')"
              @click="sharePicto()"
            />
          </b-dropdown-item>
          <b-dropdown-item
            v-if="picto.collection && this.$store.getters.getUser.admin"
            aria-role="listitem"
          >
            <b-button
              :expanded="true"
              :loading="publishLoad"
              :type="picto.public ? 'is-danger' : 'is-success'"
              icon-left="web"
              :label="picto.public ? $t('Unpublish') : $t('Publish')"
              @click="publishPicto()"
            />
          </b-dropdown-item>
        </b-dropdown>

        <div class="column noMargin is-mobile" v-if="picto.starred == true">
          <b-button
            :disabled="!(isToUser || isEditor) || !isOnline"
            type="is-success"
            icon-right="star"
            @click="alternateStar()"
          />
        </div>
        <div class="column noMargin is-mobile" v-else>
          <b-button
            :disabled="!(isToUser || isEditor) || !isOnline"
            type="is-light"
            icon-right="star"
            @click="alternateStar()"
          />
        </div>
      </div>
      <div
        v-if="
          publicMode && $store.getters.getUser && $store.getters.isAuthenticated
        "
        class="adminMenu adminoption columns smallMargin"
      >
        <div class="column noMargin is-mobile">
          <b-button
            :disabled="!isOnline"
            type="is-success"
            icon-right="plus"
            @click="
              setShortcutCollectionIdDirectlyToRoot(picto.id, !picto.collection)
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script >
import lang from "@/mixins/lang";
import tts from "@/mixins/tts";
import deviceInfos from "@/mixins/deviceInfos";
import deleteItem from "@/components/pictos/deleteItem";
import PictoSteps from "@/components/pictos/pictoSteps";
import shareItem from "@/components/pictos/shareItem";
export default {
  mixins: [lang, tts, deviceInfos],
  name: "picto",
  components: {
    PictoSteps,
  },
  data() {
    return {
      publishLoad: false,
      skeleton: true,
    };
  },
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
  mounted() {
    const images = document.getElementsByClassName("image");
    for (let image of images) {
      image.addEventListener("load", () => {
        image.nextElementSibling.style.display = "none";
      });
    }
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
    async alternateStar() {
      try {
        await this.$store.dispatch(
          this.picto.collection
            ? "alternateCollectionStar"
            : "alternatePictoStar",
          {
            ...this.picto,
            starred: !this.picto.starred,
          }
        );
        $nuxt.$emit("resyncPictoList");
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
    getCollectionFromId(id) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === id
      );
      return this.$store.getters.getCollections[index];
    },
  },
  computed: {
    pictoLink() {
      return this.publicMode
        ? String("/public/" + this.picto.id)
        : String("/pictalk/" + this.picto.id);
    },
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
      return window.navigator.onLine;
    },
    isAdmin() {},
  },
};
</script>
<style scoped>
.has-background {
  box-shadow: 6px 6px 6px #00000060;
  border-color: #000000 !important;
  border-style: solid !important;
}
.containing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.adminoption {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.image {
  margin: auto;
  border-radius: 6px;
  aspect-ratio: 1/1;
  object-fit: contain;
}
.adminMenu {
  align-self: center;
  margin-top: auto;
  margin-left: 0%;
  margin-right: 0%;
}
.noMargin {
  padding: 0%;
}
.meaning {
  font-size: 1rem;
  padding-bottom: 0.15rem;
  max-width: 100%;
  overflow-wrap: break-word;
}
.pictobackground {
  background-color: #ffffff00;
}
.notification {
  padding: 0.6rem;
  padding-bottom: 0.1rem;
}
.smallMargin {
  margin-bottom: 2px;
}
.pictogram {
  border-style: solid;
  border-width: 1px;
  border-radius: 12px;
  border-color: #00000014;
}
.pictowrapper {
  padding: 3px;
}
#pictogram-image-wrapper > .b-skeleton.is-animated {
  width: calc(100% - 1.2rem);
  aspect-ratio: 1 / 1;
  position: absolute;
  top: -100%;
}
.skeleton-wrapper {
  width: 100%;
  height: 100%;
}
</style>
