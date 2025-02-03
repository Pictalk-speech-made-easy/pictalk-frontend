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
    async setShortcutCollectionIdDirectlyToRoot(item, isPicto) {
      let collection = JSON.parse(
        JSON.stringify(await this.getCollectionFromId(this.$store.getters.getRootId))
      );
      if (isPicto) {
        collection.pictos.push(item);
        try {
          await this.$store.dispatch("editCollectionV2", {
            collection: { id: collection.id },
            collectionsAdded: [],
            pictosAdded: [item.id],
            collectionsRemoved: [],
            pictosRemoved: [],
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
        collection.collections.push(item);
        try {
          await this.$store.dispatch("editCollectionV2",
            {
              collection: { id: collection.id },
              collectionsAdded: [item.id],
              pictosAdded: [],
              collectionsRemoved: [],
              pictosRemoved: [],
            },
          );
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
      // emit event to resync picto list
      $nuxt.$emit("resyncPictoList");
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
    sidebarClick() {
      if (this.picto.collection == true) {
        this.$router.push({
          query: { ...this.$route.query, fatherCollectionId: this.picto.id },
        });
      } else {
        this.addToSpeech();
      }
    },
    async addToSpeech() {
      this.$store.commit("addSpeech", {
        ...this.picto,
        sidebar: false,
      });
      if (this.picto.collection == true) {
        this.$router.push({
          query: { ...this.$route.query, fatherCollectionId: this.picto.id },
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

        let sidebar = await this.getCollectionFromId(parseInt(sidebarId, 10));

        let currentCollection = await this.getCollectionFromId(parseInt(this.$route.query.fatherCollectionId, 10))
        if (isPicto) {
          await this.$store.dispatch("editCollectionV2",
            {
              collection: { id: sidebar.id },
              collectionsAdded: [],
              pictosAdded: [collectionId],
              collectionsRemoved: [],
              pictosRemoved: [],
            },
          );
          await this.$store.dispatch("removePicto", {
            pictoId: collectionId,
            fatherCollectionId: currentCollection.id
          });
        } else {
          currentCollection.collections = currentCollection.collections.filter((picto) => picto.id != collectionId);
          await this.$store.dispatch("editCollectionV2",
            {
              collection: { id: sidebar.id },
              collectionsAdded: [collectionId],
              pictosAdded: [],
              collectionsRemoved: [],
              pictosRemoved: [],
            });
          await this.$store.dispatch("removeCollection", {
            collectionId: collectionId,
            fatherCollectionId: currentCollection.id,
          });
        }
        $nuxt.$emit("resyncPictoList");
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
        const sidebarId = this.$store.getters.getSidebarId;

        let sidebar = JSON.parse(
          JSON.stringify(
            await this.getCollectionFromId(
              parseInt(sidebarId, 10)
            )
          )
        );
        let currentCollection = JSON.parse(
          JSON.stringify(
            await this.getCollectionFromId(
              parseInt(this.$route.query.fatherCollectionId, 10)
            )
          )
        );
        if (!isPicto) {
          await this.$store.dispatch("editCollectionV2",
            {
              collection: { id: currentCollection.id },
              collectionsAdded: [collectionId],
              pictosAdded: [],
              collectionsRemoved: [],
              pictosRemoved: [],
            }
          );
          await this.$store.dispatch("removeCollection", {
            collectionId: collectionId,
            fatherCollectionId: this.$store.getters.getSidebarId,
          });

        } else {
          await this.$store.dispatch("editCollectionV2",
            {
              collection: { id: currentCollection.id },
              collectionsAdded: [],
              pictosAdded: [collectionId],
              collectionsRemoved: [],
              pictosRemoved: [],
            }
          );
          await this.$store.dispatch("removePicto", {
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
    async getCollectionFromId(id) {
      return this.$store.dispatch("getCollectionFromId", id);
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
    async canDelete() {
      return (await this.getCollectionFromId(parseInt(this.$route.query.fatherCollectionId, 10)))?.userId == this.$store.getters.getUser.id;
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
