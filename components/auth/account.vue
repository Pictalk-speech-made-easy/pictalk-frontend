<template>
  <div>
    <b-field label="Name">
      <b-input
        v-model="user.name"
        maxlength="30"
        type="name"
        placeholder="Dupont"
      ></b-input>
    </b-field>
    <b-field label="Surname">
      <b-input
        v-model="user.surname"
        placeholder="Pierre"
        type="name"
        maxlength="30"
      ></b-input>
    </b-field>
    <b-field label="Email">
      <b-input
        v-model="user.username"
        placeholder="exemple@mail.com"
        type="email"
        maxlength="30"
      ></b-input>
    </b-field>
    <b-field label="Password">
      <b-input
        v-model="user.password"
        placeholder="S0meExample!"
        type="password"
        maxlength="30"
        password-reveal
      ></b-input>
    </b-field>
    <b-field label="Language">
      <b-select v-model="user.language" placeholder="Select language" rounded>
        <option
          v-for="language in languages"
          :value="language.lang"
          :key="language.voiceURI"
        >
          {{ language.lang }}
        </option>
      </b-select>
    </b-field>
    <hr />
    <b-button tag="nuxt-link" to="/pictalk">Cancel</b-button>
    <b-button
      type="is-info"
      @click="
        onSave(
          user.name,
          user.surname,
          user.username,
          user.password,
          user.language
        )
      "
      >Save</b-button
    >
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
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
    async onSave(name, surname, username, password, language) {
      try {
        const res = await this.$store.dispatch("editUser", {
          username: username,
          password: password,
          name: name,
          surname: surname,
          password: password,
          language: language
        });
      } catch (error) {
        console.log("error: ", error);
      }

      this.$router.push("/pictalk");
    }
  }
};
</script>
