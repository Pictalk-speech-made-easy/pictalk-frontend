<template>
  <form action>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Sign Up</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Email">
          <b-input
            type="email"
            v-model="username"
            placeholder="alex@pictalk.com"
            required
          ></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Ch00s3 a Stro!g Passw0Rd"
            required
          ></b-input>
        </b-field>
        <b-field label="Language">
          <b-select v-model="language" placeholder="Select language" rounded>
            <option
              v-for="language in languages"
              :value="language.lang"
              :key="language.voiceURI"
            >
              {{ language.lang }}
            </option>
          </b-select>
        </b-field>
        <br />
        <b-message
          title="Informations légales"
          type="is-danger"
          aria-close-label="Close message"
        >
          Les données personnelles ne seront en aucun cas utilisées à des fins
          commerciales ni autres que dans le cadre de Pic'Talk. Les données,
          tels que les pictos sont stockés dans un serveur sécurisé par
          Pic'Talk. Pic'Talk est toutefois susceptible d'être hacké. De ce fait
          nous vous conseillons de ne pas mettre de photos à caractère privé et
          dont vous ne souhaiteriez en aucun cas les voir sur internet.
          Concernant le nom, nom de famille, ils ne sont pour le moment peu
          nécessités. Vous n'êtes pas obligés d'y rentrer votre identité. Ce
          projet étant à ses débuts, je n'ai pas encore pu m'occuper des termes
          légaux. Je souhaite donc me dédouaner de toute image présente sur mon
          serveur Pic'Talk, je n'en ai pas le contrôle. Si vous vous inscrivez
          ou fermez ce message, vous vous portez garant de tout le contenu
          choquant ou images illégalement acquises présent sur votre compte
          Pic'Talk.
        </b-message>
      </section>
      <footer class="modal-card-foot">
        <b-button class="is-primary" @click="onSubmit">Sign Up</b-button>
      </footer>
    </div>
  </form>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      password: "",
      language: "",
      languages: []
    };
  },
  async created() {
    if ("speechSynthesis" in window) {
      let voices = window.speechSynthesis.getVoices();
      let increment = 0;
      while (voices.length == 0 && increment != 10) {
        voices = window.speechSynthesis.getVoices();
        increment++;
        await this.delay(10);
      }
      this.languages = voices;
      
    }
  },
  methods: {
    delay(delayInms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    },
    async onSubmit() {
      try {
        const res = await axios.post("/auth/signup", {
          username: this.username,
          password: this.password,
          language: this.language,
        });
        if (res.status == 201) {
          await this.$store.dispatch("authenticateUser", {
            username: this.username,
            password: this.password,
            isLogin: true
          });
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Your account has been successfully created !`,
            position: "is-top-right",
            type: "is-success",
            hasIcon: true
          });
        } else {
          const notif = this.$buefy.notification.open({
            duration: 5000,
            message: `Some parameters are invalid...`,
            position: "is-top-right",
            type: "is-danger",
            hasIcon: true,
            icon: "account"
          });
        }
      } catch (error) {
        console.log("error: ", error);
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: `An error has occurred`,
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          icon: "account"
        });
      }
      this.$parent.close();
      this.$router.push("/pictalk");
    }
  }
};
</script>
