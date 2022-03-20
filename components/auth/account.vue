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
					<b-field>
						<b-switch v-model="user.settings.travelMode">{{
							$t("TravelerMode")
						}}</b-switch>
					</b-field>
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
								v-for="voice in loadedVoicesFilterState
									? loadedVoicesWithFilter
									: loadedVoices"
								:value="voice.voiceURI"
								:key="voice.voiceURI"
							>
								{{ getEmoji(voice.lang) }} {{ voice.name }}
							</option>
						</b-select>
						<b-button
							type="is-ghost"
							@click="
								loadedVoicesFilterState =
									!loadedVoicesFilterState
							"
						>
							{{
								loadedVoicesFilterState
									? $t("ShowMore")
									: $t("ShowLess")
							}}
						</b-button>
					</b-field>
					{{ voiceURI }}
					<b-button
						v-if="!displayVoicesOrMultiLingual"
						@click="displayVoices = !displayVoices"
						type="is-ghost"
						>{{ $t("SpeakMoreLanguage") }}</b-button
					>
					<b-field
						v-if="displayVoicesOrMultiLingual"
						:label="$t('Voices')"
					>
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
							:loading="loading"
							@click="pushToSharers()"
						/>
					</b-field>
					<b-table
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
						class="fourWidth"
						type="is-danger"
						icon-left="delete"
						@click="removeFromSharers()"
					/>
					<p class="title is-4">{{ $t("Groups") }}</p>
					<b-field>
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
									<div class="media">
										<div
											class="media-left"
											v-if="group.icon"
										>
											<b-icon :icon="group.icon" />
										</div>
										<div
											class="media-content"
											style="overflow-y: hidden"
										>
											<p class="title is-6">
												{{ group.name }}
											</p>
										</div>
									</div>
									<div style="column-count: 2">
										<div
											v-for="username in group.users.slice(
												0,
												10
											)"
										>
											{{ username }}
										</div>
									</div>
									...
									<div class="columns is-mobile is-centered">
										<div class="container column">
											<b-button
												type="is-danger"
												expanded
												icon-right="delete"
												@click="
													mailingList.splice(index, 1)
												"
											/>
										</div>
										<div class="container column">
											<b-button
												type="is-info"
												expanded
												icon-right="pencil"
												@click="
													openAddGroupModal(
														group,
														index
													)
												"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</b-field>
					<br />
					<b-button
						class="is-success"
						icon-left="plus"
						expanded
						@click="openAddGroupModal()"
					/>
					<hr />
				</b-tab-item>
			</b-tabs>
		</div>
		<div class="container is-max-desktop footer">
			<b-button
				tag="nuxt-link"
				:to="'/pictalk' + admin"
				class="fourWidth has-background"
				>{{ $t("Cancel") }}</b-button
			>
			<b-button
				class="sixWidth has-background"
				type="is-info"
				icon-left="content-save"
				@click="onSave(user.username, user.password, user.language)"
				>{{ $t("Save") }}</b-button
			>
		</div>
	</div>
</template>
<script >
import merge from "lodash.merge";
import addGroupModal from "@/components/auth/addGroupModal";
import deviceInfos from "@/mixins/deviceInfos";
import emoji from "@/mixins/emoji";
import tts from "@/mixins/tts";
import lang from "@/mixins/lang";
import sharers from "@/mixins/sharers";
import navbar from "@/mixins/navbar";
import { convertToSimpleLanguage } from "@/utils/utils";
export default {
	mixins: [deviceInfos, emoji, tts, lang, sharers, navbar],
	computed: {
		getMailingList() {
			return this.$store.getters.getUser.mailingList.length;
		},

		displayVoicesOrMultiLingual() {
			return (
				this.displayVoices ||
				Object.keys(this.user.languages).length > 1
			);
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
			selected: {},
			loading: false,
			showDirectSharerInputText: false,
			loadedVoicesFilterState: true,
			addDirectSharer: "",
			displayVoices: false,
			voices: [],
			voiceURI: "",
			voiceURIs: [],
			checkedRows: [],
			directSharers: [],
			directSharersObj: [],
			loadingVoices: true,
			mailingList: {},
			displayedLanguage: "",
			data: [],
			tabStep: 0,
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
					Object.keys(this.$store.getters.getUser.languages).indexOf(
						value
					) != -1
				) {
					if (
						Object.keys(
							this.$store.getters.getUser.languages[value]
						).indexOf(this.getDeviceInfo()) != -1
					) {
						this.voiceURI =
							this.$store.getters.getUser.languages[value][
								this.getDeviceInfo()
							]?.voiceURI;
					} else {
						this.voiceURI =
							this.getLoadedVoicesWithFilter(value)[0]?.voiceURI;
					}
				} else {
					this.voiceURI =
						this.getLoadedVoicesWithFilter(value)[0]?.voiceURI;
				}
			}
		},
	},
	beforeUpdate() {
		if (this.tabStep == 1) {
			this.initialization = false;
		}
	},
	created() {
		this.directSharers = [...this.user.directSharers];
		this.mailingList = [...this.user.mailingList];
		this.displayedLanguage = this.localeCode();
	},
	methods: {
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
			let device = {};
			let language = {};
			let languages = {};
			let editedLanguage = {};
			let editedLanguages = {};
			device[this.getDeviceInfo()] = {
				voiceURI: this.voiceURI,
				pitch: "",
			};
			const languageLang = convertToSimpleLanguage(
				this.voices.filter(
					(voice) => voice.voiceURI == this.voiceURI
				)[0]?.lang
			);
			if (languageLang != "undefined") {
				language[languageLang] = device;
				if (Object.keys(this.user.language)[0] == languageLang) {
					editedLanguage = Object.assign(
						{},
						JSON.parse(JSON.stringify(this.user.language))
					);
					merge(editedLanguage, language);
				} else {
					const languagesIndex = Object.keys(
						this.user.languages
					).find((language) => language == languageLang);
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
						pitch: "",
					};
					languages[
						convertToSimpleLanguage(
							this.voices.filter(
								(voice) => voice.voiceURI == voiceURI
							)[0]?.lang
						)
					] = device;
				});
				editedLanguages = Object.assign(
					{},
					JSON.parse(JSON.stringify(this.user.languages))
				);
				merge(editedLanguages, languages);
			}
			try {
				const res = await this.$store.dispatch("editUser", {
					username: this.user.username,
					password: this.user.password,
					password: this.user.password,
					language: editedLanguage
						? editedLanguage
						: this.user.language,
					languages: editedLanguages
						? editedLanguages
						: this.user.languages,
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
	width: 40%;
}
.sixWidth {
	width: 50%;
}
.lessPadding {
	padding: 0.5rem;
}
.footer {
	display: flex;
	position: fixed;
	flex-direction: row;
	padding: 0%;
	bottom: 2%;
	width: 100%;
	background-color: #ffffff;
}
.has-background {
	border-radius: 5px;
	-webkit-box-shadow: 2px 2px 2px 2px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
	-moz-box-shadow: 2px 2px 2px 2px #ccc; /* Firefox 3.5 - 3.6 */
	box-shadow: 2px 2px 2px 2px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
</style>
