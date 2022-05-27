<template>
  <div>
    <b-field class="searchBar">
      <b-input
        v-model="search"
        :placeholder="$t('SearchPictoPlaceholder')"
        clearable
        expanded
        style="min-width: 70vw"
      >
      </b-input>
      <b-button
        class="searchButton"
        type="is-info"
        @click="searchPicto()"
        icon-right="magnify"
      />
    </b-field>
    <div class="container publicPictos is-widescreen">
      <pictoList
        class="publicList"
        :pictos="loadedPictos"
        :publicMode="true"
        :sidebar="false"
      />
    </div>
  </div>
</template>
<script >
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
  layout: "public",
  middleware: ["axios"],
  components: {
    pictoList: pictoList,
    pictoBar: pictoBar,
  },
  watch: {
    querySearchParameter: function (value) {
      this.search = value;
    },
    search: function (value) {
      this.$router.push({ query: { ...this.$route.query, search: value } });
    },
  },
  created() {
    this.$store.commit("eraseSpeech");
  },
  mounted() {
    this.search = this.querySearchParameter;
  },
  data() {
    return {
      search: "",
      page: 1,
      per_page: 15,
      pictos: [],
    };
  },
  methods: {
    async searchPicto() {
      this.pictos = await this.$store.dispatch("getPublicCollections", {
        search: this.search,
        page: this.search,
        per_page: this.per_page,
      });
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
      return this.$store.getters.getPublicCollections.concat(this.pictos);
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
  max-width: 768px;
  display: flex;
  margin-right: auto;
  margin-left: auto;
}
.publicPictos {
  margin-left: 1vw;
  margin-right: 1vw;
  border: solid;
  border-radius: 4px;
  border-width: 2px;
  border-color: #4c43294f;
}
.publicList {
  margin-top: 1vh;
  margin-left: 2vw;
  margin-right: 2vw;
}
</style>
