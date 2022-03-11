<template>
  <div class="margins">
    <div class="columns is-multiline is-mobile">
      <picto
        class="
          column
          is-one-third-mobile
          is-one-quarter-tablet
          is-one-quarter-desktop
          is-one-quarter-widescreen
          is-one-fifth-fullhd
          lessPadding
        "
        v-for="picto in getFilteredPictoList"
        :key="picto.id + Math.random()"
        :picto="picto"
        :adminMode="adminMode"
        :publicMode="publicMode"
      />
      <div
        class="
          column
          is-one-third-mobile
          is-one-quarter-tablet
          is-one-quarter-desktop
          is-one-quarter-widescreen
          is-one-fifth-fullhd
        "
      >
        <div class="contenant">
          <div class="columns fab-zone">
            <div v-if="!publicMode && adminMode" class="column">
              <b-button
                rounded
                size="is-medium"
                type="is-success"
                @click="addPicto(true)"
                icon-right="image"
              />
            </div>
            <div v-if="!publicMode && adminMode" class="column">
              <b-button
                rounded
                size="is-medium"
                type="is-primary"
                @click="addPicto(false)"
                icon-right="folder-table"
              />
            </div>
            <div v-if="!publicMode" class="column">
              <b-button
                rounded
                size="is-medium"
                type="is-warning"
                :focused="adminMode"
                @click="adminModeChoose()"
                :icon-right="iconIsAdmin"
              />
            </div>
            <div
              v-if="checkCopyCollectionId && !publicMode && adminMode"
              class="column"
            >
              <b-button
                rounded
                @click="copyCollection()"
                size="is-medium"
                type="is-info"
                icon-right="content-paste"
              />
            </div>
            <div v-if="publicMode" class="column">
              <b-button
                rounded
                size="is-medium"
                type="is-info"
                @click="openSearchPicto()"
                icon-right="magnify"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="searching" class="search notification is-primary">
      <b-autocomplete
        v-model="search"
        :data="
          $store.getters.getPublicCollections.map(
            (collections) => collections.meaning
          )
        "
        :placeholder="$t('SearchPictoPlaceholder')"
        icon="magnify"
        clearable
      >
      </b-autocomplete>
    </div>
  </div>
</template>
<script difer>
import picto from "@/components/pictos/picto";
import PictoSteps from "@/components/pictos/pictoSteps";
import lang from "@/mixins/lang";
import enforcedSecurity from "@/mixins/enforcedSecurity";
import links from "@/mixins/links";
export default {
  mixins: [lang, enforcedSecurity, links],
  components: {
    picto,
    PictoSteps,
  },
  data() {
    return {
      searching: false,
      search: "",
    };
  },
  props: {
    pictos: {
      type: Array,
      required: true,
    },
    adminMode: {
      type: Boolean,
      required: true,
    },
    publicMode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  computed: {
    iconIsAdmin() {
      return this.$route.query.isAdmin ? "lock-open-variant" : "lock";
    },
    checkCopyCollectionId() {
      return (
        this.$store.getters.getCopyCollectionId ||
        this.$store.getters.getShortcutCollectionId
      );
    },
    getFilteredPictoList() {
      return this.pictos.filter((picto) =>
        picto.meaning[this.getUserLang]?.includes(this.search)
      );
    },
  },
  methods: {
    adminModeChoose() {
      if (this.admin) {
        this.$router.push(this.homeLink);
      } else {
        if (this.$store.getters.getUser.settings.securityMode) {
          this.goToAdminWithEnforced();
        } else {
          this.$router.push(this.$route.path + "?isAdmin=true");
        }
      }
    },
    goToAdminWithEnforced() {
      let postFunction = function (t) {
        t.$router.push(t.$route.path + "?isAdmin=true");
        if (!t.$route.query.isAdmin) {
          t.$buefy.toast.open(t.$t("SupervisorModeSuccess"));
        }
      };
      this.enforcedSecurityMinor(postFunction);
    },
    addPicto(isPicto) {
      this.$buefy.modal.open({
        parent: this,
        component: PictoSteps,
        hasModalCard: true,
        props: { create: true, isPicto: isPicto },
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    async copyCollection() {
      if (this.$store.getters.getCopyCollectionId) {
        try {
          await this.$store.dispatch("copyCollectionById", {
            collectionId: this.$store.getters.getCopyCollectionId,
            fatherCollectionId: this.$route.params.fatherCollectionId,
            collection: this.getCollectionFromId(
              parseInt(this.$route.params.fatherCollectionId, 10)
            ),
          });
          this.$store.commit("resetCopyCollectionId");
        } catch (error) {
          if (error.response.status == 401) {
            this.$buefy.toast.open({
              duration: 5000,
              message: this.$t("NotAuthorized"),
              position: "is-top",
              type: "is-danger",
            });
          } else {
            this.$buefy.toast.open({
              duration: 5000,
              message: this.$t("CouldNotPaste"),
              position: "is-top",
              type: "is-danger",
            });
          }
        }
      } else if (this.$store.getters.getShortcutCollectionId) {
        try {
          let collection = JSON.parse(
            JSON.stringify(
              this.getCollectionFromId(
                parseInt(this.$route.params.fatherCollectionId, 10)
              )
            )
          );
          collection.collections.push({
            id: this.$store.getters.getShortcutCollectionId,
          });
          await this.$store.dispatch("editCollection", {
            id: collection.id,
            collections: collection.collections,
          });
          this.$store.commit("resetShortcutCollectionId");
        } catch (error) {
          if (error.response.status == 401) {
            this.$buefy.toast.open({
              duration: 5000,
              message: this.$t("NotAuthorized"),
              position: "is-top",
              type: "is-danger",
            });
          } else {
            this.$buefy.toast.open({
              duration: 5000,
              message: this.$t("CouldNotPaste"),
              position: "is-top",
              type: "is-danger",
            });
          }
        }
      }
    },
    getCollectionFromId(id) {
      const index = this.$store.getters.getCollections.findIndex(
        (collection) => collection.id === id
      );
      return this.$store.getters.getCollections[index];
    },
    openSearchPicto() {
      this.searching = !this.searching;
    },
  },
};
</script>
<style scoped>
.contenant {
  display: flex;
  justify-content: center;
}
.search {
  bottom: 50%;
  width: 98%;
  max-height: 20%;
  position: fixed;
}
.fab-zone {
  bottom: 12%;
  right: 5%;
  position: fixed;
}
.lessPadding {
  padding: 0.38rem;
}
.margins {
  margin-left: 7px;
  margin-right: 7px;
}
</style>
