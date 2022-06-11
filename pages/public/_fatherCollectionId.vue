<template>
  <div>
    <div
      class="is-widescreen"
      style="margin-right: 0.5rem; margin-left: 0.5rem"
    >
      <pictoList
        :publicMode="true"
        :pictos="pictos"
        :sidebar="false"
        :sidebarUsed="false"
      />
    </div>
    <div class="contenant">
      <pictoBar
        v-if="loadSpeech.length != 0"
        class="pictobar"
        :publicMode="true"
        :pictos="loadSpeech"
        :collectionColor="collectionColor"
      />
    </div>
    <div class="filler"></div>
  </div>
</template>
<script >
import axios from "axios";
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
  layout: "public",
  middleware: ["axios"],
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar,
  },
  computed: {
    loadSpeech() {
      return this.$store.getters.getSpeech;
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
  async fetch() {
    if (this.$route.params.fatherCollectionId) {
      await this.fetchCollection(
        parseInt(this.$route.params.fatherCollectionId, 10)
      );
    }
    this.pictos = this.loadedPictos();
  },
  data() {
    return {
      isPicto: true,
      pictos: [],
    };
  },
  methods: {
    sorting(collections, pictos) {
      let unsortedItems = collections.concat(pictos);
      let sortedItems = unsortedItems.sort(function (itemA, itemB) {
        return new Date(itemB.createdDate) - new Date(itemA.createdDate);
      });
      return sortedItems;
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
    },
    loadedPictos() {
      return this.loadPictos(
        parseInt(this.$route.params.fatherCollectionId, 10)
      );
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
.filler {
  padding-bottom: 20%;
}
.contenant {
  display: flex;
  justify-content: center;
}
</style>
