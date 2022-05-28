<template>
  <div>
    <div class="container is-widescreen">
      <pictoList :publicMode="true" :pictos="loadedPictos" :sidebar="false" />
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
    loadedPictos() {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) =>
          collection.id === parseInt(this.$route.params.fatherCollectionId, 10)
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
          let rankedPictos = [];
          collectionList.concat(pictos).forEach((picto) => {
            if (picto && picto.starred == true) {
              rankedPictos.unshift(picto);
            } else {
              rankedPictos.push(picto);
            }
          });
          return rankedPictos;
        } else {
          return [];
        }
      }
      return [];
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
    const collection = this.getCollectionFromId(
      parseInt(this.$route.params.fatherCollectionId, 10)
    );
    // TODO Traiter differement !collection et !collection.pictos || !collection.collections
    if (
      !collection ||
      !collection.pictos ||
      collection.pictos.length == 0 ||
      !collection.collections ||
      collection.collections.length == 0
    ) {
      try {
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
        } else {
          var res = await axios.get(
            "/collection/find/" + this.$route.params.fatherCollectionId
          );
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
        }
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
            if (!this.getCollectionFromId(picto.id)) {
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
    };
  },
  methods: {
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
  bottom: 3%;
  width: 98%;
  max-height: 20%;
  position: fixed;
}
.filler {
  padding-bottom: 20%;
}
.contenant {
  display: flex;
  justify-content: center;
}
</style>
