<template>
  <div>
    <div class="container is-widescreen">
      <pictoList
        :isPicto="isPicto"
        :pictos="loadedPictos"
        :adminMode="isAdmin"
      />
    </div>
    <div class="contenant">
      <pictoBar
        class="pictobar"
        :pictos="loadSpeech"
        :collectionColor="collectionColor"
      />
    </div>
    <div class="filler"></div>
  </div>
</template>
<script>
import axios from "axios";
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
  layout: "pictalk",
  middleware: ["check-auth", "auth", "axios"],
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar
  },
  computed: {
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
      const view = this.$store.getters.getPictoViews.filter(
        view =>
          view.fatherId === parseInt(this.$route.params.fatherId, 10) &&
          view.collectionId === parseInt(this.$route.params.collectionId, 10)
      );
      if (view.length !== 0) {
        let rankedPictos = [];
        view[0].pictos.forEach(picto => {
          if(picto.starred == true){
            rankedPictos.unshift(picto);
          } else {
            rankedPictos.push(picto);
          }
        });
        return rankedPictos;
      } else {
        return {};
      }
    },
    collectionColor() {
      const collection = this.$store.getters.getCollections.filter(
        collection =>
          collection.id === parseInt(this.$route.params.collectionId, 10)
      );
      if (collection.length !== 0) {
        if (collection[0].color) {
          return collection[0].color;
        } else {
          return "#f5f5f5";
        }
      }
    }
  },
  async asyncData(context) {
    const views = await context.store.getters.getPictoViews;
    let view;
    if (views.length != 0) {
      const fatherPictoIndex = views.findIndex(
        view =>
          view.fatherId === parseInt(context.route.params.fatherId, 10) &&
          view.collectionId === parseInt(context.route.params.collectionId, 10)
      );
      view = views[fatherPictoIndex];
    }
    if (!view || views.length == 0) {
      try {
        var res = await axios.get(
          "/pictalk/picto/" +
            context.route.params.fatherId +
            "/" +
            context.route.params.collectionId
        );
        res.data.map(picto => {
          if (picto.path) {
            picto.path = context.$config.baseURL + "/pictalk/image/" + picto.path;
          }
        });
        await context.store.dispatch("addView", {
          pictos: res.data,
          fatherId: parseInt(context.route.params.fatherId, 10),
          collectionId: parseInt(context.route.params.collectionId, 10)
        });
      } catch (error) {
        console.log("error ", error);
      }
    }
    const user = context.store.getters.getUser;
    if (user.username) {
    } else {
      try {
        var res = await axios.get("/auth/details/");
        context.store.commit("editUser", res.data);
      } catch (error) {
        console.log("error ", error);
      }
    }
    const collections = await context.store.getters.getCollections;
    if (collections.length !== 0) {
      return;
    } else {
      try {
        const res = await axios.get("/pictalk/collection");
        res.data.map(collection => {
          if (collection.path) {
            collection.path =
              context.$config.baseURL + "/pictalk/image/" + collection.path;
          }
        });
        context.store.commit("setCollections", res.data);
        return;
      } catch (error) {
        console.log("error ", error);
      }
    }
  },
  data() {
    return {
      isPicto: true
    };
  },
  methods: {
    removeSpeech() {
      this.$store.commit("removeSpeech");
    }
  }
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
