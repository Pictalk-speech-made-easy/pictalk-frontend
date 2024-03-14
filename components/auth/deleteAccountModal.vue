<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p align="center" class="modal-card-title">{{ $t("DeleteAccount") }}</p>
    </header>
    <section class="modal-card-body">
      <div class="d-block text-center">
        <p>{{ $t('DeleteAccountText') }}</p>
        <br>
        <form>
          <b-input type="email" :placeholder="$store.getters.getUser.username" required v-model="email" />
        </form>
        <br>
        <b-button :disabled="!isCorrespond" class="button is-danger center" @click="deleteAccount()">{{
        $t("DeleteAccount") }}</b-button>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  middleware: ["axios"],
  data() {
    return {
      isCorrespond: "",
      email: "",
    };
  },
  watch: {
    password: function () {
      this.isCorrespond = this.$store.getters.getUser.username === this.email;
    }
  },
  methods: {
    async deleteAccount() {
      await axios.delete(`/user/${this.$store.getters.getUser.id}`);
      this.$parent.close();
      this.$store.dispatch("logout", this.$keycloak);
      this.$router.push("/");
    }
  }
}
</script>