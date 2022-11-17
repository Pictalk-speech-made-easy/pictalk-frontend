<template>
  <div>
    <div class="container" style="max-width: 100%">
      <b-tabs expanded v-model="tabStep" type="is-toggle">
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
          <!-- <b-field>
            <b-switch v-model="user.settings.travelMode">{{
              $t("TravelerMode")
            }}</b-switch>
          </b-field> -->
          <br />
          <b-field :label="$t('Password')">
            <b-input
              v-model="user.password"
              placeholder="S0meExample!"
              type="password"
              maxlength="32"
              password-reveal
            ></b-input>
          </b-field>
          <b-icon icon="cloud-download"></b-icon>
          <!-- Si
          breakpoint
          mobile
          alors
          ne
          pas
          restreindre
          la
          width.
          Sinon
          la
          restreindre
          à
          (petit)
           -->
          <b-progress
            :type="isOfflineReady ? 'is-success' : 'is-info'"
            :value="offlineImagesSavedRatio"
            show-value
          ></b-progress>
          <p v-if="offlineImagesSavedRatio == 100">
            {{ $t("ReadyOffline") }} ✈️
          </p>
          <p v-if="offlineReadyTotal">
            <b>{{ offlineReadyTotal }}</b> {{ $t("DownloadedImages") }}<br />
          </p>
          <p v-else>
            {{ $t("NoStorage") }}
          </p>
          <p v-if="storage != '0B'">
            {{ $t("StorageUsage") }} <b>{{ storage }}</b>
          </p>
          <hr />
        </b-tab-item>
        <b-tab-item icon="translate">
          <br />
          <b-field :label="$t('DisplayedLanguage')">
            <b-select
              collapsible
              expanded
              :label="getEmoji(localeIso())"
              v-model="displayedLanguage"
            >
              <option
                v-for="locale in $i18n.locales"
                :key="locale.code"
                :value="locale.code"
              >
                {{ getEmoji(locale.iso) }}
              </option>
            </b-select>
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
                v-for="voice in loadedVoicesWithFilter"
                :value="voice.voiceURI"
                :key="voice.voiceURI"
              >
                {{ getEmoji(voice.lang) }} {{ voice.name }}
              </option>
            </b-select>
            <!--
            <b-button
              type="is-ghost"
              @click="loadedVoicesFilterState = !loadedVoicesFilterState"
            >
              {{ loadedVoicesFilterState ? $t("ShowMore") : $t("ShowLess") }}
            </b-button> -->
            <b-button
              class="speakButton"
              type="is-success"
              icon-right="volume-high"
              @click="
                playSentenceInLanguage(getUserLang, voiceURI, pitch, rate)
              "
            ></b-button>
          </b-field>
          <b-field :label="$t('Pitch')">
            <b-slider
              v-model="pitch"
              :min="0"
              :max="2"
              :step="0.1"
              ticks
            ></b-slider>
          </b-field>
          <b-field :label="$t('Rate')">
            <b-slider
              v-model="rate"
              :min="0.4"
              :max="1.6"
              :step="0.05"
              ticks
            ></b-slider>
          </b-field>
          <!--
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
          </b-field>  -->
          <hr />
        </b-tab-item>
        <b-tab-item style="width: 100%" icon="account-group">
          <br />
          <p class="title is-4">
            {{ $t("SharingButton") }}
          </p>
          <b-field>
            <b-input
              v-model="addDirectSharer"
              expanded
              :placeholder="$t('PlaceHolderEmail')"
              type="email"
              maxlength="64"
            ></b-input>
            <b-button
              type="is-success"
              icon-right="plus"
              @click="pushToSharers()"
            />
          </b-field>
          <b-table
            v-if="directSharers.length > 0"
            :focusable="true"
            :data="directSharersObj"
            :columns="columns"
            :selected.sync="selected"
            :mobile-cards="false"
          >
          </b-table>
          <br />
          <b-button
            v-if="directSharers.indexOf(selected.username) !== -1"
            style="
              margin-top: -15px;
              border: solid;
              border-width: 1px;
              border-color: #f14668;
            "
            class="actionButtons"
            inverted
            type="is-danger"
            icon-left="delete"
            @click="removeFromSharers()"
          />
          <hr style="margin-top: 8px; margin-bottom: 8px" />
          <p class="title is-4">{{ $t("AccountDirectSharer") }}</p>
          <p class="subtitle is-6">{{ $t("AccountDirectSharerText") }}</p>
          <br />
          <div class="box">
            <b>{{
              "https://www.pictalk.org?directsharer=" +
              $store.getters.getUser.username
            }}</b>
          </div>
          <hr style="margin-top: 8px; margin-bottom: 8px" />
          <p class="title is-4">{{ $t("Groups") }}</p>
          <b-field style="margin-bottom: 0.15rem">
            <div class="columns is-multiline is-mobile">
              <div
                class="
                  card
                  column
                  is-6-mobile
                  is-4-tablet
                  is-4-desktop
                  is-4-widescreen
                  is-4-fullhd
                "
                v-for="(group, index) in mailingList"
              >
                <div class="card-content lessPadding">
                  <div class="media" style="margin-bottom: 0.25rem">
                    <div
                      class="media-left"
                      v-if="group.icon"
                      style="max-width: 16px; margin-right: 12px"
                    >
                      <b-icon :icon="group.icon" />
                    </div>
                    <div class="media-content" style="overflow-y: hidden">
                      <p class="title is-6" style="margin-bottom: 2px">
                        {{ group.name }}
                      </p>
                    </div>
                  </div>
                  <div class="groupUsers" style="margin-bottom: 15px">
                    <div
                      style="overflow-x: hidden"
                      v-for="username in group.users"
                    >
                      {{ username }}
                    </div>
                  </div>
                  <div class="columns is-mobile is-centered">
                    <div
                      class="column"
                      style="
                        padding: 0.2rem;
                        margin-left: 0.4rem;
                        margin-right: 0.8rem;
                        flex-grow: 0;
                      "
                    >
                      <b-button
                        type="is-danger"
                        expanded
                        style="width: 50px"
                        icon-right="delete"
                        @click="deleteGroup(mailingList, index)"
                      />
                    </div>
                    <div class="column" style="padding: 0.2rem">
                      <b-button
                        type="is-info"
                        expanded
                        style="width: 50px"
                        icon-right="pencil"
                        @click="openAddGroupModal(group, index)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-field>
          <br />
          <b-button
            style="margin-bottom: 45px"
            type="is-success"
            class="actionButtons"
            icon-left="plus"
            @click="openAddGroupModal()"
          />
          <hr />
        </b-tab-item>
      </b-tabs>
    </div>
    <div class="footer container is-max-desktop">
      <b-button tag="nuxt-link" :to="'/pictalk' + admin" class="menuButtons">{{
        $t("Cancel")
      }}</b-button>
      <b-button
        class="menuButtons"
        type="is-info"
        icon-left="content-save"
        :loading="loadingSave"
        @click="onSave(user.username, user.password, user.language)"
        >{{ $t("Save") }}</b-button
      >
    </div>
  </div>
</template>
<script >
import addGroupModal from "@/components/auth/addGroupModal";
import deviceInfos from "@/mixins/deviceInfos";
import emoji from "@/mixins/emoji";
import tts from "@/mixins/tts";
import lang from "@/mixins/lang";
import sharers from "@/mixins/sharers";
import navbar from "@/mixins/navbar";
import Security from "@/components/auth/securityModal";
import { convertToSimpleLanguage, isObject, mergeDeep } from "@/utils/utils";
export default {
  mixins: [deviceInfos, emoji, tts, lang, sharers, navbar],
  computed: {
    isOfflineReady() {
      return this.offlineReadyProgress == 0;
    },
    offlineImagesSavedRatio() {
      return (
        ((this.offlineReadyTotal - this.offlineReadyProgress) /
          this.offlineReadyTotal) *
        100
      );
    },
    getMailingList() {
      return this.$store.getters.getUser.mailingList?.length;
    },

    displayVoicesOrMultiLingual() {
      return this.displayVoices || Object.keys(this.user.languages).length > 1;
    },
    userMultiLingual() {
      return Object.keys(this.user.languages).length > 1;
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
      offlineReadyTotal: null,
      offlineReadyProgress: null,
      selected: {},
      loadingSave: false,
      showDirectSharerInputText: false,
      loadedVoicesFilterState: true,
      addDirectSharer: "",
      displayVoices: false,
      voices: [],
      voiceURI: "",
      pitch: 1,
      rate: 1,
      voiceURIs: [],
      checkedRows: [],
      directSharers: [],
      directSharersObj: [],
      loadingVoices: true,
      mailingList: {},
      displayedLanguage: "",
      data: [],
      tabStep: 0,
      storage: "0B",
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
    getMailingList: function (value) {
      this.mailingList = JSON.parse(
        JSON.stringify(this.$store.getters.getUser.mailingList)
      );
    },
    displayedLanguage: function (value, oldValue) {
      if (value != oldValue) {
        this.$i18n.setLocale(value);
        if (
          Object.keys(this.$store.getters.getUser.languages).indexOf(value) !=
          -1
        ) {
          if (
            Object.keys(this.$store.getters.getUser.languages[value]).indexOf(
              this.getDeviceInfo()
            ) != -1
          ) {
            this.voiceURI =
              this.$store.getters.getUser.languages[value][
                this.getDeviceInfo()
              ]?.voiceURI;
            this.pitch =
              this.$store.getters.getUser.languages[value][
                this.getDeviceInfo()
              ]?.pitch;
            this.rate =
              this.$store.getters.getUser.languages[value][
                this.getDeviceInfo()
              ]?.rate;
          } else {
            this.voiceURI = this.getLoadedVoicesWithFilter(value)[0]?.voiceURI;
          }
        } else {
          this.voiceURI = this.getLoadedVoicesWithFilter(value)[0]?.voiceURI;
        }
      }
    },
  },
  beforeUpdate() {
    if (this.tabStep == 1) {
      this.initialization = false;
    }
  },
  async created() {
    this.directSharers = [...this.user.directSharers];
    for (let sharer of this.directSharers) {
      this.directSharersObj.push({ username: sharer });
    }
    this.mailingList = [...this.user.mailingList];
    this.displayedLanguage = this.localeCode();

    const bc = new BroadcastChannel("offline-ready");
    bc.onmessage = (event) => {
      if (event.isTrusted) {
        this.offlineReadyTotal = event.data.total;
        this.offlineReadyProgress = event.data.progress;
      }
    };
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const usedStorage = (await navigator.storage.estimate()).usage;
      if (usedStorage >= 1e6) {
        this.storage = `${(usedStorage / 1e6).toFixed(1)}MB`;
      } else if (usedStorage >= 1e3) {
        this.storage = `${(usedStorage / 1e3).toFixed(1)}KB`;
      } else {
        this.storage = `${usedStorage}B`;
      }
    }
  },
  methods: {
    deleteGroup(mailingList, index) {
      let cb = function () {
        mailingList.splice(index, 1);
      };
      this.$buefy.modal.open({
        parent: this,
        component: Security,
        hasModalCard: true,
        props: {
          callback: cb,
        },
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    async openAddGroupModal(group, index) {
      this.$buefy.modal.open({
        parent: this,
        component: addGroupModal,
        props: {
          group: group,
          index: index,
          mailingList: this.mailingList,
        },
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
        canCancel: ["escape", "x"],
      });
    },
    async getLimitedUserList(group) {
      return group?.users?.slice(0, 10);
    },
    async showDirectSharerInput() {
      this.showDirectSharerInputText = !this.showDirectSharerInputText;
    },
    async deleteSelectedTrustedSources() {
      this.checkedRows.forEach((row) => {
        const index = this.directSharers.indexOf(row);
        this.directSharers.splice(index, 1);
      });
    },
    async onSave() {
      this.loadingSave = true;
      let device = {};
      let language = {};
      let languages = {};
      let editedLanguage = {};
      let editedLanguages = {};
      device[this.getDeviceInfo()] = {
        voiceURI: this.voiceURI,
        pitch: this.pitch,
        rate: this.rate,
      };
      const languageLang = convertToSimpleLanguage(
        this.voices.filter((voice) => voice.voiceURI == this.voiceURI)[0]?.lang
      );
      if (languageLang != undefined) {
        language[languageLang] = device;
        if (Object.keys(this.user.language)[0] == languageLang) {
          editedLanguage = this.user.language;
          mergeDeep(editedLanguage, language);
        } else {
          const languagesIndex = Object.keys(this.user.languages).find(
            (language) => language == languageLang
          );
          if (languagesIndex) {
            editedLanguage[languagesIndex] =
              this.user.languages[languagesIndex];
          } else {
            editedLanguage = language;
          }
        }
        this.voiceURIs.forEach((voiceURI) => {
          device = {};
          device[this.getDeviceInfo()] = {
            voiceURI: voiceURI,
            pitch: this.pitch,
            rate: this.rate,
          };
          languages[
            convertToSimpleLanguage(
              this.voices.filter((voice) => voice.voiceURI == voiceURI)[0]?.lang
            )
          ] = device;
        });
        editedLanguages = Object.assign(
          JSON.parse(JSON.stringify(this.user.languages)),
          JSON.parse(JSON.stringify(language))
        );
        if (editedLanguages?.undefined) {
          delete editedLanguages.undefined;
        }
      }
      try {
        const res = await this.$store.dispatch("editUser", {
          username: this.user.username,
          password: this.user.password,
          password: this.user.password,
          language: editedLanguage ? editedLanguage : this.user.language,
          languages: editedLanguages ? editedLanguages : this.user.languages,
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
      this.loadingSave = false;
      this.$router.push("/pictalk");
    },
  },
};
</script>
<style scoped>
.lessPadding {
  padding: 0.5rem;
  height: 80%;
}
.speakButton {
  margin-left: 0.5rem;
}
.footer {
  display: flex;
  position: fixed;
  flex-direction: row;
  padding: 0%;
  bottom: 2vw;
  width: 100%;
  background-color: #ffffff;
}
.actionButtons {
  width: 40vw;
  min-width: 200px;
  max-width: 300px;
  display: flex;
  margin-right: auto;
  margin-left: auto;
}
.menuButtons {
  margin-left: 1vmin;
  margin-right: 1vmin;
  border: solid;
  border-width: 1px;
  border-color: #4c4329;
  width: 45vw;
  max-width: 450px;
  border-radius: 7px;
  -webkit-box-shadow: 2px 2px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 2px 2px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 2px 2px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.groupUsers {
  height: 100px;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  width: 0.7vw;
  max-width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: #ffffff00;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ff5757;
  border-radius: 10px;
}
</style>
