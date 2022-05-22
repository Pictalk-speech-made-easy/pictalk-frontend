<template>
  <div>
    <div class="columns is-mobile noscroll">
      <div
        :class="
          !($route.params.fatherCollectionId == $store.getters.getSidebarId) &&
          isSidebarUsed
            ? 'is-8-mobile is-three-fifths-tablet is-8-desktop is-three-fifths-widescreen is-7-fullhd column noMargins scrolling lessPadding'
            : 'is-12 column noMargins scrolling lessPadding'
        "
      >
        <div v-if="pictos.length == 0 && !isPictoListPartial">
          <b-image
            class="emptyCollection1"
            lazy
            alt="an arrow and a lock pointing to the lock button on the upper part of the screen that allows the creation of pictograms"
            :srcset="require('@/assets/EmptyCollection1.png').srcSet"
          />
          <br />
          <b-message class="emptyMessage">
            {{ $t("EmptyCollection") }}
          </b-message>

          <b-image
            class="emptyCollection2"
            lazy
            alt="An empty cardboard box that represents an empty collection with no pictograms"
            :srcset="require('@/assets/EmptyCollection3.png').srcSet"
          />
        </div>

        <pictoList
          :pictos="pictos"
          :sidebar="false"
          :sidebarUsed="isSidebarUsed"
          v-if="!isPictoListPartial || isOnLine"
        />
        <div v-else>
          <b-image
            class="partialCollection"
            lazy
            alt="No internet connection. To view the collection, please reconnect"
            :srcset="require('@/assets/NoConnectionForCollection.png').srcSet"
          />
          <b-message>
            {{ $t("CollectionNotExplored") }}
          </b-message>
        </div>
      </div>

      <div
        v-if="
          !($route.params.fatherCollectionId == $store.getters.getSidebarId) &&
          isSidebarUsed
        "
        class="
          is-4-mobile
          is-two-fifths-tablet
          is-4-desktop
          is-two-fifths-widescreen
          is-5-fullhd
          column
          noMargins
          scrolling
          sidebar
          lessPadding
        "
      >
        <b-button
          v-if="$route.query.sidebarPictoId != $store.getters.getSidebarId"
          @click="toSidebarHome"
          class="onTop"
          type="is-primary"
          icon-left="undo"
        />
        <b-image
          v-if="sidebarPictos.length == 0 && !isSidebarPartial"
          class="emptyCollection2"
          lazy
          alt="Collection is empty. Create pictos"
          :srcset="require('@/assets/EmptyCollection3.png').srcSet"
        />
        <div
          v-if="$route.query.sidebarPictoId != $store.getters.getSidebarId"
        ></div>
        <pictoList
          :pictos="sidebarPictos"
          :sidebar="true"
          v-if="!isSidebarPartial || isOnLine"
        />
        <div v-else>
          <b-image
            class="partialCollection"
            lazy
            alt="No internet collection. To view the collection, please reconnect"
            :srcset="require('@/assets/NoConnectionForCollection.png').srcSet"
          />
          <b-message>
            {{ $t("CollectionNotExplored") }}
          </b-message>
        </div>
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
import lang from "@/mixins/lang";
export default {
  layout: "pictalk",
  mixins: [lang],
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar,
    sidebar: sidebar,
  },
  watch: {
    async sidebarPictoId(sidebarId, previousId) {
      if (sidebarId && sidebarId != previousId) {
        await this.fetchCollection(sidebarId);
        this.sidebarPictos = this.loadedSidebarPictos();
      }
    },
  },
  created() {
    window.addEventListener("online", this.refreshPictos);
    window.addEventListener("offline", this.lostConnectivityNotification);
    this.$nuxt.$on("resyncPictoList", () => {
      this.pictos = this.loadedPictos();
    });
  },
  destroyed() {
    window.removeEventListener("online", this.refreshPictos);
    window.removeEventListener("offline", this.lostConnectivityNotification);
  },
  computed: {
    isOnLine() {
      return window.navigator.onLine;
    },
    isSidebarUsed() {
      return this.loadPictos(this.$store.getters.getSidebarId).length != 0;
    },
    isSidebarPartial() {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) =>
          collection.id === parseInt(this.$route.query.sidebarPictoId, 10)
      );
      return this.$store.getters.getCollections[index]?.partial;
    },
    isPictoListPartial() {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) =>
          collection.id === parseInt(this.$route.params.fatherCollectionId, 10)
      );
      return this.$store.getters.getCollections[index]?.partial;
    },
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
    let path;
    let query = { ...this.$route.query };
    if (
      !this.$route.params.fatherCollectionId ||
      !this.$route.query.sidebarPictoId
    ) {
      if (!this.$route.params.fatherCollectionId) {
        if (this.$store.getters.getRootId) {
          path = "/pictalk/" + this.$store.getters.getRootId;
        } else {
          var res = await axios.get("/user/root/");
          this.$store.commit("setRootId", res.data.id);
          path = "/pictalk/" + res.data.id;
        }
      }
      if (!this.$route.query.sidebarPictoId) {
        if (this.$store.getters.getSidebarId) {
          query = {
            ...this.$route.query,
            sidebarPictoId: this.$store.getters.getSidebarId,
          };
        } else {
          var res = await axios.get("/user/sider/");
          this.$store.commit("setSidebarId", res.data.id);
          query = { ...this.$route.query, sidebarPictoId: res.data.id };
        }
      }
      this.$router.push({
        path: path,
        query: query,
      });
    }
    //this.pictos = this.loadedPictos();
    //this.sidebarPictos = this.loadedSidebarPictos();
  },
  async fetch() {
    if (this.$route.params.fatherCollectionId) {
      await this.fetchCollection(
        parseInt(this.$route.params.fatherCollectionId, 10)
      );
    }
    this.pictos = this.loadedPictos();

    if (this.$route.query.sidebarPictoId) {
      await this.fetchCollection(
        parseInt(this.$route.query.sidebarPictoId, 10)
      );
    }
    this.sidebarPictos = this.loadedSidebarPictos();

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
      sidebarPictos: [],
      pictos: [],
    };
  },
  methods: {
    toSidebarHome() {
      this.$router.push({
        query: {
          ...this.$route.query,
          sidebarPictoId: this.$store.getters.getSidebarId,
        },
      });
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
        (collection) => collection.id === parseInt(id)
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
          (!collection.pictos && !collection.collections) ||
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
        //TODO : refresh pictoList so that it displays new pictos and maybe count number of eddited and added in notification
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("PictosFetched"),
          position: "is-top-right",
          type: "is-success",
          hasIcon: true,
          icon: "refresh",
        });
      } catch (err) {
        console.log(err);
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
  max-width: 767px;
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
.lessPadding {
  padding: 0.45rem;
  padding-top: 0.7rem;
  padding-left: 0.5rem;
}

.sidebar {
  padding-top: 2px;
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
  width: 0.9vw;
  max-width: 10px;
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
  /* Firefox */
  height: -moz-calc(100vh - 64px);
  /* WebKit */
  height: -webkit-calc(100vh - 64px);
  /* Opera */
  height: -o-calc(100vh - 64px);
  /* Standard */
  height: calc(100vh - 64px);
  width: 100vw;
}
.has-background {
  border-radius: 7px;
  -webkit-box-shadow: 2px 2px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 2px 2px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 2px 2px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.partialCollection {
  width: 90%;
  max-width: 300px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15vh;
}
.emptyCollection1 {
  width: 50%;
  max-width: 250px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
.emptyCollection2 {
  width: 80%;
  max-width: 400px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
.onTop {
  -webkit-position: sticky;
  -moz-position: sticky;
  position: sticky;
  z-index: 1;
  top: 0;
  width: 100%;
  max-width: 250px;
  margin-bottom: 0.8rem;
  border: solid;
  border-color: #4c4329;
  border-width: 1px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
}
.emptyMessage {
  padding: 0.2rem;
  width: auto;
  max-width: 600px;
  margin-bottom: 1rem;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
</style>
