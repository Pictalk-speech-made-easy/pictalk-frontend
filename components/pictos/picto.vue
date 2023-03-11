<template>
  <div
    :data-cy="'cy-'+picto.id"
    :class="{
      pictowrapper: true,
      bigger:
        !dragndropId &&
        !publicMode &&
        !sidebarMode &&
        $route.query.isAdmin &&
        false,
    }"
  >
    <div
      :id="picto.id"
      :collection="picto.collection"
      v-on="
        picto.collection &&
        !publicMode &&
        !sidebarMode &&
        $route.query.isAdmin &&
        isDropZone
          ? { dragover: onDragOver, dragleave: onDragLeave, drop: onDrop }
          : {}
      "
      :class="{
        'has-background': picto.collection,
        'drop-area': isDropZone,
        'containing notification pictobackground pictogram': true,
        grabbable: !publicMode && !sidebarMode && $route.query.isAdmin,
      }"
    >
      <div id="pictogram-image-wrapper" style="width: 100%">
        <img
          draggable="false"
          class="image"
          :src="picto.image"
          :alt="picto.meaning[getUserLang]"
          @click="addToSpeech()"
          width="100%"
          crossorigin="anonymous"
          :style="`border: solid; border-color: ${this.picto.color}`"
        />
        <b-skeleton class="skeleton-wrapper" height="100%" :active="skeleton" />
        <div
          v-if="!publicMode && !sidebarMode && $route.query.isAdmin"
          :draggable="
            !publicMode && !sidebarMode && $route.query.isAdmin ? true : false
          "
          @dragstart="onDragStart"
          @dragend="onDragEnd"
          class="dragbutton"
          @click="addToSpeech()"
        ></div>
      </div>
      <div class="meaning">
        {{ picto.meaning[getUserLang] }}
      </div>
      <div
        v-if="$route.query.isAdmin && !publicMode && !sidebarMode"
        class="adminMenu adminoption columns smallMargin"
      >
        <b-dropdown  aria-role="menu" class="column noMargin is-mobile">
          <template #trigger="{ active }">
            <b-button
            data-cy="picto-action-dropdown"
              type="is-info"
              :icon-right="active ? 'menu-up' : 'menu-down'"
            />
          </template>
          <b-dropdown-item aria-role="listitem">
            <b-button
              data-cy="picto-action-dropdown-edit"
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
              data-cy="picto-action-dropdown-delete"
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
        <div class="column noMargin is-mobile">
          <b-button
            :disabled="!(isToUser || isEditor) || !isOnline"
            :style="colorPriority"
            @click="alternateStar()"
          >
          <b>{{showPriorityOrStarred}}</b>
          </b-button>
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
  mixins: [lang, deviceInfos],
  name: "picto",
  components: {
    PictoSteps,
  },
  watch: {},
  data() {
    return {
      timer: 0,
      publishLoad: false,
      dragImage: undefined,
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
        if (image.nextElementSibling) {
          image.nextElementSibling.style.display = "none";
        }
      });
    }
  },
  methods: {
    async moveToCollection(targetId, data) {
      if (data.draggedPictoId != targetId) {
        try {
          await this.$store.dispatch("moveToCollection", {
            moveToCollectionDto: {
              ...(!data.isCollection && {
                sourcePictoId: Number(data.draggedPictoId),
              }),
              ...(data.isCollection && {
                sourceCollectionId: Number(data.draggedPictoId),
              }),
              targetCollectionId: Number(targetId),
            },
            fatherCollectionId: Number(data.fatherCollectionId),
          });
          $nuxt.$emit("resyncPictoList");
        } catch (error) {
          if (error?.response?.status == 401) {
            const notif = this.$buefy.toast.open({
              message: this.$t("NotAuthorized"),
              type: "is-danger",
            });
          } else if (error?.response?.status == 500) {
            const notif = this.$buefy.toast.open({
              message: this.$t("SomethingBadHappened"),
              type: "is-danger",
            });
          }
        }
      }
    },
    onDragOver(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      //set transfer image little
      if (!this.timer && this.isDropZone) {
        this.timer = setTimeout(() => {
          this.addToSpeech();
        }, 1500);
      }
      if (this.picto.id != this.dragndropId && this.isDropZone) {
        document.getElementById(this.picto.id)?.classList?.add("dragOverZone");
      }

      // this.dragImage = document.getElementById(this.dragEvent);
      // console.log(this.dragImage);
      //this.dragImage.classList.add("dragOverElement");
      //ev.dataTransfer.setDragImage(this.dragImage, 0, 0);
    },
    onDragLeave(ev) {
      ev.preventDefault();
      this.timer = clearTimeout(this.timer);
      if (this.picto.id != this.dragndropId && this.isDropZone) {
        document
          .getElementById(this.picto.id)
          ?.classList?.remove("dragOverZone");
      }
      this.dragImage = document.getElementById(this.dragndropId);
      //this.dragImage.classList.remove("dragOverElement");
      //ev.dataTransfer.setDragImage(this.dragImage, 0, 0);
    },
    async onDrop(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      const targetId = ev.target.offsetParent.id;
      // Call the store action
      if (this.$store.getters.getDragndrop) {
        const dragndrop = this.$store.getters.getDragndrop;
        this.$store.commit("setDragndrop", undefined);
        await this.moveToCollection(targetId, dragndrop);
        this.timer = clearTimeout(this.timer);
      }
    },
    async onDragEnd(ev) {
      if (
        this.$store.getters.getDragndrop &&
        this.$store.getters.getDragndrop.fatherCollectionId !=
          parseInt(this.$route.params.fatherCollectionId)
      ) {
        const dragndrop = this.$store.getters.getDragndrop;
        if (this.$store.getters.getDragndrop) {
          this.$store.commit("setDragndrop", undefined);
        }
        await this.moveToCollection(
          parseInt(this.$route.params.fatherCollectionId),
          dragndrop
        );
      }
      if (this.$store.getters.getDragndrop) {
        this.$store.commit("setDragndrop", undefined);
      }
      this.timer = clearTimeout(this.timer);
    },
    onDragStart(ev) {
      ev.dataTransfer.clearData();
      // Add different types of drag data
      this.$store.commit("setDragndrop", {
        draggedPictoId: this.picto.id,
        fatherCollectionId: parseInt(this.$route.params.fatherCollectionId),
        isCollection: this.picto.collection,
      });

      ev.dataTransfer.dropEffect = "move";
      ev.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          id: this.picto.id,
          isCollection: this.picto.collection,
        })
      );
      ev.target.style.cursor = "grab";
      this.dragImage = ev.target.offsetParent;
      ev.dataTransfer.setDragImage(this.dragImage, 0, 0);
    },
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
        if (this.picto.starred === true) {
          this.picto.priority = 1;
        } else if (this.picto.starred === false) {
          this.picto.priority = 10;
        }

        if (this.picto.priority == 10) {
          this.picto.priority = 1
        } else {
          this.picto.priority = this.picto.priority+1;
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
    showPriorityOrStarred() {
      if (this.picto.priority) {
        return this.picto.priority
      } else {
        return this.picto.starred === true ? 1 : 10
      }
    },
    colorPriority() {
      let colorPrio = "#FF5757";
       if (this.picto.priority === 1) {
        colorPrio = "#FF9494";
      } else if (this.picto.priority === 2) {
        colorPrio = "#FFB3B3";
      } else if (this.picto.priority === 3) {
        colorPrio = "#FFCDC8"
      } else if (this.picto.priority === 4) {
        colorPrio = "#86ADC6"
      } else if (this.picto.priority === 5) {
        colorPrio = "#ACC9D8"
      } else if (this.picto.priority === 6) {
        colorPrio = "#C8DBE5"
      } else if (this.picto.priority === 7) {
        colorPrio = "#22BD22"
      } else if (this.picto.priority === 8) {
        colorPrio = "#75DE75"
      } else if (this.picto.priority === 9) {
        colorPrio = "#C7FFC7"
      } else if (this.picto.priority === 10) {
        colorPrio = "#ffffff"
      }
      return `background-color: ${colorPrio}`
    },
    isDropZone() {
      return (
        this.dragndropId &&
        this.picto.collection &&
        this.picto.id != this.dragndropId &&
        (this.isEditor || this.isToUser) &&
        this.$route.query.isAdmin &&
        this.isOnline &&
        !this.sidebarMode
      );
    },
    dragndropId() {
      return this.$store.getters.getDragndrop?.draggedPictoId;
    },
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
  position: relative;
}
.dragbutton {
  top: 0.6rem;
  left: 0.6rem;
  position: absolute;
  display: block;
  width: calc(100% - 1.2rem);
  border-radius: 4px;
  background-color: #00000000;
  z-index: 1;
  aspect-ratio: 1 / 1;
}

.drop-area {
  box-shadow: 0 0 3px 3px hsl(150, 90%, 45%);
}
.bigger {
  transition: transform 0.2s; /* Animation */
}

.dragOverZone {
  transition: transform 0.2s; /* Animation */
  transform: scale(1.1);
}
.dragOverElement {
  transition: transform 0.2s; /* Animation */
  transform: scale(0.9);
}
.grabbable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
#pictogram-image-wrapper > .b-skeleton.is-animated {
  width: calc(100% - 1.2rem);
  aspect-ratio: 1 / 1;
  position: absolute;
  top: 0.6rem;
}
.skeleton-wrapper {
  width: 100%;
  height: 100%;
}
</style>
