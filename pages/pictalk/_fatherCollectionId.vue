<template>
  <div>
    <div
      class="columns is-mobile noscroll"
      :style="`max-height : ${fitScreen}px; width: 100vw`"
    >
      <div
        :class="
          !($route.params.fatherCollectionId == $store.getters.getSidebarId)
            ? 'is-8-mobile is-8-tablet column noMargins scrolling'
            : 'is-12 column noMargins scrolling'
        "
      >
        <pictoList :pictos="loadedPictos" :sidebar="false" />
      </div>
      <div
        v-if="
          !($route.params.fatherCollectionId == $store.getters.getSidebarId)
        "
        class="is-4-mobile is-4-tablet column noMargins scrolling sidebar"
      >
        <pictoList :pictos="loadedSidebarPictos" :sidebar="true" />
      </div>
    </div>
    <div class="contenant">
      <pictoBar
        v-if="loadSpeech.length != 0"
        class="pictobar sidebar"
        :pictos="loadSpeech"
        :collectionColor="collectionColor"
      />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import sidebar from "@/components/pictos/sidebar";
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
  layout: "pictalk",
  middleware: ["check-auth", "auth", "axios"],
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar,
    sidebar: sidebar,
  },
  watch: {
    async sidebarPictoId(sidebarId) {
      if (sidebarId) {
        await this.fetchCollection(sidebarId);
      }
    },
  },
  created() {
    window.addEventListener("online", this.refreshPictos);
    window.addEventListener("offline", this.lostConnectivityNotification);
  },
  destroyed() {
    window.removeEventListener("online", this.refreshPictos);
    window.removeEventListener("offline", this.lostConnectivityNotification);
  },
  computed: {
    fitScreen() {
      return window.innerHeight - 64;
    },
    fitWidth() {
      return window.innerWidth;
    },
    displaySidebar() {
      return (
        parseInt(this.$route.params.fatherCollectionId, 10) !=
        this.$store.getters.getSidebarId
      );
    },
    loadSpeech() {
      return this.$store.getters.getSpeech;
    },
    isAdmin() {
      if (this.$route.query.isAdmin) {
        return true;
      } else {
        return false;
      }
    },
    loadedPictos() {
      return this.loadPictos(
        parseInt(this.$route.params.fatherCollectionId, 10)
      );
    },
    loadedSidebarPictos() {
      if (this.$route.query.sidebarPictoId) {
        return this.loadPictos(parseInt(this.$route.query.sidebarPictoId, 10));
      } else {
        return this.loadPictos(this.$store.getters.getSidebarId);
      }
    },
    sidebarPictoId() {
      if (this.$route.query.sidebarPictoId) {
        return this.$route.query.sidebarPictoId;
      } else {
        return this.$store.getters.getSidebarId;
      }
    },
    collectionColor() {
      const collection = this.getCollectionFromId(
        parseInt(this.$route.params.fatherCollectionId, 10)
      );
      if (collection) {
        if (collection.color) {
          return collection.color;
        } else {
          return "#f5f5f5";
        }
      } else {
        return "#f5f5f5";
      }
    },
  },
  async mounted() {
    if (!this.$route.params.fatherCollectionId) {
      if (this.$store.getters.getRootId) {
        this.$router.push({
          path: "/pictalk/" + this.$store.getters.getRootId,
          query: { ...this.$route.query },
        });
        return;
      } else {
        var res = await axios.get("/user/root/");
        this.$store.commit("setRootId", res.data.id);
        this.$router.push(this.$route.path + "/" + res.data.id);
      }
    }
    if (!this.$route.query.sidebarPictoId) {
      if (this.$store.getters.getSidebarId) {
        this.$router.push({
          query: {
            ...this.$route.query,
            sidebarPictoId: this.$store.getters.getSidebarId,
          },
        });
        return;
      } else {
        //TODO creer endpoint pour get sidebarid
        /* var res = await axios.get("/user/root/");
				this.$store.commit("setRootId", res.data.id);
				this.$router.push(this.$route.path + "/" + res.data.id); */
      }
    }
  },
  async fetch() {
    if (!this.$route.params.fatherCollectionId) {
      return;
    }
    // TODO Traiter differement !collection et !collection.pictos || !collection.collections
    await this.fetchCollection(
      parseInt(this.$route.params.fatherCollectionId, 10)
    );
    const user = this.$store.getters.getUser;
    if (!user.username) {
      try {
        await this.$store.dispatch("getUser");
      } catch (error) {
        console.log("error ", error);
      }
    }
  },
  data() {
    return {
      isPicto: true,
      sidebarExpanded: false,
    };
  },
  methods: {
    loadPictos(fatherCollectionId) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === fatherCollectionId
      );
      const collection = this.$store.getters.getCollections[index];
      if (collection) {
        const collectionList = collection.collections.map((col) => {
          return this.getCollectionFromId(col.id);
        });
        const pictos = collection.pictos.map((pict) => {
          return this.getPictoFromId(pict.id);
        });
        if (pictos && collectionList) {
          let sortedItems = [];
          let starredItems = [];
          let unstarredItems = [];
          sortedItems = this.sorting(collectionList, pictos);
          for (let item of sortedItems) {
            if (item.starred) {
              starredItems.push(item);
            } else {
              unstarredItems.push(item);
            }
          }
          return starredItems.concat(unstarredItems);
        } else {
          console.log("No ranked pictos");
          return [];
        }
      }
      return [];
    },
    sorting(collections, pictos) {
      let unsortedItems = collections.concat(pictos);
      let sortedItems = unsortedItems.sort(function (itemA, itemB) {
        return new Date(itemB.createdDate) - new Date(itemA.createdDate);
      });
      return sortedItems;
    },
    removeSpeech() {
      this.$store.commit("removeSpeech");
    },
    getCollectionFromId(id) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === id
      );
      return this.$store.getters.getCollections[index];
    },
    getPictoFromId(id) {
      const index = this.$store.getters.getPictos.findIndex(
        (picto) => picto.id === id
      );
      return this.$store.getters.getPictos[index];
    },
    lostConnectivityNotification() {
      const notif = this.$buefy.notification.open({
        duration: 5000,
        message: this.$t("LostConnectivity"),
        position: "is-top-right",
        type: "is-danger",
        hasIcon: true,
        icon: "airplane",
      });
    },
    async fetchCollection(collectionId) {
      const collection = this.getCollectionFromId(collectionId);
      // TODO Traiter differement !collection et !collection.pictos || !collection.collections
      if (
        (!collection ||
          !collection.pictos ||
          !collection.collections ||
          collection?.partial) &&
        navigator.onLine
      ) {
        try {
          var res = await axios.get("/collection/find/" + collectionId);
          if (res.data.image) {
            res.data.image =
              this.$config.apiURL + "/image/pictalk/" + res.data.image;
          }
          if (res.data.meaning) {
            res.data.meaning = JSON.parse(res.data.meaning);
          }
          if (res.data.speech) {
            res.data.speech = JSON.parse(res.data.speech);
          }
          res.data.collection = true;
          res.data.partial = false;

          if (res.data.collections && !res.data.collections.length == 0) {
            res.data.collections.map((collection) => {
              if (collection.image) {
                collection.image =
                  this.$config.apiURL + "/image/pictalk/" + collection.image;
              }
              if (collection.meaning) {
                collection.meaning = JSON.parse(collection.meaning);
              }
              if (collection.speech) {
                collection.speech = JSON.parse(collection.speech);
              }
              collection.collection = true;
              collection.fatherCollectionId = res.data.id;
              if (!collection.pictos) {
                collection.pictos = [];
              }
              if (!collection.collections) {
                collection.collections = [];
              }
              collection.partial = true;
              // collectionIndex
              if (!this.getCollectionFromId(collection.id)) {
                this.$store.commit("addCollection", collection);
              } else {
                this.$store.commit("editCollection", collection);
              }
            });
          }
          if (res.data.pictos && !res.data.pictos.length == 0) {
            res.data.pictos.map((picto) => {
              if (picto.image) {
                picto.image =
                  this.$config.apiURL + "/image/pictalk/" + picto.image;
              }
              if (picto.meaning) {
                picto.meaning = JSON.parse(picto.meaning);
              }
              if (picto.speech) {
                picto.speech = JSON.parse(picto.speech);
              }
              picto.fatherCollectionId = res.data.id;
              if (!this.getPictoFromId(picto.id)) {
                this.$store.commit("addPicto", picto);
              } else {
                this.$store.commit("editPicto", picto);
              }
            });
          }

          if (!this.getCollectionFromId(res.data.id)) {
            this.$store.commit(
              "addCollection",
              JSON.parse(JSON.stringify(res.data))
            );
          } else {
            await this.$store.commit(
              "editCollection",
              JSON.parse(JSON.stringify(res.data))
            );
          }
        } catch (error) {
          console.log("error ", error);
        }
      }
    },
    async refreshPictos() {
      try {
        await this.$store.dispatch("downloadCollections");
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("PictosFetched"),
          position: "is-top-right",
          type: "is-success",
          hasIcon: true,
          icon: "refresh",
        });
      } catch (err) {
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("ServerOffline"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          icon: "danger",
        });
      }
    },
  },
};
</script>
<style scoped>
.pictobar {
  bottom: 2px;
  margin: 0 auto;
  width: 99vw;
  max-height: 20%;
  position: fixed;
}
.contenant {
  display: flex;
  justify-content: center;
  align-items: center;
}
.smallPadding {
  padding: 1px;
}
.noMargins {
  margin: 0%;
}
.sidebar {
  -webkit-box-shadow: -2px 2px 8px 1px #777; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: -2px 2px 8px 1px #777; /* Firefox 3.5 - 3.6 */
  box-shadow: -2px 2px 8px 1px #777;
}
.scrolling {
  overflow-y: scroll;
  overflow-x: hidden;
}
/* width */
::-webkit-scrollbar {
  width: 0.25rem;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: #ffffff00;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #fe5555;
  border-radius: 10px;
}
.noscroll {
  padding-right: 0vw;
  padding-left: 0vw;
  margin: 0%;
}
.has-background {
  border-radius: 7px;
  -webkit-box-shadow: 2px 2px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 2px 2px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 2px 2px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
</style>
