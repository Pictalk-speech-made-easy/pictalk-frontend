<template>
  <div>
    <clientOnly>
      <b-field v-if="!$route.query.fatherCollectionId" class="searchBar">
        <b-input v-model="search" :placeholder="$t('SearchPictoPlaceholder')" clearable expanded style="min-width: 70vw"
          @keyup.native.enter="searchFirst()">
        </b-input>
        <b-button type="is-info" @click="searchFirst()" icon-right="magnify" :loading="loading" />
      </b-field>

      <div class="is-widescreen" style="margin-right: 0.5rem; margin-left: 0.5rem">
        <pictoList :publicMode="true" :pictos="pictos" :sidebar="false" :sidebarUsed="false" />
      </div>
      <div v-if="!$route.query.fatherCollectionId" class="searchBottom">
        <b-button v-if="more" class="searchButton" type="is-info is-light is-text" @click="searchMore()"
          icon-right="magnify" rounded :loading="loading">
          {{ $t("MoreItems") }}
        </b-button>
      </div>
      <div class="contenant">
        <pictoBar :style="loadSpeech.length != 0
          ? 'bottom: 2px'
          : 'transform: translateY(105%);'
          " class="pictobar sidebar slide-up" :publicMode="true" :pictos="loadSpeech"
          :collectionColor="collectionColor" />
      </div>
      <div class="filler"></div>
    </clientOnly>
  </div>
</template>
<script>
import axios from "axios";
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
  nuxtI18n: false,
  layout: "public",
  middleware: ["axios"],
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar,
  },
  computed: {
    querySearchParameter() {
      return this.$route.query.search;
    },
    loadSpeech() {
      return this.$store.getters.getSpeech;
    },
    isLogged() {
      return this.$store.getters.getUser.username == !undefined;
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
    fatherCollectionId() {
      return this.$route.query.fatherCollectionId;
    },
  },
  watch: {
    async fatherCollectionId(fatherCollectionId, previousId) {
      if (fatherCollectionId && fatherCollectionId != previousId) {
        console.log("fatherCollectionId", fatherCollectionId, previousId);
        await this.fetchCollection(fatherCollectionId);
        this.pictos = await this.loadedPictos();
      }
    },
  },
  async fetch() {
    if (this.$route.query.fatherCollectionId) {
      await this.fetchCollection(
        parseInt(this.$route.query.fatherCollectionId, 10)
      );
      this.pictos = await this.loadedPictos();
    }
  },
  data() {
    return {
      isPicto: true,
      pictos: [],
      search: "",
      page: 1,
      per_page: 15,
      loading: false,
      more: false,
      per_page_options: [15, 30, 50],
    };
  },
  mounted() {
    this.searchFirst();
  },
  methods: {
    async searchPublic() {
      this.loading = true;
      const requested = await this.$store.dispatch("getPublicCollections", {
        search: this.search ? this.search : "",
        page: this.page,
        per_page: this.per_page,
      });
      if (requested.length >= this.per_page) {
        this.more = true;
      } else {
        this.more = false;
      }
      this.loading = false;
      return requested;
    },
    async searchMore() {
      this.page = this.page + 1;
      this.pictos = this.pictos.concat(await this.searchPublic());
    },
    async searchFirst() {
      this.page = 1;
      this.pictos = await this.searchPublic();
    },
    sorting(items) {
      let sortedItems = items.sort(function (itemA, itemB) {
        return new Date(itemA.createdDate) - new Date(itemB.createdDate);
      });
      return sortedItems;
    },
    async fetchCollection(collectionId) {
      try {
        const collection = await this.$store.dispatch("fetchCollection", collectionId);
        return collection;
      } catch (error) {
        console.log(error);
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("LostConnectivity"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "airplane",
        });
      }
    },
    loadedPictos() {
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
    removeSpeech() {
      this.$store.commit("removeSpeech");
    },
    async getCollectionFromId(id) {
      return this.$store.dispatch("getCollectionFromId", id);
    },
    async getPictoFromId(id) {
      return this.$store.dispatch("getPictoFromId", id);
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
