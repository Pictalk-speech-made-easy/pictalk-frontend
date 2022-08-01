<template>
  <div class="modal-card" style="min-height: 30vh; min-width: 20vw">
    <header class="modal-card-head">
      <b-button
        class="button"
        type="is-danger"
        icon-left="close"
        @click="$parent.close()"
      />
    </header>
    <section class="modal-card-body">
      <b-field
        @keyup.native.enter="evaluate()"
        :label="
          $t('SupervisorModeQuestion') + ' :  ' + `${this.a} + ${this.b} ?`
        "
      >
        <b-input type="number" v-model="number" required></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <div class="container">
        <b-button
          style="
            width: 50%;
            display: flex;
            margin-right: auto;
            margin-left: auto;
          "
          type="is-primary"
          @click="evaluate()"
          >{{ $t("VerifyAccountOK") }}</b-button
        >
      </div>
    </footer>
  </div>
</template>
<script >
export default {
  name: "Security",
  props: {
    callback: {
      type: Function,
      required: true,
    },
  },
  mounted() {
    this.a = Math.floor(Math.random() * 10 + 1);
    this.b = Math.floor(Math.random() * 10 + 1);
  },
  data() {
    return {
      number: "",
      a: 0,
      b: 0,
    };
  },
  methods: {
    evaluate() {
      if (this.number == this.a + this.b) {
        this.$parent.close();
        this.callback(this);
      } else {
        this.$parent.close();
      }
    },
  },
};
</script>
