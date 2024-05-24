<template>
  <div>
    <b-field class="searchBar">
      <b-input v-model="search" :placeholder="$t('SearchPictoPlaceholder')" clearable expanded style="min-width: 70vw"
        @keyup.native.enter="searchFirst()">
      </b-input>
      <b-button type="is-info" @click="searchFirst()" icon-right="magnify" :loading="loading" />
    </b-field>

    <pictoList class="publicList" :pictos="pictos" :publicMode="true" :sidebar="false" :sidebarUsed="false" />
    <div class="searchBottom">
      <b-button v-if="more" class="searchButton" type="is-info is-light is-text" @click="searchMore()"
        icon-right="magnify" rounded :loading="loading">
        {{ $t("MoreItems") }}
      </b-button>
    </div>
  </div>
</template>
<script>
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
  created() {
    this.$store.commit("eraseSpeech");
  },
  mounted() {
    this.per_page =
      window.innerWidth > 767 ? (window.innerWidth > 1407 ? 48 : 30) : 15;
    if (this.querySearchParameter != "") {
      this.search = this.querySearchParameter;
      this.searchFirst();
    }
  },
  data() {
    return {
      search: "",
      page: 1,
      per_page: 15,
      loading: false,
      more: false,
      pictos: [],
      per_page_options: [15, 30, 50],
    };
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
  },
  computed: {
    querySearchParameter() {
      return this.$route.query.search;
    },
    isLogged() {
      return this.$store.getters.getUser.username == !undefined;
    },
    loadedPictos() {
      if (!this.search) {
        return this.$store.getters.getPublicCollections.map((id) => {
          const index = this.$store.getters.getCollections.findIndex(
            (collection) => collection.id === id
          );
          return this.$store.getters.getCollections[index];
        });
      } else {
        return this.pictos;
      }
    },
    loadSpeech() {
      return this.$store.getters.getSpeech;
    },
  },
  head() {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      htmlAttrs: {
        title: this.$t("TitlePublic"),
        ...i18nHead.htmlAttrs,
      },
      title: this.$t("TitlePublic"),
      meta: [
        {
          hid: "descriptionPublic",
          name: "description",
          content: this.$t("DescriptionPublic"),
        },
        ...i18nHead.meta,
      ],
    };
  },
};
</script>
<style scoped>
.searchBar {
  width: 80vw;
  display: flex;
  margin-right: auto;
  margin-left: auto;
}

.publicList {
  margin: 20px;
}

.searchBottom {
  width: 100vw;
  position: fixed;
  bottom: 2vh;
}

.searchButton {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  border: solid;
  border-width: 1px;
  border-color: #3e8ed0;
  width: 30vw;
  min-width: 240px;
  max-width: 450px;
}
</style>
