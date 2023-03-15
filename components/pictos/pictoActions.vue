<template>
  <div class="modal-card small-card">
    <section class="modal-card-body">
      <p class="modal-card-title centered">{{ $t("PictoActions") }}</p>
      <p v-if="!isOnline" class="subtitle">❗{{ $t("PictoActionsOffline") }}</p>
      <div class="option">
        <b-button
          data-cy="picto-action-dropdown-edit"
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
          data-cy="picto-action-dropdown-delete"
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
import pictogram from "../../mixins/pictogram";
export default {
  mixins: [pictogram],
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
