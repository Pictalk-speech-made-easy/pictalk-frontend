<template>
  <div>
    <pictoList :isPicto="isPicto" :pictos="loadedPictos" :adminMode="isAdmin" />
    <pictoBar :pictos="loadSpeech" />
  </div>
</template>
<script>
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
    }
  },
  async asyncData({ store, route }) {
    const views = await store.getters.getPictoViews;
    const fatherPictoIndex = views.findIndex(
      view => view.id === route.params.fatherId
    );
    const view = views[fatherPictoIndex];
    if (view) {
      return { loadedPictos: view };
    } else {
      const ret = "";
      try {
        res = await axios.get(
          "http://localhost:3001/pictalk/picto/" +
            route.params.fatherId +
            "/" +
            route.params.collectionId
        );
        store.commit("addView", res.data);
        ret = res.data;
      } catch (error) {
        console.log("error ", error);
      }
      return { loadedPictos: ret };
    }
  },
  data() {
    return {
      isPicto: true,
      loadedPictos: [
        {
          id: "1",
          meaning: "Je",
          folder: false,
          speech: "Je",
          fatherId: "0",
          path:
            "https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
        },
        {
          id: "2",
          meaning: "suis",
          folder: true,
          speech: "suis",
          fatherId: "0",
          path:
            "https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
        },
        {
          id: "3",
          meaning: "fort",
          folder: false,
          speech: "fort",
          fatherId: "0",
          path:
            "https://www.superprof.fr/ressources/wp-content/uploads/2006/10/pictogramme-travailler-dur-1200x998.png"
        }
      ]
    };
  },
  methods: {
    removeSpeech() {
      this.$store.commit("removeSpeech");
    }
  }
};
</script>
