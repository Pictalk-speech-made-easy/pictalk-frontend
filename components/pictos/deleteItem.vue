<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ $t("Delete") }}</p>
    </header>
    <section class="modal-card-body">
      {{ $t("DeleteItem") }}{{ object.meaning[getUserLang()] }} ?
      <br />
      <br />
      <img
        class="image"
        :src="object.image"
        width="40%"
        crossorigin="anonymous"
        style=""
      />
      <br />
      <br />
      <b-field
        :label="
          $t('PleaseType1') +
          ' <' +
          object.meaning[getUserLang()] +
          '> ' +
          $t('PleaseType2')
        "
      >
        <b-input
          v-model="meaningOrName"
          :placeholder="object.meaning[getUserLang()]"
          v-on:keyup.native.enter="object.meaning[getUserLang()]"
        ></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button class="button" type="button" @click="$parent.close()">{{
        $t("Close")
      }}</b-button>
      <b-button class="button is-primary" @click="onSubmitted(meaningOrName)">{{
        $t("Delete")
      }}</b-button>
    </footer>
  </div>
</template>
<script>
export default {
  props: {
    object: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      meaningOrName: "",
    };
  },
  methods: {
    getUserLang(detailled = false) {
      const user = this.$store.getters.getUser;
      const lang = Object.keys(user.language)[0];
      if (lang && !detailled) {
        return lang.replace(/[^a-z]/g, "");
      } else if (lang && detailled) {
        return lang;
      } else {
        return window.navigator.language;
      }
    },
    async onSubmitted(name) {
      if (name == this.object.meaning[this.getUserLang()]) {
        try {
          if (this.object.collection) {
            const res = await this.$store.dispatch("removeCollection", {
              collectionId: this.object.id,
              fatherCollectionId: parseInt(
                this.$route.params.fatherCollectionId,
                10
              ),
            });
          } else {
            const res = await this.$store.dispatch("removePicto", {
              pictoId: this.object.id,
              fatherCollectionId: parseInt(
                this.$route.params.fatherCollectionId,
                10
              ),
            });
          }
          this.$buefy.toast.open({
            message: this.$t("DeletedSuccess"),
            type: "is-success",
          });
          this.$parent.close();
          return;
        } catch (ex) {
          console.log(ex);
          this.$buefy.toast.open({
            message: this.$t("SomeThingBadHappened"),
            type: "is-danger",
          });
        }
      } else {
        this.$buefy.toast.open({
          message: this.$t("DeleteNotCorrespond"),
          type: "is-danger",
        });
      }
    },
  },
};
</script>
