<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<b-button
					class="button"
					type="is-danger"
					icon-left="arrow-left"
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
						alt="A boy and a girl speaking different languages"
						style="width: 40%;"
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
				</b-step-item>
        <b-step-item clickable :label="$t('Language')" icon="translate">
					<div class="contenant">
					<b-image
					class="center"
            lazy
						:srcset="require('@/assets/signup_languages.png').srcSet"
						alt="A boy and a girl speaking different languages"
						style="width: 40%;"
        ></b-image>
				</div>
					<b-field class="column" :label="$t('PrincipalVoice')">
						<b-select
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
        <b-step-item clickable :label="$t('Sharers')" icon="account-plus">
					<div class="contenant">
					<b-image
					class="center"
            lazy
						:srcset="require('@/assets/share.png').srcSet"
						alt="A boy and a girl speaking different languages"
						style="width: 40%;"
        ></b-image>
				</div>
					<b-field v-for="index in directSharers.length"
							:key="index">
						<b-input
							v-model="directSharers[index - 1]"
              type="email"
              maxlength="64"
							expanded
              :placeholder="$t('PlaceHolderEmail')"
						></b-input>
						<b-button class="is-danger" icon-left="close-circle" @click="directSharers.splice(index - 1,1)">
						</b-button>
					</b-field>
					<b-button
								type="is-primary"
								expanded
								icon-right="plus"
								@click="directSharers.push('')"
							>
							{{$t("SharingButton")}}
					</b-button>
					<br/>
					<b-notification
            type="is-info"
            has-icon
            aria-close-label="Close notification">
						{{$t("SharingExplanation")}}
        </b-notification>

				</b-step-item>
				<b-step-item clickable :label="$t('TermsAndConditions')" icon="chart-box">
					<div class="contenant">
					<b-image
					class="center"
            lazy
						:srcset="require('@/assets/terms_conditions.png').srcSet"
						alt="A boy and a girl speaking different languages"
						style="width: 40%;"
          ></b-image>
				  </div>
					<div class="field">
					<b-checkbox v-model="majority" required type="is-success">
						{{ $t("Majority") }}
					</b-checkbox>
				</div>
				<div class="field">
					<b-checkbox v-model="terms" required type="is-success">
						{{ $t("IHaveRead") }}
						<nuxt-link to="/legal-infos/terms-of-use">{{
							$t("TermsOfUse")
						}}</nuxt-link>
						{{ $t("And") }}
						<nuxt-link to="/legal-infos/privacy-policy">{{
							$t("PrivacyPolicy")
						}}</nuxt-link
						>.
					</b-checkbox>
				</div>
				</b-step-item>
        <b-step-item :clickable="!notSignedUp" :label="$t('VerifyAccount')" icon="chart-box">
					<div class="contenant">
					<b-image
					  class="center"
            lazy
						:srcset="require('@/static/20_Pictalk_Mail.gif')"
            :placeholder="require('@/assets/20_Pictalk_Mail.png').srcSet"
						alt="Email verification"
						style="width: 40%;"
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
			<footer class="modal-card-foot">
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

<script>
import axios from "axios";
import { countryCodeEmoji } from "country-code-emoji";
import frenchFries from "@/assets/frenchFries.json";
export default {
	computed: {
		loadedVoices() {
			return this.voices.sort((x, y) => {
				let a = x.lang.toUpperCase(),
					b = y.lang.toUpperCase();
				return a == b ? 0 : a > b ? 1 : -1;
			});
		},
	},
	data() {
		return {
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
			directSharers: [],
			showLanguages: false,
			activeStep: 0,
			notSignedUp: true,
			maxStep: 3,
			verificationToken: "",
			verificationLoading: false,
			signupLoading: false,
			mailLoading: false,
		};
	},
	async created() {
		const allVoicesObtained = new Promise(function (resolve, reject) {
			try {
				let voices = window.speechSynthesis.getVoices();
				if (voices.length !== 0) {
					resolve(voices);
				} else {
					window.speechSynthesis.addEventListener(
						"voiceschanged",
						function () {
							try {
								voices = window.speechSynthesis.getVoices();
							} catch (err) {
								reject(err);
							}
							if (!voices) {
								reject();
							}
							resolve(voices);
						}
					);
				}
			} catch (err) {
				reject(err);
			}
		});
		allVoicesObtained.then((voices) => {
			console.log(voices);
			console.log(this.localeIso());
			this.voices = voices;
			this.voiceURI = this.voices.filter(
				(voice) => voice.lang == this.localeIso()
			)[0]?.voiceURI;
			this.loadingVoices = false;
		});
	},
	watch: {
		voiceURI: {
			handler: function (v) {
				this.voiceURIs = [];
				this.voiceURIs.push(v);
				if (!this.loadingVoices && !this.initialization) {
					this.playSentenceInLanguage(
						this.voices.filter((voice) => voice.voiceURI == v)[0]
							?.lang,
						v
					);
				}
			},
			deep: true,
		},
		voiceURIs(newValue, oldValue) {
			if (newValue.length > oldValue.length && newValue.length > 1) {
				const v = newValue.filter(
					(ai) => oldValue.indexOf(ai) == -1
				)[0];
				if (!this.loadingVoices && !this.initialization) {
					this.playSentenceInLanguage(
						this.voices.filter((voice) => voice.voiceURI == v)[0]
							?.lang,
						v
					);
				}
			}
		},
	},
	beforeUpdate() {
		this.initialization = false;
	},
	methods: {
		nextStep() {
			this.activeStep += 1;
		},
		previousStep() {
			this.activeStep -= 1;
		},
		localeIso() {
			return this.$i18n.locales.filter(
				(i) => i.code == this.$i18n.locale
			)[0].iso;
		},
		convertToSimpleLanguage(language) {
			return language.replace(/[^a-z]/g, "");
		},
		getDeviceInfo() {
			return (
				this.getOSInfo() +
				window.screen.height +
				window.screen.width +
				window.devicePixelRatio
			);
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
			if (window.navigator.userAgent.indexOf("Mac") != -1)
				return "Mac/iOS";
			if (window.navigator.userAgent.indexOf("X11") != -1) return "UNIX";
			if (window.navigator.userAgent.indexOf("Linux") != -1)
				return "Linux";
		},
		async playSentenceInLanguage(lang, voiceURI) {
			let translatedText =
				frenchFries[this.convertToSimpleLanguage(lang)];
			this.pronounce(translatedText, lang, voiceURI);
		},
		localeCode() {
			return this.$i18n.locales.filter(
				(i) => i.code == this.$i18n.locale
			)[0].code;
		},
		async pronounce(speech, lang, voiceURI) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = speech;
				let voice = this.voices.filter(
					(voice) => voice.voiceURI == voiceURI
				);
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
		getEmoji(language) {
			if (language?.match(/[a-z]{2}-[A-Z]{2}/g)) {
				return countryCodeEmoji(language.split("-")[1]);
			}
			return;
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
					duration: 5000,
					message: this.$t("PleaseCompleteForm"),
					position: "is-top-right",
					type: "is-info",
					hasIcon: true,
					icon: "account",
				});
				return;
			}
			if (this.passwordConfirmation != this.password) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("PasswordNotCorrespond"),
					position: "is-top-right",
					type: "is-warning",
					hasIcon: true,
					icon: "key",
				});
				return;
			}
			//let device, language, languages = {};
			let device = {};
			let language = {};
			let languages = {};
			device[this.getDeviceInfo()] = {
				voiceURI: this.voiceURI,
				pitch: "",
			};
			language[
				this.voices.filter(
					(voice) => voice.voiceURI == this.voiceURI
				)[0]?.lang
			] = device;
			Object.assign(languages, language);
			this.voiceURIs.forEach((voiceURI) => {
				device[this.getDeviceInfo()] = {
					voiceURI: voiceURI,
					pitch: "",
				};
				languages[
					this.voices.filter(
						(voice) => voice.voiceURI == voiceURI
					)[0]?.lang
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
				});
				if (res.status == 201) {
					this.notSignedUp = false;
					this.maxStep = 4;
					this.activeStep = 4;
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: this.$t("AccountCreated"),
						position: "is-top-right",
						type: "is-success",
						hasIcon: true,
					});
				}
				this.signupLoading = false;
			} catch (error) {
				if (error.response) {
					if (
						error.response.status == 400 ||
						error.response.status == 401
					) {
						const notif = this.$buefy.notification.open({
							duration: 5000,
							message: this.$t("ParametersInvalid"),
							position: "is-top-right",
							type: "is-danger",
							hasIcon: true,
							icon: "account",
						});
					} else {
						if (error.response.status == 409) {
							const notif = this.$buefy.notification.open({
								duration: 5000,
								message: this.$t("EmailAlreadyInUse"),
								position: "is-top-right",
								type: "is-danger",
								hasIcon: true,
								icon: "mail",
							});
						} else {
							const notif = this.$buefy.notification.open({
								duration: 5000,
								message: this.$t("ServerOffline"),
								position: "is-top-right",
								type: "is-danger",
								hasIcon: true,
								icon: "account",
							});
						}
					}
				} else {
					const notif = this.$buefy.notification.open({
						duration: 5000,
						message: this.$t("ServerOffline"),
						position: "is-top-right",
						type: "is-danger",
						hasIcon: true,
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
						duration: 5000,
						message: this.$t("VerificationSuccess"),
						position: "is-top-right",
						type: "is-success",
					});
					this.$parent.close();
					this.$router.push("/pictalk");
					await this.$store.dispatch("authenticateUser", {
						username: this.username,
						password: this.password,
						isLogin: true,
					});
				}
			} catch (error) {
				if (error.response) {
					if (error.response.status == 401) {
						const notif = this.$buefy.notification.open({
							duration: 4000,
							message: this.$t("VerificationToken"),
							position: "is-top-right",
							type: "is-danger",
							hasIcon: true,
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
						duration: 5000,
						message: this.$t("VerificationMoreMailSuccess"),
						position: "is-top-right",
						type: "is-info",
						hasIcon: true,
						icon: "email-check-outline",
					});
				}
				this.mailLoading = false;
			} catch (error) {
				const notif = this.$buefy.notification.open({
					duration: 5000,
					message: this.$t("VerificationMoreMailFail"),
					position: "is-top-right",
					type: "is-danger",
					hasIcon: true,
					icon: "email-remove-outline",
				});
				this.mailLoading = false;
			}
		},
	},
};
</script>
<style>
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
</style>