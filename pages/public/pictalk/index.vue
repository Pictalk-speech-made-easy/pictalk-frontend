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
  async fetch() {
    if (this.$route.query.fatherCollectionId) {
      await this.fetchCollection(
        parseInt(this.$route.query.fatherCollectionId, 10)
      );
    }
    this.pictos = await this.loadedPictos();
  },
  data() {
    return {
      isPicto: true,
      pictos: [],
    };
  },
  methods: {
    sorting(items) {
      let sortedItems = items.sort(function (itemA, itemB) {
        return new Date(itemA.createdDate) - new Date(itemB.createdDate);
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
      return collection;
    },
    loadedPictos() {
      return this.loadPictos(
        parseInt(this.$route.query.fatherCollectionId, 10)
      );
    },
    async loadPictos(fatherCollectionId) {
      const collectionList = this.$store.getters.getCollectionsFromFatherCollectionId(fatherCollectionId);
      const pictos = this.$store.getters.getPictosFromFatherCollectionId(fatherCollectionId);
      let items = await Promise.all([collectionList, pictos]);
      items = items[0].concat(items[1]) // Merge both arrays
      console.log(items)
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
    removeSpeech() {
      this.$store.commit("removeSpeech");
    },
    async getCollectionFromId(id) {
      return this.$store.getters.getCollectionFromId(id);
    },
    async getPictoFromId(id) {
      return this.$store.getters.getPictoFromId(id);
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
  z-index: 4;
}
.filler {
  padding-bottom: 20%;
}
.contenant {
  display: flex;
  justify-content: center;
}
</style>
