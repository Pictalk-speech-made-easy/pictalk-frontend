<template>
  <div class="container is-widescreen">
    <pictoList :isPicto="isPicto" :pictos="loadedPictos" :adminMode="isAdmin" />
    <pictoBar :pictos="loadSpeech" />
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
        view => view.id == this.$route.params.fatherId
      );
      if (view.length !== 0) {
        return view[0].pictos;
      } else {
        return {};
      }
    }
  },
  async asyncData(context) {
    const views = await context.store.getters.getPictoViews;
    if (views.length !== 0) {
      const fatherPictoIndex = views.findIndex(
        view => view.id === context.route.params.fatherId
      );
      const view = views[fatherPictoIndex];
      if (view) {
        return;
      }
    } else {
      try {
        console.log(context.route.params.collectionId);
        var res = await axios.get(
          "http://localhost:3001/pictalk/picto/" +
            context.route.params.fatherId +
            "/" +
            context.route.params.collectionId
        );
        res.data.map(picto => {
          if (picto.path) {
            picto.path = "http://localhost:3001/pictalk/" + picto.path;
          }
        });
        context.store.commit("addView", {
          id: parseInt(context.route.params.fatherId, 10),
          pictos: res.data
        });
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
