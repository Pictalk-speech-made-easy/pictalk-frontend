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
          <b-input type="password" :placeholder="$t('PlaceHolderPassword')" password-reveal required
            v-model="password" />
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
      password: "",
      debounceTimer: null,
      delay: 300
    };
  },
  watch: {
    password: function () {
      this.signInDebounced()
    }
  },
  methods: {
    signInDebounced() {
      console.log("sign in debounced")
      this.debounce(async function (val) {
        console.log("in debounce")
        try {
          await axios.post("/auth/signin", { username: this.$store.getters.getUser.username, password: this.password })
          this.isCorrespond = true
        } catch (e) {
          this.isCorrespond = false
          this.delay += 100
        }
      }, this.delay)
    }, // 300ms delay
    debounce(func, delay) {
      const context = this;
      const args = arguments;
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func.apply(context, args), delay);
    },
    async deleteAccount() {
      await axios.delete(`/user/${this.$store.getters.getUser.id}`);
      this.$parent.close();
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  }
}
</script>