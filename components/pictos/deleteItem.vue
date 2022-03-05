<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head" style="padding: 2%">
      <b-button
        class="button"
        type="is-danger"
        icon-left="arrow-left"
        @click="$parent.close()"
      />
      <p align="center" class="modal-card-title">{{ $t("Delete") }}</p>
    </header>
    <section class="modal-card-body">
      {{ $t("DeleteItem") }}{{ object.meaning[getUserLang] }} ?
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
          object.meaning[getUserLang] +
          '> ' +
          $t('PleaseType2')
        "
      >
        <b-input
          v-model="meaningOrName"
          :placeholder="object.meaning[getUserLang]"
          @keyup.native.enter="onSubmitted(meaningOrName)"
        ></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="padding: 2%">
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
import lang from "@/mixins/lang";
export default {
  mixins: [lang],
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
    async onSubmitted(name) {
      console.log("this is the name", name);
      if (name == this.object.meaning[this.getUserLang]) {
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
