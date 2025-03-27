<template>
  <div>
    <div class="columns is-mobile noscroll">
      <div :class="!($route.query.fatherCollectionId == $store.getters.getSidebarId) && isSidebarUsed
        ? 'is-8-mobile is-9-tablet is-10-desktop is-10-widescreen is-10-fullhd column noMargins scrolling lessPadding'
        : 'is-12 column noMargins scrolling lessPadding'
        ">
        <div v-if="pictos.length == 0 && !isPictoListPartial">
          <b-image style="aspect-ratio: 1/1" class="emptyCollection1" lazy
            alt="an arrow and a lock pointing to the lock button on the upper part of the screen that allows the creation of pictograms"
            :srcset="require('@/assets/EmptyCollection1.png').srcSet" />
          <br />
          <b-message class="emptyMessage">
            {{ $t("EmptyCollection") }}
          </b-message>

          <b-image data-cy="cypress-emptyCollection" style="aspect-ratio: 1/1" class="emptyCollection2" lazy
            alt="An empty cardboard box that represents an empty collection with no pictograms"
            :srcset="require('@/assets/EmptyCollection3.png').srcSet" />
        </div>

        <pictoList data-cy="cypress-pictoList" :pictos="pictos" :sidebar="false" :sidebarUsed="isSidebarUsed && $route.query.fatherCollectionId != $store.getters.getSidebarId
          " v-if="!isPictoListPartial || isOnLine || !isPictoListEmpty" />
        <div v-else>
          <b-image data-cy="cypress-noConnection" style="aspect-ratio: 1/1" class="partialCollection" lazy
            alt="No internet connection. To view the collection, please reconnect"
            :srcset="require('@/assets/NoConnectionForCollection.png').srcSet" />
          <b-message>
            {{ $t("CollectionNotExplored") }}
          </b-message>
        </div>
      </div>

      <div v-if="!($route.query.fatherCollectionId == $store.getters.getSidebarId) && isSidebarUsed" class="
          is-4-mobile
          is-3-tablet
          is-2-desktop
          is-2-widescreen
          is-2-fullhd
          column
          noMargins
          scrolling
          sidebar
          lessPadding
        ">
        <b-image style="aspect-ratio: 1/1" v-if="sidebarPictos.length == 0" class="emptyCollection2" lazy
          alt="An empty cardboard box that represents an empty collection with no pictograms"
          :srcset="require('@/assets/EmptyCollection3.png').srcSet" />
        <pictoList :pictos="sidebarPictos" :sidebar="true" />
      </div>
    </div>
    <div class="contenant">
      <pictoBar :style="loadSpeech.length != 0
        ? 'bottom: 2px'
        : 'transform: translateY(105%);'
        " class="pictobar sidebar slide-up" :pictos="loadSpeech" :collectionColor="collectionColor" />
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
  nuxtI18n: false,
  layout: "pictalk",
  mixins: [lang],
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar,
    sidebar: sidebar,
  },
  watch: {
    async fatherCollectionId(fatherCollectionId, previousId) {
      if (fatherCollectionId && fatherCollectionId != previousId) {
        await this.fetchCollection(fatherCollectionId);
        this.pictos = await this.loadedPictos();
      }
    },
    async sidebarPictoId(sidebarId, previousId) {
      if (sidebarId && sidebarId != previousId) {
        await this.fetchCollection(sidebarId);
        this.sidebarPictos = await this.loadedSidebarPictos();
      }
    },
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
          this.sidebarPictos = await this.loadedSidebarPictos();
        }, delay);
      } else {
        this.pictos = await this.loadedPictos();
        this.sidebarPictos = await this.loadedSidebarPictos();
      }
    });
  },
  destroyed() {
    window.removeEventListener("online", this.refreshPictos);
    window.removeEventListener("offline", this.lostConnectivityNotification);
    this.$nuxt.$off("resyncPictoList");
  },
  computed: {
    isSidebarUsed() {
      return this.sidebarPictos.length != 0;
    },
    homeLink() {
      return this.$route.path;
    },
    isOnLine() {
      return window.navigator.onLine;
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
      if (this.$store.getters.getUser.settings?.newNavigation != undefined && this.$store.getters.getUser.settings.newNavigation === true) {
        return this.$store.getters.getSpeech.filter(
          (picto) => picto.speech[this.getUserLang] && picto.speech[this.getUserLang] != "" && picto.image
        );
      } else {
        return this.$store.getters.getSpeech;
      }
    },
    sidebarPictoId() {
      return this.$store.getters.getSidebarId;
    },
    fatherCollectionId() {
      return this.$route.query.fatherCollectionId;
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
    let query = { ...this.$route.query };
    if (
      !this.$route.query.fatherCollectionId
    ) {
      if (!this.$route.query.fatherCollectionId) {
        if (this.$store.getters.getRootId) {
          query.fatherCollectionId = this.$store.getters.getRootId;
        } else {
          var res = await axios.get("/user/root/");
          this.$store.commit("setRootId", res.data.id);
          path = "/pictalk/" + res.data.id;
        }
      }
      if (!this.$store.getters.getSidebarId) {
        var res = await axios.get("/user/sider/");
        this.$store.commit("setSidebarId", res.data.id);
      }
      this.$router.push({
        query: query,
      });
    }
  },
  async fetch() {
    this.initialization = true;
    if (this.$route.query.fatherCollectionId) {
      await this.fetchCollection(
        parseInt(this.$route.query.fatherCollectionId, 10)
      );
      this.pictos = await this.loadedPictos();
    }

    if (this.$store.getters.getSidebarId) {
      await this.fetchCollection(
        parseInt(this.$store.getters.getSidebarId, 10)
      );
      this.sidebarPictos = await this.loadedSidebarPictos();
    }

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
      priority_timer: 0,
      isPicto: true,
      sidebarExpanded: false,
      sidebarPictos: [],
      pictos: [],
      initialization: true,
    };
  },
  methods: {
    async dispatchDownloadCollections() {
      await this.$store.dispatch("downloadCollections");
    },
    async loadedSidebarPictos() {
      return this.loadPictos(this.$store.getters.getSidebarId);
    },
    async loadedPictos() {
      return this.loadPictos(
        parseInt(this.$route.query.fatherCollectionId, 10)
      );
    },
    async loadPictos(fatherCollectionId) {
      const collectionList = await this.$store.dispatch("getCollectionsFromFatherCollectionId", fatherCollectionId);
      const pictos = await this.$store.dispatch("getPictosFromFatherCollectionId", fatherCollectionId);
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
      return this.$store.dispatch("getCollectionFromId", id);
    },
    async getPictoFromId(id) {
      return this.$store.dispatch("getPictoFromId", id);
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
      try {
        const collection = await this.$store.dispatch("fetchCollection", collectionId);
        return collection;
      } catch (error) {
        console.log("error ", error);
      }
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
  max-height: 30%;
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
  /* -webkit-box-shadow: -2px 2px 8px 1px #777;
  -moz-box-shadow: -2px 2px 8px 1px #777;
  -webkit-box-shadow: -2px 2px 8px 1px #777;
  -moz-box-shadow: -2px 2px 8px 1px #777;
  box-shadow: -2px 2px 8px 1px #777; */
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
  -webkit-box-shadow: 2px 2px 1px 1px #ccc;
  -moz-box-shadow: 2px 2px 1px 1px #ccc;
  box-shadow: 2px 2px 1px 1px #ccc;
  /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
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
