<template>
  <div
    :class="[!picto.collection ? 'containing' : 'containing has-background']"
  >
    <div>
      <img
        class="image"
        :src="picto.image"
        @click="addToSpeech()"
        width="77%"
        crossorigin="anonymous"
        :style="`border: solid; border-color: ${this.picto.color}`"
      />
    </div>
    <div class="notification meaning">
      {{ picto.meaning[getUserLang] }}
    </div>
    <div v-if="adminMode && !publicMode" class="adminMenu adminoption columns">
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
            icon-right="pencil"
            :expanded="true"
            @click="editPicto()"
          />
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem">
          <b-button
            :disabled="!isOnline"
            :expanded="true"
            type="is-danger"
            icon-right="delete"
            @click="deletePicto()"
          />
        </b-dropdown-item>
        <b-dropdown-item
          v-if="picto.collection && !(isEditor || isToUser)"
          aria-role="listitem"
        >
          <b-button
            :expanded="true"
            type="is-success"
            icon-right="plus"
            @click="setCopyCollectionId(picto.id)"
          />
        </b-dropdown-item>
        <b-dropdown-item
          v-if="picto.collection && (isEditor || isToUser)"
          aria-role="listitem"
        >
          <b-button
            :expanded="true"
            type="is-warning"
            icon-right="content-copy"
            @click="setShortcutCollectionId(picto.id)"
          />
        </b-dropdown-item>
        <b-dropdown-item
          v-if="picto.collection && isToUser"
          aria-role="listitem"
        >
          <b-button
            :expanded="true"
            type="is-success"
            icon-right="share-variant"
            @click="sharePicto()"
          />
        </b-dropdown-item>
      </b-dropdown>

      <div class="column noMargin is-mobile" v-if="picto.starred == true">
        <b-button
          type="is-success"
          icon-right="star"
          @click="alternateStar()"
        />
      </div>
      <div class="column noMargin is-mobile" v-else>
        <b-button type="is-light" icon-right="star" @click="alternateStar()" />
      </div>
    </div>
    <div v-if="publicMode" class="adminMenu adminoption columns">
      <div class="column noMargin is-mobile">
        <b-button
          type="is-success"
          icon-right="plus"
          @click="setShortcutCollectionIdDirectlyToRoot(picto.id)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import deleteItem from "@/components/pictos/deleteItem";
import PictoSteps from "@/components/pictos/pictoSteps";
import shareItem from "@/components/pictos/shareItem";
export default {
  name: "picto",
  components: {
    PictoSteps,
  },
  props: {
    adminMode: {
      type: Boolean,
      required: true,
    },
    picto: {
      type: Object,
      required: true,
    },
    publicMode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  methods: {
    async setShortcutCollectionIdDirectlyToRoot(collectionId) {
      let collection = JSON.parse(
        JSON.stringify(this.getCollectionFromId(this.$store.getters.getRootId))
      );
      collection.collections.push({ id: collectionId });
      await this.$store.dispatch("editCollection", {
        id: collection.id,
        collections: collection.collections,
      });
    },
    setCopyCollectionId(collectionId) {
      this.$store.commit("setCopyCollectionId", collectionId);
      this.$store.commit("resetShortcutCollectionId");
    },
    setShortcutCollectionId(collectionId) {
      this.$store.commit("setShortcutCollectionId", collectionId);
      this.$store.commit("resetCopyCollectionId");
    },
    addToSpeech() {
      this.$store.commit("addSpeech", this.picto);
      if (this.picto.collection == true) {
        let adminMode = "";
        if (this.$route.query.isAdmin) {
          adminMode = "?isAdmin=true";
        }
        this.$router.push(this.pictoLink + adminMode);
      }
      if (this.$store.getters.getUser.settings?.pronounceClick) {
        this.pronounce(this.picto);
      }
    },
    async pronounce(picto) {
      if ("speechSynthesis" in window) {
        let voices = window.speechSynthesis.getVoices();
        var msg = new SpeechSynthesisUtterance();
        msg.text = picto.speech[this.getUserLang];
        let voice = voices.filter((voice) => voice.voiceURI == this.voiceURI);
        if (voice.length == 0) {
          voice = voices.filter((voice) =>
            voice.lang.includes(this.getUserLang)
          );
        }
        if (voice?.length !== 0) {
          msg.voice = voice[0];
        }
        window.speechSynthesis.speak(msg);
      } else {
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("NoVoicesFound"),
          position: "is-top-right",
          type: "is-warning",
          hasIcon: true,
        });
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
        this.$store.dispatch(
          this.picto.collection ? "editCollection" : "editPicto",
          {
            ...this.picto,
            starred: !this.picto.starred,
          }
        );
      } catch (error) {
        console.log(error);
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("SomeThingBadHappened"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
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
    getDeviceInfo() {
      return (
        this.getOSInfo() +
        window.screen.height +
        window.screen.width +
        window.devicePixelRatio
      );
    },
    getOSInfo() {
      if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
        return "Windows 10";
      if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1)
        return "Windows 8.1";
      if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
        return "Windows 8";
      if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
        return "Windows 7";
      if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
        return "Windows Vista";
      if (window.navigator.userAgent.indexOf("Mac") != -1) return "Mac/iOS";
      if (window.navigator.userAgent.indexOf("X11") != -1) return "UNIX";
      if (window.navigator.userAgent.indexOf("Linux") != -1) return "Linux";
    },
  },
  computed: {
    getUserLang() {
      const user = this.$store.getters.getUser;
      if (user?.language) {
        return Object.keys(user.language)[0].replace(/[^a-z]/g, "");
      }
      if (user?.displayLanguage) {
        return user.displayLanguage;
      }
      return window.navigator.language.replace(/[^a-z]/g, "");
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
  created() {
    const allVoicesObtained = new Promise(function (resolve, reject) {
      try {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length !== 0) {
          resolve(voices);
        } else {
          window.speechSynthesis.addEventListener("voiceschanged", function () {
            try {
              voices = window.speechSynthesis.getVoices();
            } catch (err) {
              reject(err);
            }
            if (!voices) {
              reject();
            }
            resolve(voices);
          });
        }
      } catch (err) {
        reject(err);
      }
    });
    allVoicesObtained.then((voices) => {
      this.voices = voices;
      this.voiceURI =
        this.$store.getters.getUser.language[
          Object.keys(this.$store.getters.getUser.language)[0]
        ][this.getDeviceInfo()]?.voiceURI;
      // Si vide alors remplir avec la premiere valeur equiv a lang
      if (!this.voiceURI) {
        this.voiceURI = this.voices.filter(
          (voice) =>
            voice.lang == Object.keys(this.$store.getters.getUser.language)[0]
        )[0]?.voiceURI;
      }
    });
  },
};
</script>
<style scoped>
.has-background {
  border-radius: 7px;
  -webkit-box-shadow: 4px 4px 2px 2px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 4px 4px 2px 2px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 4px 4px 2px 2px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
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
  margin: 0 auto;
  font-size: 1rem;
}
.notification {
  padding: 0.6rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
}
</style>
