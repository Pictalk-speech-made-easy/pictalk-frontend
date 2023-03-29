<template>
  <div
    :data-cy="'cy-' + picto.id"
    :class="{
      pictowrapper: true,
      bigger:
        !dragndropId &&
        !publicMode &&
        !sidebarMode &&
        $route.query.isAdmin &&
        false,
    }"
    v-on="
      picto.collection &&
      !publicMode &&
      !sidebarMode &&
      $route.query.isAdmin &&
      isDropZone
        ? { dragover: onDragOver, dragleave: onDragLeave, drop: onDrop }
        : {}
    "
  >
    <div
      :id="picto.id"
      :collection="picto.collection"
      :class="{
        'has-background': picto.collection,
        'drop-area': isDropZone,
        'containing notification pictobackground pictogram': true,
      }"
    >
      <div
        id="pictogram-image-wrapper"
        :style="`width:100%; background-color:${this.picto.color}; border-radius:6px`"
      >
        <div
          v-if="$route.query.isAdmin && !publicMode && !sidebarMode"
          class="actions container"
          @click.self="addToSpeech()"
        >
          <div class="offline subtitle" v-if="!isOnline">
            <b-icon icon="web-cancel" />
          </div>
          <div
            v-if="isOnline"
            class="head-actions"
            @click.self="addToSpeech()"
            v-on="
              picto.collection &&
              !publicMode &&
              !sidebarMode &&
              $route.query.isAdmin &&
              isDropZone
                ? { dragover: onDragOver, dragleave: onDragLeave, drop: onDrop }
                : {}
            "
          >
            <div
              v-if="!publicMode && !sidebarMode && $route.query.isAdmin"
              :draggable="
                !publicMode && !sidebarMode && $route.query.isAdmin
                  ? true
                  : false
              "
              @dragstart="onDragStart"
              @dragend="onDragEnd"
            >
            <b-tooltip
                :label="$t('DragAndDrop')"
                :delay="500"
                position="is-bottom">
              <b-icon class="large-icon icon" icon="drag"></b-icon>
            </b-tooltip>
            </div>
            <div v-if="$route.query.isAdmin && !publicMode && !sidebarMode">
              <div
                data-cy="picto-action-dropdown"
                v-if="!dragndropId"
                @click="openActions()"
              >
              <b-tooltip
                :label="$t('Menu')"
                :delay="500"
                position="is-bottom">
                <b-icon class="medium-icon icon" icon="dots-vertical" />
              </b-tooltip>
              </div>
            </div>
          </div>
          <div
            class="longpress"
            v-long-press="350"
            @long-press-start="onLongPressStart"
            @click.self="addToSpeech()"
          ></div>
          <div
            v-if="!dragndropId && isOnline"
            class="main-actions"
            @click.self="addToSpeech()"
          >
            <div v-on="(isEditor || isToUser) && isOnline ? { click: editPicto } : {}">
              <b-tooltip
                :label="$t('Edit')"
                :delay="500"
                position="is-bottom">
              <b-icon
                class="medium-icon icon"
                v-bind:style="(isEditor || isToUser) && isOnline ? 'justify-self: end; color: hsl(210, 100%, 75%)' : 'justify-self: end; color: hsl(210, 100%, 75%); opacity: 0.5'"
                icon="pencil"
              />
              </b-tooltip>
            </div>
            <div v-if="picto.collection" v-on="picto.collection && isOnline ? { click: () => setCopyCollectionId(picto.id, !picto.collection) } : {}">
              <b-tooltip
                :label="$t('CopyPicto')"
                :delay="500"
                position="is-bottom">
              <b-icon
                class="medium-icon icon"
                v-bind:style="picto.collection && isOnline ? 'justify-self: end; color: hsl(45, 100%, 75%)' : 'justify-self: end; color: hsl(45, 100%, 75%); opacity: 0.5'"
                icon="vector-arrange-below"
              />
              </b-tooltip>
            </div>
            <div v-if="picto.collection" v-on="(isEditor || isToUser || isViewer) && picto.collection && isOnline ? { click: () => setShortcutCollectionId(picto.id, !picto.collection) } : {}">
              <b-tooltip
                :label="$t('LinkPicto')"
                :delay="500"
                position="is-bottom">
              <b-icon
                class="medium-icon icon"
                v-bind:style="(isEditor || isToUser || isViewer) && picto.collection && isOnline ? 'justify-self: start; color: hsl(140, 100%, 75%)' : 'justify-self: start; color: hsl(140, 100%, 75%); opacity: 0.5'"
                icon="vector-link"
              />
              </b-tooltip>
            </div>
            <div v-on="isOnline && canDelete ? {click:  deletePicto} : {}">
              <b-tooltip
                :label="$t('DeletePicto')"
                :delay="500"
                position="is-bottom">
              <b-icon
                class="medium-icon icon"
                v-bind:style="isOnline && canDelete ? 'justify-self: start; color: hsl(0, 100%, 75%)' : 'justify-self: start; color: hsl(0, 100%, 75%); opacity: 0.5'"
                icon="delete"
              />
              </b-tooltip>
            </div>
          </div>

          <div
            v-if="!dragndropId & isOnline"
            class="foot-actions"
            @click.self="addToSpeech()"
          >
          <b-tooltip
                :label="$t('Priority')"
                :delay="500"
                position="is-bottom">
            <b-button
              :disabled="!(isToUser || isEditor) || !isOnline"
              :style="colorPriority"
              @click="alternateStar(true, 2000)"
              class="priority-button"
            >
              <b>{{ showPriorityOrStarred }}</b>
            </b-button>
          </b-tooltip>
          </div>
        </div>
        <img
          draggable="false"
          :class="{ image: true, nopointerevents: $route.query.isAdmin }"
          :src="picto.image"
          :alt="picto.meaning[getUserLang]"
          @click.self="addToSpeech()"
          width="100%"
          crossorigin="anonymous"
          :style="`border: solid; border-color: ${this.picto.color}; border-width: 10px;`"
        />
        <b-skeleton class="skeleton-wrapper" height="100%" :active="skeleton" />
      </div>
      <div class="meaning">{{ picto.meaning[getUserLang] }}</div>
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
import deviceInfos from "@/mixins/deviceInfos";
import PictoSteps from "@/components/pictos/pictoSteps";
import pictoActions from "@/components/pictos/pictoActions";
import LongPress from "vue-directive-long-press";
import pictogram from "../../mixins/pictogram";
export default {
  mixins: [lang, deviceInfos, pictogram],
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
  directives: {
    "long-press": LongPress,
  },
  methods: {
    onLongPressStart() {
      this.openActions();
    },
    openActions() {
      this.$buefy.modal.open({
        parent: this,
        component: pictoActions,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x", "outside"],
        props: {
          picto: this.picto,
          publicMode: this.publicMode,
          sidebarMode: this.sidebar,
        },
      });
    },
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
      if (this.isDropZone) {
        this.getDOMcollectionById(this.picto.id)?.classList?.add(
          "dragOverZone"
        );
        document.querySelectorAll(".head-actions").forEach((element) => {
          element.style.display = "none";
        });
      }
    },
    onDragLeave(ev) {
      ev.preventDefault();
      this.timer = clearTimeout(this.timer);
      if (this.isDropZone) {
        this.getDOMcollectionById(this.picto.id)?.classList?.remove(
          "dragOverZone"
        );
      }
      this.dragImage = document.getElementById(this.dragndropId);
    },
    async onDrop(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      const targetId = ev.target.offsetParent.id;
      // Call the store action
      if (this.$store.getters.getDragndrop) {
        const dragndrop = this.$store.getters.getDragndrop;
        this.$store.commit("setDragndrop", undefined);
        this.timer = clearTimeout(this.timer);
        await this.moveToCollection(targetId, dragndrop);
        this.timer = clearTimeout(this.timer);
      }
    },
    async onDragEnd(ev) {
      document.querySelectorAll("div.head-actions").forEach((element) => {
        element.style.display = "flex";
      });
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
      ev.dataTransfer.setDragImage(this.$el.querySelector("img"), 0, 0);
      ev.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          id: this.picto.id,
          isCollection: this.picto.collection,
        })
      );
      ev.target.style.cursor = "grab";
      this.dragImage = ev.target.offsetParent;
    },
    getDOMcollectionById(id) {
      return Array.from(document.querySelectorAll("div.has-background")).filter(
        (e) => e.id == id
      )[0];
    },
  },
  computed: {
    isDropZone() {
      if (!this.dragndropId) {
        return false;
      }
      if (!this.picto.collection) {
        return false;
      }
      if (this.picto.id == this.dragndropId && !this.picto.collection) {
        return false;
      }
      if (!(this.isEditor || this.isToUser)) {
      }
      if (!this.$route.query.isAdmin) {
        return false;
      }
      if (!this.isOnline) {
        return false;
      }
      if (this.sidebarMode) {
        return false;
      }
      return true;
    },
    dragndropId() {
      return this.$store.getters.getDragndrop?.draggedPictoId;
    },
    pictoLink() {
      return this.publicMode
        ? String("/public/" + this.picto.id)
        : String("/pictalk/" + this.picto.id);
    },
  },
};
</script>
<style scoped>
.offline {
  text-align: center;
  font-size: 4rem;
  font-weight: 600;
  color: hsl(0, 100%, 65%);
}
.button:focus:not(:active),
.button.is-focused:not(:active) {
  box-shadow: none !important;
}
.priority-button {
  background-color: #ffffff00;
  border: none;
  font-size: 2.5em;
  text-shadow: 0px 0px 16px #000000d0;
  -webkit-text-stroke: 1.5px black;
  padding: 0;
  justify-content: end;
  height: 40px;
  width: 40px;
}

.priority-button > span > b {
  font-weight: 900 !important;
}
.priority-button:hover {
  filter: brightness(1.2);
}
.main-actions {
  color: white;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 0.75rem;
  column-gap: 0.75rem;
}
.large-icon {
  font-size: 2.75rem;
}
.medium-icon {
  font-size: 1.75rem;
}
.icon {
  text-shadow: 0px 0px 4px #000000d0;
  -webkit-text-stroke: 0.5px black;
  transition: 0.075s;
  cursor: pointer;
}
.icon:hover {
  text-shadow: 0px 0px 8px #000000;
  filter: brightness(1.2);
}
.head-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: absolute;
  align-self: baseline;
  padding: 6px;
}
.foot-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  position: absolute;
  align-self: flex-end;
  padding: 6px;
}
.actions > :is(.main-actions, .head-actions, .offline) {
  opacity: 0;
}
.actions:hover > :is(.main-actions, .head-actions, .offline) {
  opacity: 1;
}
.actions:hover {
  background-color: rgba(0, 0, 0, 0.6);
}
.actions {
  border-radius: 6px;
  width: calc(100% - 1.2rem);
  position: absolute;
  color: white;
  z-index: 2;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.075s ease-in-out;
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
.longpress {
  display: none;
}
.container {
  container-type: inline-size;
}
@container (max-width: 150px) {
  .longpress {
    display: block;
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: calc(100% - 2rem);
  }
  .nopointerevents {
    pointer-events: none;
  }
  .actions > :is(.head-actions) {
    opacity: 1;
  }
  .actions > :is(.main-actions, .foot-actions) {
    display: none;
  }
  .actions:hover {
    background-color: rgba(0, 0, 0, 0);
  }
  .head-actions {
    padding: 0px;
    margin-top: -0.1rem;
  }
  .priority-button {
    font-size: 1.75em;
    height: 32px;
    width: 32px;
  }
  .large-icon {
    font-size: 2.5rem;
  }
  .medium-icon {
    font-size: 1.75rem;
  }
  .icon {
    text-shadow: 0px 0px 2px #000000d0;
    -webkit-text-stroke: 1.25px black;
    transition: 0.075s;
    cursor: pointer;
  }
}
@media not (any-pointer: fine) {
  .longpress {
    display: block;
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: calc(100% - 2rem);
  }
  .nopointerevents {
    pointer-events: none;
  }
  .actions > :is(.head-actions) {
    opacity: 1;
  }
  .actions > :is(.main-actions, .foot-actions) {
    display: none;
  }
  .actions:hover {
    background-color: rgba(0, 0, 0, 0);
  }
  .head-actions {
    padding: 0px;
    margin-top: -0.1rem;
  }
  .priority-button {
    font-size: 1.75em;
    height: 32px;
    width: 32px;
  }
  .large-icon {
    font-size: 2.5rem;
  }
  .medium-icon {
    font-size: 1.75rem;
  }
  .icon {
    text-shadow: 0px 0px 2px #000000d0;
    -webkit-text-stroke: 1.25px black;
    transition: 0.075s;
    cursor: pointer;
  }
}
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
  background-color: white;
}
.pictowrapper {
  padding: 3px;
  position: relative;
  transition: 0.075s ease-in-out;
  min-width: 180px;
}
.pictowrapper:hover {
  z-index: 3;
}
.pictowrapper:hover > .pictogram > #pictogram-image-wrapper > .actions {
  opacity: 1;
  pointer-events: all;
}

.drop-area {
  box-shadow: 0 0 3px 3px hsl(150, 90%, 45%);
}
.bigger {
  transition: transform 0.2s; /* Animation */
}

.dragOverZone {
  transition: transform 0.2s; /* Animation */
  transform: scale(1.05);
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
@media screen and (max-width: 1023px) {
  .pictowrapper {
    min-width: 105px;
  }
}
</style>
