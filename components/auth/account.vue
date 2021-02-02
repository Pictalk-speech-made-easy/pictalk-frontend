<template>
  <div>
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
          user.username,
          user.password,
          user.language
        )
      "
      >Save</b-button
    >
    <b-button
      type="is-info"
      @click="downloadAll()">Download all pictos (Enable Offline)</b-button>
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
    async downloadAll(){
      const res = await axios.get("/pictalk/allPictos");
        var views = [];
        res.data.map(picto => {
          if (picto.path) {
            picto.path =
              context.$config.baseURL + "/pictalk/" + picto.path;
          }
          const isAView = views.findIndex(
            view => view.fatherId === picto.fatherId &&
            view.collectionId === picto.collectionId
            );
          if(picto.folder == 1){
            views.push({collectionId: picto.collectionId, fatherId: picto.id, pictos: Array()}); //View of folder
          }
          if(isAView == -1){
            views.push({collectionId: picto.collectionId, fatherId: picto.fatherId, pictos: Array()}); //Add view if not here
          }
          views[isAView].pictos.push({...picto});
        });
        views.forEach((view) => {
          this.$store.dispatch('addView', view);
        });
        return;
    },
    async onSave(username, password, language) {
      try {
        const res = await this.$store.dispatch("editUser", {
          username: username,
          password: password,
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
