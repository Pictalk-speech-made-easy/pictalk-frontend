<template>
	<form action>
		<div class="modal-card" >
			<header class="modal-card-head" >
				<b-button
					class="button"
					type="is-danger"
					icon-left="close"
					@click="$parent.close()"
				/>
				<p align="center" class="modal-card-title">{{ $t("SignUp") }}</p>
			</header>
			<section class="modal-card-body">
				<div class="container">
				<b-steps
					v-model="activeStep"
					rounded
					animated
					:has-navigation="false"
					mobile-mode="compact"
					label-position="bottom">
        <b-step-item clickable :label="$t('Account')" icon="account-key">
					<div class="contenant">
					<b-image
					class="center"
            lazy
						:srcset="require('@/assets/credentials.png').srcSet"
						alt="drawing of a key openning a locked chest"
						style="width: 40%; aspect-ratio: 1/1"
        ></b-image>
				</div>
					<b-field :label="$t('Email')">
					<b-input
						type="email"
            maxlength="64"
						v-model="username"
						:placeholder="$t('PlaceHolderEmail')"
						required
					></b-input>
				</b-field>
				<b-field :label="$t('Password')">
					<b-input
						type="password"
						v-model="password"
						password-reveal
						:placeholder="$t('PlaceHolderPassword')"
						required
						minlength="8"
						pattern="((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
						validation-message="At least one captial letter, one digit and a password minimum length of 8"
					></b-input>
				</b-field>
				<b-field :label="$t('ConfirmPassword')">
					<b-input
						type="password"
						password-reveal
						:placeholder="$t('PlaceHolderPassword')"
						required
						minlength="8"
						v-model="passwordConfirmation"
					></b-input>
				</b-field>
        <div v-if="directSharerUrlEncoded" class="box">
          <h2 class="subtitle" align="center">{{ $t("SignupSupervisor") }}</h2>
          {{ $t('SignupSupervisorText')}}
          <div v-if="isArraydirectSharerUrlEncoded">
          <div  v-for="directsharer in directSharerUrlEncoded">
            <b>{{ directsharer }}</b>
          </div>
          </div>
          <div v-else><b>{{ directSharerUrlEncoded }}</b></div>
          <b-button class="is-danger" icon-left="delete" @click="removeDirectSharer()">{{$t('SignupSupervisorRemove')}}</b-button>
        </div>
				</b-step-item>
        <b-step-item clickable :label="$t('Language')" icon="translate">
					<div class="contenant">
					<b-image
					class="center"
            lazy
						:srcset="require('@/assets/signup_languages.png').srcSet"
						alt="A boy and a girl speaking different languages"
						style="width: 40%; aspect-ratio: 1/1"
        ></b-image>
				</div>
					<b-field class="column" :label="$t('PrincipalVoice')">
						<b-select
              v-if="loadedVoices && loadedVoices.length > 1"
							v-model="voiceURI"
							:placeholder="$t('SelectVoice')"
							required
							expanded
							:loading="loadingVoices"
							size="is-small"
						>
							<option
								v-for="voice in loadedVoices"
								:value="voice.voiceURI"
								:key="voice.voiceURI"
							>
								{{getEmoji(voice.lang)}} {{voice.name}}
							</option>
						</b-select>
            <div v-else>
              <div class="notification">
                <installVoice></installVoice>
              </div>
            </div>
					</b-field>
					<b-button @click="showLanguages = !showLanguages" type="is-ghost">{{ $t('SpeakMoreLanguage')}}</b-button>
					<b-field v-if="showLanguages" class="column" :label="$t('Voices')">
						<b-select
							v-model="voiceURIs"
							:placeholder="$t('SelectVoice')"
							required
							multiple
							expanded
							native-size="6"
							size="is-small"
							:loading="loadingVoices"
						>
							<option
								v-for="voice in loadedVoices"
								:value="voice.voiceURI"
								:key="voice.voiceURI"
							>
								{{ getEmoji(voice.lang) }} {{voice.name}}
							</option>
						</b-select>
					</b-field>
				</b-step-item clickable>
        <b-step-item clickable :label="$t('StarterPack')" icon="web">
          <div class="contenant columns is-mobile" style="width: 100%; aspect-ratio: 3/1; margin-left: 0%; margin-right: 0%">
            <div v-for="bundle in publicBundles" class="column is-4" style="padding: 2px">
                <div  @click="selectPublicBundle(bundle.id)">
                  <b-image class="has-background" :style="bundle.id == selectedBundle ? 'opacity:100%;' : 'opacity:60%; filter: grayscale(60%);'" :src="bundle.image"></b-image>
              </div>
            </div>
          </div>
          <div v-if="!selectedBundle" class="notification">
            {{$t('PublicBundleDescription')}}
          </div>
          <div class="notification" v-else>
            <div v-if="getBundleLevelById(selectedBundle) == 'levelA'">
                      {{$t('PublicBundleLevelADescription')}}
                    </div>
                    <div v-if="getBundleLevelById(selectedBundle) == 'levelB'">
                      {{$t('PublicBundleLevelBDescription')}}
                    </div>
                    <div v-if="getBundleLevelById(selectedBundle) == 'levelC'">
                      {{$t('PublicBundleLevelCDescription')}}
                    </div>
          </div>
        </b-step-item>
				<b-step-item clickable :label="$t('TermsAndConditions')" icon="chart-box">
					<div class="contenant">
					<b-image
					class="center"
            lazy
						:srcset="require('@/assets/terms_conditions.png').srcSet"
						alt="A paper and a pencil representing the terms and conditions"
						style="width: 40%; aspect-ratio: 1/1"
          ></b-image>
				  </div>
					<div style="display: flex; flex-dirrection : column; margin-bottom: 1em;">
					<b-checkbox-button v-model="majority" :native-value="true" type="is-success">
            <b-icon v-if="majority" icon="check" style="margin-left: auto; margin-right: auto; border: solid; border-width: 1px; border-color: #4c43293f"></b-icon>
					</b-checkbox-button>
          <p>
          {{ $t("Majority") }}
          </p>
				</div>
				<div style="display: flex; flex-dirrection : column">
					<b-checkbox-button v-model="terms" :native-value="true" type="is-success">
            <b-icon v-if="terms" icon="check" style="margin-left: auto; margin-right: auto; border: solid; border-width: 1px; border-color: #4c43293f"></b-icon>
					</b-checkbox-button>
          <p>
          {{ $t("IHaveRead") }}
						<nuxt-link to="/legal-infos/terms-of-use">{{
							$t("TermsOfUse")
						}} </nuxt-link>
						{{ $t("And") }}
						<nuxt-link to="/legal-infos/privacy-policy">{{
							$t("PrivacyPolicy")
						}}</nuxt-link
						>.
          </p>
				</div>
				</b-step-item>
        <b-step-item :clickable="!notSignedUp" :label="$t('VerifyAccount')" icon="chart-box">
					<div class="contenant">
					<b-image
					  class="center"
            lazy
						:srcset="require('@/static/20_Pictalk_Mail.gif')"
						alt="A letter with a message from Pictalk inside of it"
						style="width: 55%; aspect-ratio: 1/1"
        ></b-image>
          </div>
          <b-field>
            <b-input
            :placeholder="$t('VerifyAccountVerificationCode')"
            v-model="verificationToken"
            expanded
            size="is-medium"
            required
            :loading="verificationLoading"
            maxlength="40"
            icon-right="key"
            ></b-input>
        </b-field>
          <p class="is-size-5 notification" align="justify">
						 {{ $t('VerifyAccountText')}}
					</p>

        <b-button
        type="is-text"
        :loading="mailLoading"
        @click="sendAnotherMail()"
        >{{$t("VerificationMoreMail")}}</b-button>
				</b-step-item>
    		</b-steps>
				</div>

				<br />

			</section>
			<footer class="modal-card-foot" >
				<div class="container">
				<div class="columns is-mobile is-full">
					<div class="column is-one-quarter">
							<b-button
								@click="previousStep()"
								:disabled="activeStep == 0"
								class="button center"
								icon-right="chevron-left"
							/>
						</div>
						<div class="column is-half">
						<b-button v-if="notSignedUp"
					class="is-primary fullWidth"
          :loading="signupLoading"
					:disabled="!(username && password && majority && terms && passwordConfirmation && notSignedUp)"
					@click="
						onSubmit(
							username,
							password,
							majority,
							terms,
							passwordConfirmation
						)
					"
					>{{ $t("SignUp") }}</b-button
				><b-button v-else
					class="is-success fullWidth"
					:disabled="(notSignedUp) || (verificationToken.length!=40)"
					@click="
						onVerify()
					"
					>{{ $t("VerifyAccountOK") }}</b-button
				>
						</div>
						<div class="column is-one-quarter">
							<b-button
								class="center"
								:disabled="activeStep == maxStep"
								@click="nextStep()"
								icon-right="chevron-right"
							/>
						</div>
				</div>
				</div>
			</footer>
		</div>
	</form>
</template>

<script >
import installVoice from "@/components/pictos/installVoice";
import axios from "axios";
import lang from "@/mixins/lang";
import sharers from "@/mixins/sharers";
import tts from "@/mixins/tts";
import deviceInfos from "@/mixins/deviceInfos";
import emoji from "@/mixins/emoji";
import { convertToSimpleLanguage } from "@/utils/utils";
export default {
  components: {
    installVoice,
  },
  mixins: [deviceInfos, emoji, tts, lang, sharers],
  props: {
    recoverCode: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    credentials: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      selectedBundle: null,
      username: "",
      password: "",
      voiceURI: "",
      voices: [],
      voiceURIs: [],
      terms: false,
      majority: false,
      initialization: true,
      passwordConfirmation: "",
      loadingVoices: true,
      showLanguages: false,
      activeStep: 0,
      notSignedUp: true,
      maxStep: 3,
      verificationToken: "",
      verificationLoading: false,
      signupLoading: false,
      mailLoading: false,
      table: false,
      selected: {},
      loading: false,
      directSharers: [],
      directSharersObj: [],
      addDirectSharer: "",
      columns: [
        {
          field: "username",
          label: "",
          searchable: false,
        },
      ],
    };
  },
  computed: {
    publicBundles() {
      const publicBundles = this.$store.getters.getPublicBundles;
      if (publicBundles) {
        return publicBundles.map((bundle) => {
          const index = this.$store.getters.getCollections.findIndex(
            (collection) => collection.id === bundle.id
          );
          return this.$store.getters.getCollections[index];
        });
      }
    },
    directSharerUrlEncoded() {
      return this.$route.query.directsharer;
    },
    isArraydirectSharerUrlEncoded() {
      console.log(Array.isArray(this.$route.query.directsharer));
      return Array.isArray(this.$route.query.directsharer);
    },
  },
  async beforeUpdate() {
    this.initialization = false;
    if (!this.$store.getters.getPublicBundles) {
      await this.$store.dispatch("getPublicBundles");
    }
  },
  async created() {
    if (this.recoverCode) {
      this.notSignedUp = false;
      this.maxStep = 4;
      this.activeStep = 4;
      this.username = this.credentials.username;
      this.password = this.credentials.password;
    }
    await this.$store.dispatch("getPublicBundles");
    this.selectedBundle = this.$store.getters.getPublicBundles
      ? this.$store.getters.getPublicBundles[0].id
      : null;
  },
  async updated() {},
  methods: {
    removeDirectSharer() {
      this.$router.push({
        query: { ...this.$route.query, directsharer: undefined },
      });
    },
    getBundleLevelById(id) {
      return this.$store.getters.getPublicBundles?.filter(
        (publicBundle) => publicBundle.id == id
      )[0]?.level;
    },
    selectPublicBundle(id) {
      if (this.selectedBundle == id) {
        this.selectedBundle = null;
      } else {
        this.selectedBundle = id;
      }
    },
    nextStep() {
      this.activeStep += 1;
    },
    previousStep() {
      this.activeStep -= 1;
    },
    async onSubmit() {
      if (
        this.username == "" ||
        this.password == "" ||
        this.passwordConfirmation == "" ||
        this.major == false ||
        this.terms == false ||
        this.voiceURI == "" ||
        this.voiceURIs.length == 0
      ) {
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("PleaseCompleteForm"),
          position: "is-top-right",
          type: "is-info",
          hasIcon: true,
          iconSize: "is-small",
          icon: "account",
        });
        return;
      }
      if (this.passwordConfirmation != this.password) {
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("PasswordNotCorrespond"),
          position: "is-top-right",
          type: "is-warning",
          hasIcon: true,
          iconSize: "is-small",
          icon: "key",
        });
        return;
      }
      //let device, language, languages = {};
      let device = {};
      let language = {};
      let languages = {};
      if (this.directSharerUrlEncoded) {
        if (this.isArraydirectSharerUrlEncoded) {
          this.directSharers = this.directSharerUrlEncoded;
        } else {
          this.directSharers = [this.directSharerUrlEncoded];
        }
      }
      device[this.getDeviceInfo()] = {
        voiceURI: this.voiceURI,
        pitch: "",
      };
      language[
        convertToSimpleLanguage(
          this.voices.filter((voice) => voice.voiceURI == this.voiceURI)[0]
            ?.lang
        )
      ] = device;
      Object.assign(languages, language);
      this.voiceURIs.forEach((voiceURI) => {
        device[this.getDeviceInfo()] = {
          voiceURI: voiceURI,
          pitch: "",
        };
        languages[
          convertToSimpleLanguage(
            this.voices.filter((voice) => voice.voiceURI == voiceURI)[0]?.lang
          )
        ] = device;
      });
      try {
        this.signupLoading = true;
        const res = await axios.post("/auth/signup", {
          username: this.username,
          password: this.password,
          language: JSON.stringify(language),
          languages: JSON.stringify(languages),
          directSharers: this.directSharers,
          displayLanguage: this.localeCode(),
          ...(this.selectedBundle && {
            publicBundleId: String(this.selectedBundle),
          }),
        });
        if (res.status == 201) {
          this.notSignedUp = false;
          this.maxStep = 4;
          this.activeStep = 4;
          const notif = this.$buefy.notification.open({
            duration: 4500,
            message: this.$t("AccountCreated"),
            position: "is-top-right",
            type: "is-success",
            hasIcon: true,
            iconSize: "is-small",
          });
        }
        this.signupLoading = false;
      } catch (error) {
        if (error.response) {
          if (error.response.status == 400 || error.response.status == 401) {
            const notif = this.$buefy.notification.open({
              duration: 4500,
              message: this.$t("ParametersInvalid"),
              position: "is-top-right",
              type: "is-danger",
              hasIcon: true,
              iconSize: "is-small",
              icon: "account",
            });
          } else {
            if (error.response.status == 409) {
              const notif = this.$buefy.notification.open({
                duration: 4500,
                message: this.$t("EmailAlreadyInUse"),
                position: "is-top-right",
                type: "is-danger",
                hasIcon: true,
                iconSize: "is-small",
                icon: "mail",
              });
            } else {
              console.log(error);
              const notif = this.$buefy.notification.open({
                duration: 4500,
                message: this.$t("ServerOffline"),
                position: "is-top-right",
                type: "is-danger",
                hasIcon: true,
                iconSize: "is-small",
                icon: "account",
              });
            }
          }
        } else {
          console.log(error);
          const notif = this.$buefy.notification.open({
            duration: 4500,
            message: this.$t("ServerOffline"),
            position: "is-top-right",
            type: "is-danger",
            hasIcon: true,
            iconSize: "is-small",
            icon: "account",
          });
        }
        this.signupLoading = false;
      }
    },
    async onVerify() {
      this.verificationLoading = true;
      let validationUrl = `/auth/validation/${this.verificationToken}`;
      try {
        const res = await axios.get(validationUrl);
        if (res.status == 200) {
          this.verificationLoading = false;
          const notif = this.$buefy.notification.open({
            duration: 4500,
            message: this.$t("VerificationSuccess"),
            position: "is-top-right",
            type: "is-success",
          });
          this.$parent.close();

          try {
            await this.$store.dispatch("authenticateUser", {
              username: this.username,
              password: this.password,
              isLogin: true,
            });
            await this.$store.dispatch("getUser");
          } catch (error) {
            console.log("error ", error);
          }
          this.$router.push({
            path: "/tutorials/",
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status == 401) {
            const notif = this.$buefy.notification.open({
              duration: 4500,
              message: this.$t("VerificationToken"),
              position: "is-top-right",
              type: "is-danger",
              hasIcon: true,
              iconSize: "is-small",
              icon: "key",
            });
          }
          this.verificationLoading = false;
        }
      }
    },
    async sendAnotherMail() {
      let validationUrl = `/auth/validation/${this.username}`;
      try {
        this.mailLoading = true;
        const res = await axios.post(validationUrl);
        if (res.status == 201) {
          const notif = this.$buefy.notification.open({
            duration: 4500,
            message: this.$t("VerificationMoreMailSuccess"),
            position: "is-top-right",
            type: "is-info",
            hasIcon: true,
            iconSize: "is-small",
            icon: "email-check-outline",
          });
        }
        this.mailLoading = false;
      } catch (error) {
        const notif = this.$buefy.notification.open({
          duration: 4500,
          message: this.$t("VerificationMoreMailFail"),
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
          iconSize: "is-small",
          icon: "email-remove-outline",
        });
        this.mailLoading = false;
      }
    },
  },
};
</script>
<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.contenant {
  display: flex;
  justify-content: center;
}
.fullWidth {
  width: 100%;
}
.has-background {
  border-radius: 3px;
  -webkit-box-shadow: 1px 2px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 1px 2px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 1px 2px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
</style>
