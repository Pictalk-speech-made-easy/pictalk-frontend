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
        <div v-if="pictos.length == 0 && !isPictoListPartial && !initialization">
          <b-image
            style="aspect-ratio: 1/1"
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
            data-cy="cypress-emptyCollection"
            style="aspect-ratio: 1/1"
            class="emptyCollection2"
            lazy
            alt="An empty cardboard box that represents an empty collection with no pictograms"
            :srcset="require('@/assets/EmptyCollection3.png').srcSet"
          />
        </div>
        <pictoList
          id="pictoList-main"
          data-cy="cypress-pictoList"
          :pictos="pictos"
          :sidebar="false"
          :sidebarUsed="
            isSidebarUsed &&
            $route.params.fatherCollectionId != $store.getters.getSidebarId
          "
          v-if="!isPictoListPartial || isOnLine || !isPictoListEmpty"
        />
        <div v-else>
          <b-image
            data-cy="cypress-noConnection"
            style="aspect-ratio: 1/1"
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
        <pictoList
          :pictos="sidebarPictos"
          :sidebar="true"
          v-if="!isSidebarPartial || isOnLine || !isSidebarEmpty"
        />
      </div>
    </div>
    <div class="contenant">
      <pictoBar
        :style="
          loadSpeech.length != 0
            ? 'bottom: 2px'
            : 'transform: translateY(105%);'
        "
        class="pictobar sidebar slide-up"
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
  data: {
    return: {
      priority_timer: 0,
    }
  },
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar,
    sidebar: sidebar,
  },
  created() {
    window.addEventListener("online", this.refreshPictos);
    window.addEventListener("offline", this.lostConnectivityNotification);
    this.$nuxt.$on("resyncPictoList", async (delay) => {
      if (delay) {
        if (this.priority_timer != 0) {
          clearTimeout(this.priority_timer);
          this.priority_timer = 0;
        }
        this.priority_timer = setTimeout(async () => {
          this.pictos = await this.loadedPictos();
        }, delay);
      } else {
        this.pictos = await this.loadedPictos();
      }
    });
  },
  destroyed() {
    window.removeEventListener("online", this.refreshPictos);
    window.removeEventListener("offline", this.lostConnectivityNotification);
    this.$nuxt.$off("resyncPictoList");
  },
  computed: {
    homeLink() {
      return this.$route.path;
    },
    isOnLine() {
      return window.navigator.onLine;
    },
    isSidebarUsed() {
      console.log("isSidebarUsed", this.sidebarPictos.length != 0)
      return this.sidebarPictos.length != 0;
    },
    isSidebarPartial() {
      return this.sidebarPictos?.partial;
    },
    isSidebarEmpty() {
      return (
        this.sidebarPictos?.pictos.length == 0 &&
        this.sidebarPictos?.collections.length == 0
      );
    },
    isPictoListPartial() {
      return this.collection?.partial;
    },
    isPictoListEmpty() {
      return (
        this.collection?.pictos.length == 0 &&
        this.collection?.collections.length == 0
      );
    },
    fitScreen() {
      return window.innerHeight - 64;
    },
    fitWidth() {
      return window.innerWidth;
    },
    loadSpeech() {
      return this.$store.getters.getSpeech;
    },
    collectionColor() {
      if (this.collection) {
        if (this.collection.color) {
          return this.collection.color;
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
      !this.$route.params.fatherCollectionId
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
      this.$router.push({
        path: path,
        query: query,
      });
    }
  },
  async fetch() {
    this.initialization = true;
    if (this.$route.params.fatherCollectionId) {
      await this.fetchCollection(
        parseInt(this.$route.params.fatherCollectionId, 10)
      );
    }

    this.pictos = await this.loadedPictos();
    console.log("this.pictos fetched")
    if (this.$store.getters.getSidebarId ) {
      await this.fetchCollection(this.$store.getters.getSidebarId);
    }
    this.sidebarPictos = await this.loadedSidebarPictos();
    console.log("this.sidebarPictos fetched")
    const user = this.$store.getters.getUser;
    if (!user.username) {
      try {
        await this.$store.dispatch("getUser");
      } catch (error) {
        console.log("error ", error);
      }
    }
    this.initialization = false;
  },
  data() {
    return {
      isPicto: true,
      sidebarExpanded: false,
      sidebarPictos: [],
      pictos: [],
      initialization: true,
    };
  },
  methods: {
    loadedPictos() {
      return this.loadPictos(
        parseInt(this.$route.params.fatherCollectionId, 10)
      );
    },
    loadedSidebarPictos() {
      return this.loadPictos(this.$store.getters.getSidebarId);
    },
    async loadPictos(fatherCollectionId) {
      const collectionList = this.$store.getters.getCollectionsFromFatherCollectionId(fatherCollectionId);
      const pictos = this.$store.getters.getPictosFromFatherCollectionId(fatherCollectionId);
      let items = await Promise.all([collectionList, pictos]);
      items = items[0].concat(items[1]) // Merge both arrays
      if (items) {
        let sortedItems = this.sorting(items);
        sortedItems.map((picto) => {
          if (picto?.starred === true) {
            picto.priority = 1;
          } else if (picto?.starred === false) {
            picto.priority = 10;
          }
        });
        return sortedItems.sort((a, b) => a.priority - b.priority);
      } else {
        return [];
      }
    },
    sorting(items) {
      let sortedItems = items.sort(function (itemA, itemB) {
        return new Date(itemA.createdDate) - new Date(itemB.createdDate);
      });
      return sortedItems;
    },
    removeSpeech() {
      this.$store.commit("removeSpeech");
    },
    async getCollectionFromId(id) {
      return this.$store.getters.getCollectionFromId(id);
    },
    async getPictoFromId(id) {
      return this.$store.getters.getPictoFromId(id);
    },
    lostConnectivityNotification() {
      const notif = this.$buefy.notification.open({
        duration: 4500,
        message: this.$t("LostConnectivity"),
        position: "is-top-right",
        type: "is-danger",
        hasIcon: true,
        iconSize: "is-small",
        icon: "airplane",
      });
      if (this.$route.query.isAdmin) {
        this.$router.push({
          path: this.homeLink,
          query: { ...this.$route.query, isAdmin: undefined },
        });
      }
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
          let pictosToEdit = [];
          let pictosTocreate = [];
          let collectionsToEdit = [];
          let collectionsToCreate = [];
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
                collectionsToCreate.push(collection);
              } else {
                collectionsToEdit.push(collection);
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
                pictosTocreate.push(picto);
              } else {
                pictosToEdit.push(picto);
              }
            });
          }

          if (!this.getCollectionFromId(res.data.id)) {
            collectionsToCreate.push(JSON.parse(JSON.stringify(res.data)));
          } else {
            collectionsToEdit.push(JSON.parse(JSON.stringify(res.data)));
          }
          if (collectionsToCreate.length > 0) {
            this.$store.commit("addCollection", collectionsToCreate);
          }
          if (collectionsToEdit.length > 0) {
            this.$store.commit("editCollection", collectionsToEdit);
          }
          if (pictosTocreate.length > 0) {
            this.$store.commit("addPicto", pictosTocreate);
          }
          if (pictosToEdit.length > 0) {
            this.$store.commit("editPicto", pictosToEdit);
          }
        } catch (error) {
          console.log("error ", error);
        }
      }
      return collection;
    },
    async refreshPictos() {
      try {
        this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("FetchingPictos"),
          position: "is-top-right",
          type: "is-info",
          hasIcon: true,
          iconSize: "is-small",
          icon: "refresh",
        });
        await this.$store.dispatch("downloadCollections");
        this.pictos = await this.loadedPictos();
        this.sidebarPictos = await this.loadedSidebarPictos();
        //TODO : refresh pictoList so that it displays new pictos and maybe count number of eddited and added in notification
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("PictosFetched"),
          position: "is-top-right",
          type: "is-success",
          hasIcon: true,
          iconSize: "is-small",
          icon: "refresh",
        });
      } catch (err) {
        console.log(err);
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("ServerOffline"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "close-octagon",
        });
      }
    },
  },
};
</script>
<style scoped>
.slide-up {
  transition: 200ms cubic-bezier(0.175, 0.885, 0.32, 1.075);
}
.pictobar {
  bottom: 2px;
  margin: 0 auto;
  width: 99vw;
  max-height: 20%;
  position: fixed;
  max-width: 767px;
  z-index: 4;
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
  padding-top: 0.7rem;
  padding-left: 0.45rem;
  padding-right: 0.45rem;
}
@media screen and (min-width: 1408px) {
  .lessPadding {
    padding-top: 0.7rem;
    padding-left: 1rem;
    padding-right: 0.5rem;
  }
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

.noscroll {
  padding-right: 0vw;
  padding-left: 0vw;
  margin: 0%;
  /* Firefox */
  height: -moz-calc(100vh - 54px);
  /* WebKit */
  height: -webkit-calc(100vh - 54px);
  /* Opera */
  height: -o-calc(100vh - 54px);
  /* Standard */
  height: calc(100vh - 54px);
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
