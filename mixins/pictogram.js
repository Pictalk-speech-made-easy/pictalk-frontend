import deleteItem from "@/components/pictos/deleteItem";
import PictoSteps from "@/components/pictos/pictoSteps";
import shareItem from "@/components/pictos/shareItem";
export default {
  data() {
    return {
      publishLoad: false,
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
        sidebar: false,
      });
      if (this.picto.collection == true) {
        this.$router.push({
          path: this.pictoLink,
          query: { ...this.$route.query },
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
    async pushShortcutToSidebar(collectionId, isPicto) {
      try {
        const sidebarId = this.$store.getters.getSidebarId;

        let sidebar = JSON.parse(
          JSON.stringify(
            this.getCollectionFromId(
              parseInt(sidebarId, 10)
            )
          )
        );
        if (isPicto) {
          sidebar.pictos.push({
            id: collectionId,
          });

          await this.$store.dispatch("editCollection", {
            id: sidebar.id,
            pictos: sidebar.pictos,
          });
          $nuxt.$emit("resyncPictoList");
        } else {
          sidebar.collections.push({
            id: collectionId,
          });
          await this.$store.dispatch("editCollection", {
            id: sidebar.id,
            collections: sidebar.collections,
          });
          $nuxt.$emit("resyncPictoList");
        }
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
    },
    async removeShortcutToSidebar(collectionId, isPicto) {
      try {
        if (!isPicto) {
          const res = await this.$store.dispatch("removeCollection", {
            collectionId: collectionId,
            fatherCollectionId: this.$store.getters.getSidebarId,
          });
        } else {
          const res = await this.$store.dispatch("removePicto", {
            pictoId: collectionId,
            fatherCollectionId: this.$store.getters.getSidebarId
          });
        }
        $nuxt.$emit("resyncPictoList");
      } catch (err) {
        console.log(err);
        this.$buefy.toast.open({
          message: this.$t("CouldNotRemove"),
          position: "is-top",
          type: "is-danger",
        });
      }
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
    getCollectionFromId(id) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === id
      );
      return this.$store.getters.getCollections[index];
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
    canDelete() {
      return this.getCollectionFromId(parseInt(this.$route.params.fatherCollectionId, 10))?.userId == this.$store.getters.getUser.id;
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
    isOnline() {
      return window.navigator.onLine;
    }
  },
}
