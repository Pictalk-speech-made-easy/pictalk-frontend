<template>
  <div style="width: 100%">
    <b-tabs expanded type="is-toggle">
      <b-tab-item icon="tune">
        <br />
        <b-field>
          <b-switch v-model="user.settings.pronounceClick">{{
            $t("PronouncePictoOnClick")
          }}</b-switch>
        </b-field>
        <b-field>
          <b-switch v-model="user.settings.securityMode">{{
            $t("EnforcedSecurityMode")
          }}</b-switch>
        </b-field>
        <b-field>
          <b-switch v-model="user.settings.returnWithoutRemove">{{
            $t("ReturnWithoutRemoveButton")
          }}</b-switch>
        </b-field>
        <b-field>
          <b-switch v-model="user.settings.travelMode">{{
            $t("TravelerMode")
          }}</b-switch>
        </b-field>
        <hr />
      </b-tab-item>
      <b-tab-item icon="translate">
        <br />
        <b-field :label="$t('DisplayedLanguage')">
          <b-navbar-dropdown
            collapsible
            expanded
            :label="getEmoji(localeIso())"
          >
            <b-navbar-item
              v-for="locale in availableLocales"
              :key="locale.code"
              @click.prevent.stop="$i18n.setLocale(locale.code)"
              >{{ getEmoji(locale.iso) }}</b-navbar-item
            >
          </b-navbar-dropdown>
        </b-field>
        <b-field :label="$t('Voice')">
          <b-select
            v-model="voiceURI"
            placeholder="Select language"
            required
            :loading="loadingVoices"
            expanded
          >
            <option
              v-for="voice in loadedVoices"
              :value="voice.voiceURI"
              :key="voice.voiceURI"
            >
              {{ getEmoji(voice.lang) }} {{ voice.name }}
            </option>
          </b-select>
        </b-field>
        <b-button
          v-if="!displayVoicesOrMultiLingual"
          @click="displayVoices = !displayVoices"
          type="is-ghost"
          >{{ $t("SpeakMoreLanguage") }}</b-button
        >
        <b-field v-if="displayVoicesOrMultiLingual" :label="$t('Voices')">
          <b-select
            v-model="voiceURIs"
            placeholder="Select language"
            required
            multiple
            expanded
            native-size="8"
            :loading="loadingVoices"
          >
            <option
              v-for="voice in loadedVoices"
              :value="voice.voiceURI"
              :key="voice.voiceURI"
            >
              {{ getEmoji(voice.lang) }} {{ voice.name }}
            </option>
          </b-select>
        </b-field>
        <hr />
      </b-tab-item>
      <b-tab-item icon="account-group">
        <br />
        <p class="title is-4">
          {{ $t("SharingButton") }}
        </p>
        <b-field>
          <b-input
            v-model="addDirectSharer"
            expanded
            placeholder="alex@pictalk.xyz"
            type="email"
            maxlength="30"
          ></b-input>
          <b-button
            type="is-success"
            icon-right="plus"
            @click="pushToSharers()"
          />
        </b-field>
        <b-table
          :data="directSharersObj"
          :columns="columns"
          :selected.sync="selected"
          :mobile-cards="false"
        >
        </b-table>
        <br />
        <b-button
          v-if="directSharers.indexOf(selected.username) !== -1"
          class="fourWidth"
          type="is-danger"
          icon-left="delete"
          @click="removeFromSharers()"
        />
        <p class="title is-4">
          {{ $t("Groups") }}
        </p>
        <b-field>
          <div class="columns">
            <div class="card column" v-for="(group, index) in mailingList">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <b-icon :icon="group.icon" />
                  </div>
                  <div class="media-content">
                    <p class="title is-4">
                      {{ group.name }}
                    </p>
                  </div>
                </div>
                <div style="column-count: 2">
                  <div v-for="username in group.users.slice(0, 10)">
                    {{ username }}
                  </div>
                </div>
                ...
                <div class="columns is-mobile is-centered">
                  <div class="container column">
                    <b-button
                      type="is-danger"
                      icon-right="delete"
                      @click="mailingList.splice(index, 1)"
                    />
                  </div>
                  <div class="container column">
                    <b-button
                      type="is-info"
                      icon-right="pencil"
                      @click="openEditGroupModal(group, index)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="column container">
              <b-button
                class="is-success"
                icon-left="plus"
                expanded
                :label="$t('CreateNewGroup')"
                @click="openAddGroupModal()"
              />
            </div>
          </div>
        </b-field>
        <hr />
      </b-tab-item>
    </b-tabs>
    <b-field :label="$t('Password')">
      <b-input
        v-model="user.password"
        placeholder="S0meExample!"
        type="password"
        maxlength="30"
        password-reveal
      ></b-input>
    </b-field>
    <b-button tag="nuxt-link" to="/pictalk" class="fourWidth">{{
      $t("Cancel")
    }}</b-button>
    <b-button
      class="sixWidth"
      type="is-info"
      @click="onSave(user.username, user.password, user.language)"
      >{{ $t("Save") }}</b-button
    >
  </div>
</template>
<script>
import { countryCodeEmoji } from "country-code-emoji";
import merge from "lodash.merge";
import frenchFries from "@/assets/frenchFries.json";
import editGroupModal from "@/components/auth/editGroupModal";
import addGroupModal from "@/components/auth/addGroupModal";
export default {
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
    displayVoicesOrMultiLingual() {
      return this.displayVoices || Object.keys(this.user.languages).length > 1;
    },
    userMultiLingual() {
      return Object.keys(this.user.languages).length > 1;
    },
    requestsPercentage() {
      if (this.nb_requests == 0 && this.dl_launched == false) {
        return 0;
      } else {
        if (this.dl_launched == true && this.nb_requests == 0) {
          return 100;
        } else {
          return (this.done_requests / this.nb_requests) * 100;
        }
      }
    },
    loadedVoices() {
      return this.voices.sort((x, y) => {
        let a = x.lang.toUpperCase(),
          b = y.lang.toUpperCase();
        return a == b ? 0 : a > b ? 1 : -1;
      });
    },
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selected: {},
      showDirectSharerInputText: false,
      addDirectSharer: "",
      displayVoices: false,
      voices: [],
      voiceURI: "",
      voiceURIs: [],
      nb_requests: 0,
      checkedRows: [],
      directSharers: [],
      directSharersObj: [],
      loadingVoices: true,
      done_requests: 0,
      dl_launched: false,
      initialization: true,
      mailingList: {},
      data: [],
      columns: [
        {
          field: "username",
          label: "",
          searchable: false,
        },
      ],
    };
  },
  watch: {
    voiceURI: function (v, oldVoice) {
      const oldIndex = this.voiceURIs.findIndex((uri) => uri == oldVoice);
      if (oldIndex != -1) {
        this.voiceURIs.splice(oldIndex, 1);
      }
      this.voiceURIs.push(v);
      if (this.initialization == false) {
        this.playSentenceInLanguage(
          this.voices.filter((voice) => voice.voiceURI == v)[0].lang,
          v
        );
      }
    },
    voiceURIs: function (newValue, oldValue) {
      if (newValue.length > oldValue.length && newValue.length > 1) {
        const v = newValue.filter((ai) => oldValue.indexOf(ai) == -1)[0];
        if (this.initialization == false) {
          this.playSentenceInLanguage(
            this.voices.filter((voice) => voice.voiceURI == v)[0].lang,
            v
          );
        }
      }
    },
  },
  beforeUpdate() {
    this.initialization = false;
    //TODO Quand on en cree ça n'est plus visible ... this.mailingList = [...this.user.mailingList];
  },
  async created() {
    const allVoicesObtained = new Promise(function (resolve, reject) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", function () {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        });
      }
    });
    allVoicesObtained.then((voices) => {
      this.voices = voices;
      this.loadingVoices = false;
      this.voiceURI =
        this.user.language[Object.keys(this.user.language)[0]][
          this.getDeviceInfo()
        ]?.voiceURI;
      this.voiceURIs = Object.keys(this.user.languages).map((lang) => {
        return this.user.languages[lang][this.getDeviceInfo()]?.voiceURI;
      });
      // Si vide alors remplir avec la premiere valeur equiv a lang
      if (!this.voiceURI) {
        this.voiceURI = this.voices.filter(
          (voice) => voice.lang == Object.keys(this.user.language)[0]
        )[0].voiceURI;
      }

      this.voiceURIs = Object.keys(this.user.languages).map((lang, index) => {
        if (this.voiceURIs[index]) {
          return this.voiceURIs[index];
        } else {
          return this.voices.filter((voice) => voice.lang == lang)[0].voiceURI;
        }
      });
    });
    this.directSharers = [...this.user.directSharers];
    console.log(this.user.mailingList);
    this.mailingList = [...this.user.mailingList];
  },
  methods: {
    pushToSharers() {
      const index = this.directSharers.indexOf(this.addDirectSharer);
      if (index === -1) {
        this.directSharers.push(this.addDirectSharer);
        this.directSharersObj.push({ username: this.addDirectSharer });
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: this.$t("DuplicateFriends"),
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    removeFromSharers() {
      const index = this.directSharers.indexOf(this.selected.username);
      if (index !== -1) {
        this.directSharers.splice(index);
        this.directSharersObj.splice(index);
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: this.$t("CannotRemoveFriends"),
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    openEditGroupModal(group, index) {
      this.$buefy.modal.open({
        parent: this,
        component: editGroupModal,
        props: { group: group, index: index },
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
      });
    },
    openAddGroupModal(group) {
      this.$buefy.modal.open({
        parent: this,
        component: addGroupModal,
        props: { group: group },
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
      });
    },
    localeIso() {
      return this.$i18n.locales.filter((i) => i.code == this.$i18n.locale)[0]
        .iso;
    },
    localeCode() {
      return this.$i18n.locales.filter((i) => i.code == this.$i18n.locale)[0]
        .code;
    },
    getDeviceInfo() {
      return (
        this.getOSInfo() +
        window.screen.height +
        window.screen.width +
        window.devicePixelRatio
      );
    },
    getLimitedUserList(group) {
      return group?.users?.slice(0, 10);
    },
    getOSInfo() {
      if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
        return "Windows 10";
      if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1)
        return "Windows 8.1";
      if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
        return "Windows 8";
      if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
        return "Windows 7";
      if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
        return "Windows Vista";
      if (window.navigator.userAgent.indexOf("Mac") != -1) return "Mac/iOS";
      if (window.navigator.userAgent.indexOf("X11") != -1) return "UNIX";
      if (window.navigator.userAgent.indexOf("Linux") != -1) return "Linux";
    },
    convertToSimpleLanguage(language) {
      return language.replace(/[^a-z]/g, "");
    },
    async playSentenceInLanguage(lang, voiceURI) {
      let translatedText = frenchFries[this.convertToSimpleLanguage(lang)];
      this.pronounce(translatedText, lang, voiceURI);
    },
    async pronounce(speech, lang, voiceURI) {
      if ("speechSynthesis" in window) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = speech;
        let voice = this.voices.filter((voice) => voice.voiceURI == voiceURI);
        if (voice.length == 0) {
          voice = this.voices.filter((voice) => voice.lang == lang);
        }
        if (voice.length !== 0) {
          msg.voice = voice[0];
        }
        window.speechSynthesis.speak(msg);
      } else {
        const notif = this.$buefy.notification.open({
          duration: 5000,
          message: this.$t("NoVoicesFound"),
          position: "is-top-right",
          type: "is-warning",
          hasIcon: true,
        });
      }
    },
    showDirectSharerInput() {
      this.showDirectSharerInputText = !this.showDirectSharerInputText;
    },
    deleteSelectedTrustedSources() {
      this.checkedRows.forEach((row) => {
        const index = this.directSharers.indexOf(row);
        this.directSharers.splice(index, 1);
      });
    },
    getEmoji(language) {
      if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
        return countryCodeEmoji(language.split("-")[1]);
      }
      return;
    },
    addRetry(cache, url, retries = 3, backoff = 300) {
      return cache
        .add(url)
        .then(() => {
          this.done_requests++;
          return;
        })
        .catch(() => {
          if (retries > 0) {
            setTimeout(() => {
              return this.addRetry(cache, url, retries - 1, backoff * 2);
            }, backoff);
          } else {
            console.log("Network disconnected !");
          }
        });
    },
    async onSave() {
      let device = {};
      let language = {};
      let languages = {};
      let editedLanguage = {};
      device[this.getDeviceInfo()] = {
        voiceURI: this.voiceURI,
        pitch: "",
      };
      const languageLang = this.voices.filter(
        (voice) => voice.voiceURI == this.voiceURI
      )[0].lang;
      language[languageLang] = device;
      if (Object.keys(this.user.language)[0] == languageLang) {
        editedLanguage = Object.assign(
          {},
          JSON.parse(JSON.stringify(this.user.language))
        );
        merge(editedLanguage, language);
      } else {
        const languagesIndex = Object.keys(this.user.languages).find(
          (language) => language == languageLang
        );
        if (languagesIndex) {
          editedLanguage[languagesIndex] = this.user.languages[languagesIndex];
        } else {
          editedLanguage = language;
        }
      }
      this.voiceURIs.forEach((voiceURI) => {
        device = {};
        device[this.getDeviceInfo()] = {
          voiceURI: voiceURI,
          pitch: "",
        };
        languages[
          this.voices.filter((voice) => voice.voiceURI == voiceURI)[0].lang
        ] = device;
      });
      let editedLanguages = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.user.languages))
      );

      merge(editedLanguages, languages);
      try {
        const res = await this.$store.dispatch("editUser", {
          username: this.user.username,
          password: this.user.password,
          password: this.user.password,
          language: editedLanguage,
          languages: editedLanguages,
          settings: this.user.settings,
          directSharers: this.directSharers,
          displayLanguage: this.localeCode(),
          mailingList: this.mailingList,
        });
      } catch (error) {
        console.log("error: ", error);
        this.$buefy.toast.open({
          message: this.$t("SomeThingBadHappened"),
          type: "is-danger",
        });
      }

      this.$router.push("/pictalk");
    },
  },
};
</script>
<style>
.fourWidth {
  width: 39%;
}
.sixWidth {
  width: 59%;
}
</style>
