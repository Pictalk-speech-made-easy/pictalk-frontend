<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Login</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Email">
          <b-input
            type="email"
            v-model="username"
            placeholder="Your email"
            required
          ></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Your password"
            required
          ></b-input>
        </b-field>

        <b-checkbox>Remember me</b-checkbox>
      </section>
      <footer class="modal-card-foot">
        <b-button class="is-primary" @click="onSubmit">Login</b-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async onSubmit() {
      console.log(
        "onSubmit launched with params: " +
          this.username +
          " AND " +
          this.password
      );
      try {
        const res = await this.$store.dispatch("authenticateUser", {
          username: this.username,
          password: this.password,
          isLogin: true
        });
      } catch (error) {
        console.log("error: ", error);
      }
      this.$parent.close();
      this.$router.push("/pictalk");
    }
  }
};
</script>
