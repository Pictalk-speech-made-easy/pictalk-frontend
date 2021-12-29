<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ $t("Delete") }}</p>
    </header>
    <section class="modal-card-body">
      {{ $t("DeleteItem") }}{{ returnMeaningOrName(object) }} ?
      <br />
      <br />
      <img
        class="image"
        :src="object.path"
        width="40%"
        crossorigin="anonymous"
        style=""
      />
      <br />
      <br />
      <b-field
        :label="
          $t('PleaseType1') +
          ' ' +
          returnMeaningOrName(object) +
          ' ' +
          $t('PleaseType2')
        "
      >
        <b-input
          v-model="meaningOrName"
          :placeholder="returnMeaningOrName(object)"
          v-on:keyup.native.enter="onSubmitted(meaningOrName)"
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
    collectionId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      meaningOrName: "",
    };
  },
  methods: {
    returnMeaningOrName(object) {
      if (object.name) {
        return object.name;
      } else {
        return object.meaning;
      }
    },
    isPictoOrCollection(object) {
      if (object.name) {
        return "Collection";
      } else {
        return "Picto";
      }
    },

    async onSubmitted(name) {
      let typeOfObject = this.isPictoOrCollection(this.object);
      if (name == this.returnMeaningOrName(this.object)) {
        try {
          if (typeOfObject == "Collection" && !this.collectionId) {
            const res = await this.$store.dispatch(
              "removeCollection",
              this.object.id
            );
          } else {
            if (typeOfObject == "Picto" && this.collectionId) {
              const res = await this.$store.dispatch("removePicto", {
                picto: this.object,
                collectionId: this.collectionId,
              });
            } else {
              this.$buefy.notification.open({
                message: this.$t("SomeThingBadHappened"),
                type: "is-danger",
              });
              this.$parent.close();
              return;
            }
          }
          this.$buefy.notification.open({
            message: this.$t("DeletedSuccess"),
            type: "is-success",
          });
          this.$parent.close();
        } catch (ex) {
          console.log(ex);
          this.$buefy.notification.open({
            message: this.$t("SomeThingBadHappened"),
            type: "is-danger",
          });
        }
      } else {
        this.$buefy.notification.open({
          message: this.$t("DeleteNotCorrespond"),
          type: "is-danger",
        });
      }
    },
  },
};
</script>
