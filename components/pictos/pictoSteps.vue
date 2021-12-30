<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<b-button
					class="button"
					type="button"
					icon-left="arrow-left"
					@click="$parent.close()"
				/>

				<p v-if="create" align="center" class="modal-card-title">
					{{ $t("CreatePictogram") }}
				</p>
				<p v-else align="center" class="modal-card-title">
					{{ $t("EditPictogram") }}
				</p>
			</header>
			<section class="modal-card-body">
				<b-steps
					v-model="activeStep"
					rounded
					animated
					:has-navigation="false"
					mobile-mode="compact"
					label-position="bottom"
				>
					<b-step-item step="1" :label="$t('Image')" clickable>
						<div v-if="picto.path">
							<img
								class="mini-image"
								style
								:src="picto.path"
								crossorigin="anonymous"
							/>
						</div>

						<b-field :label="$t('Search')">
							<b-input
								type="text"
								v-model="pictoSearch"
								:placeholder="$t('SearchNotice')"
								expanded
								:autofocus="true"
								@keyup.native.enter="
									pictoExtractImg(pictoSearch)
								"
							></b-input>
							<b-button
								type="is-success"
								icon-right="magnify"
								:loading="loading"
								@click="pictoExtractImg(pictoSearch)"
							/>
						</b-field>
						<br />
						<div class="columns is-multiline is-mobile">
							<Webpicto
								class="
									column
									is-one-third-mobile
									is-one-quarter-tablet
									is-one-quarter-desktop
									is-one-quarter-widescreen
									is-one-fifth-fullhd
									containing
									has-background
								"
								v-for="picto in paginate"
								:key="picto.src"
								:webpicto="picto"
								@uploadfile="uploadfile($event)"
							/>
						</div>
						<b-pagination
							v-if="images.length > imgLimit"
							:total="images.length"
							v-model="page"
							:range-before="0"
							:range-after="0"
							:order="'is-centered'"
							:rounded="true"
							:per-page="imgLimit"
							:icon-prev="'chevron-left'"
							:icon-next="'chevron-right'"
						>
						</b-pagination>
						<div>
							<b-field :label="$t('OrUploadYourOwn')">
								<section>
									<b-field class="file">
										<b-upload
											v-model="file"
											accept="image/png, image/jpeg, image/gif, image/jpg"
											native
											expanded
											required
										>
											<a
												class="
													button
													is-primary is-fullwidth
												"
											>
												<b-icon icon="upload"></b-icon>
												<span>{{
													file.name ||
													$t("ClickToUpload")
												}}</span>
											</a>
										</b-upload>
									</b-field>
									<b-field>
										<b-upload
											v-model="file"
											accept="image/png, image/jpeg, image/gif, image/jpg"
											native
											drag-drop
											expanded
										>
											<section class="section">
												<div
													class="
														content
														has-text-centered
													"
												>
													<p>
														<b-icon
															icon="upload"
															size="is-large"
														></b-icon>
													</p>
													<p>
														{{ $t("DropFiles") }}
													</p>
												</div>
											</section>
										</b-upload>
									</b-field>
									<div v-if="file.name" class="tags">
										<span class="tag is-primary is-medium">
											{{ file.name }}
											<button
												class="delete is-medium"
												type="button"
												@click="discardfile()"
											></button>
										</span>
									</div>
								</section>
							</b-field>
						</div>
					</b-step-item>
					<b-step-item step="2" :label="$t('Speech')" clickable>
						<h1 class="title has-text-centered">
							{{ $t("Speech") }}
							<b-dropdown aria-role="list">
								<template #trigger="{ active }">
									<b-button>{{
										getEmoji(languageSelectorSpeech)
									}}</b-button>
								</template>

								<b-dropdown-item
									v-for="language in getAllUserLanguages"
									:key="language"
									aria-role="listitem"
									@click="switchSpeechLanguage(language)"
									>{{ getEmoji(language) }}</b-dropdown-item
								>
							</b-dropdown>
						</h1>
						<b-field :label="$t('Speech')">
							<b-input
								type="text"
								v-model="picto.speech[languageSelectorSpeech]"
								:placeholder="$t('SpeechNotice')"
								expanded
							></b-input>
							<b-button
								type="is-success"
								icon-right="message"
								@click="
									pronounce(
										picto.speech[languageSelectorSpeech]
									)
								"
							></b-button>
						</b-field>
						<b-field :label="$t('Meaning')">
							<b-input
								type="text"
								v-model="picto.meaning[languageSelectorSpeech]"
								:placeholder="$t('MeaningNotice')"
								expanded
							></b-input>
						</b-field>
						<b-field :label="$t('Color')">
							<b-input
								type="color"
								v-model="picto.color"
								:placeholder="$t('ColorNotice')"
								required
							></b-input>
						</b-field>
						{{ picto }}
					</b-step-item>
				</b-steps>
			</section>
			<footer class="modal-card-foot">
				<div class="container">
					<div class="columns is-mobile is-full">
						<div class="column">
							<b-button
								@click="previousStep()"
								:disabled="activeStep == 0"
								class="button center"
								type="button"
								icon-right="chevron-left"
							/>
						</div>
						<div class="column is-half">
							<b-button
								:disabled="
									!(
										picto.speech &&
										picto.meaning &&
										picto.color &&
										file.name
									)
								"
								class="is-success"
								:icon-right="iconPictoOrEdit"
								@click="onSubmitted(false)"
							>
							</b-button>
							<b-button
								class="is-success"
								:disabled="
									!(
										picto.speech &&
										picto.meaning &&
										picto.color &&
										file.name
									)
								"
								:icon-right="iconCollectionOrEdit"
								@click="onSubmitted(true)"
							>
							</b-button>
						</div>
						<div class="column">
							<b-button
								class="center"
								:disabled="activeStep == 1"
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
const jpegasus = require("jpegasus");
import axios from "axios";
import Webpicto from "@/components/pictos/webpicto";
import { countryCodeEmoji, emojiCountryCode } from "country-code-emoji";
export default {
	name: "PictoSteps",
	components: {
		Webpicto,
	},
	props: {
		picto: {
			type: Object,
			required: false,
			default: () => ({
				speech: new Object(),
				meaning: new Object(),
				color: 0,
			}),
		},
		create: {
			type: Boolean,
			required: false,
			default: () => false,
		},
	},
	computed: {
		iconPictoOrEdit() {
			return this.create ? "image" : "image-edit";
		},
		iconCollectionOrEdit() {
			return this.create ? "folder-multiple-image" : "image-edit";
		},
		paginate() {
			return this.images.slice(
				(this.page - 1) * this.imgLimit,
				(this.page - 1) * this.imgLimit + this.imgLimit
			);
		},
		getAllUserLanguages() {
			return this.$store.getters.getUser.languages;
		},
	},
	data() {
		return {
			page: 1,
			imgLimit: 20,
			pictoSearch: "",
			activeStep: 0,
			languages: [],
			languageSelectorSpeech: "",
			selectedOption: "",
			pictoSearch: "",
			file: {},
			highQuality: this.$t("StandardQuality"),
			size: 0,
			images: [],
			loading: false,
		};
	},
	created() {
		this.languageSelectorSpeech = this.getUserLang(true);
	},
	methods: {
		switchSpeechLanguage(language) {
			this.languageSelectorSpeech = language;
		},
		getEmoji(language) {
			return countryCodeEmoji(language.split("-")[1]);
		},
		nextStep() {
			this.activeStep += 1;
		},
		previousStep() {
			this.activeStep -= 1;
		},
		async pronounce(speech) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = speech;
				let voice = this.languages.filter(
					(voice) => voice.lang == this.languageSelectorSpeech
				);
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
		async onSubmitted(isCollection = false) {
			let meaning;
			let cfile;
			let speech;
			if (Object.values(this.picto.meaning).length == 0) {
				this.$buefy.notification.open({
					message: this.$t("MeaningEmpty"),
					type: "is-danger",
				});
			}
			if (this.create && !this.file.name) {
				this.$buefy.notification.open({
					message: this.$t("MissingImage"),
					type: "is-danger",
				});
				return;
			}
			try {
				if (this.file.name) {
					if (!this.file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
						this.$buefy.notification.open({
							message: this.$t("ImageFiles"),
							type: "is-warning",
						});
						return;
					}

					const myNewFile = new File(
						[this.file],
						this.file.name.substr(
							0,
							this.file.name.lastIndexOf(".")
						) + ".jpeg",
						{ type: this.file.type }
					);
					cfile = await jpegasus.compress(myNewFile, {
						maxHeight: 500,
						maxWidth: 500,
						quality: 0.15,
					});
				}
				meaning = Object.keys(this.picto.meaning).map((key) => {
					return { language: key, text: this.picto.meaning[key] };
				});
				speech = Object.keys(this.picto.speech).map((key) => {
					return { language: key, text: this.picto.speech[key] };
				});
				if (this.create) {
					await this.$store.dispatch(
						isCollection ? "addCollection" : "addPicto",
						{
							speech: speech,
							meaning: meaning,
							color: this.picto.color,
							share: 1,
							fatherCollectionId: parseInt(
								this.$route.params.fatherCollectionId,
								10
							),
							image: cfile,
						}
					);
					this.$buefy.notification.open({
						message: isCollection
							? this.$t("CreatedCollection")
							: this.$t("CreatedPictogram"),
						type: "is-success",
					});
				} else {
					const res = await this.$store.dispatch(
						isCollection ? "editCollection" : "editPicto",
						{
							editedPicto: {
								id: this.picto.id,
								speech: speech,
								meaning: meaning,
								folder: folder,
								image: file.name ? cfile : undefined,
								fatherId: parseInt(
									this.$route.params.fatherId,
									10
								),
							},
							collectionId: parseInt(
								this.$route.params.collectionId,
								10
							),
						}
					);
					this.$buefy.notification.open({
						message: isCollection
							? this.$t("EditedCollection")
							: this.$t("EditedPictogram"),
						type: "is-success",
					});
				}
			} catch (err) {
				console.log(err);
				this.$buefy.notification.open({
					message: this.$t("SomeThingBadHappened"),
					type: "is-danger",
				});
			}
			this.$emit("close");
		},
		getUserLang(detailled = false) {
			const user = this.$store.getters.getUser;
			if (user.language && !detailled) {
				return user.language.replace(/[^a-z]/g, "");
			} else if (user.language && detailled) {
				return user.language;
			} else {
				return this.$i18n.getLocaleCookie();
			}
		},
		async flickrExtractImg(pictoSearch) {
			if (!this.$config.flickrAPIKey) {
				return;
			}
			let responseData;
			try {
				responseData = (
					await axios.get(
						`https://www.flickr.com/services/rest/?sort=relevance&lang=${this.$store.getters.getUser.language}&method=flickr.photos.search&api_key=${this.$config.flickrAPIKey}&text=${pictoSearch}&safe_search=true&per_page=25&format=json&nojsoncallback=1`
					)
				).data.photos.photo;
				responseData.forEach((photo) => {
					this.images.push({
						src: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
						alt: photo.title,
					});
				});
			} catch (err) {
				console.log(err);
				throw new Error("Flickr not available");
			}
			this.loading = false;
		},
		async pictoExtractImg(pictoSearch) {
			const regex = new RegExp("[$&+,:;=?@#|'<>.^*()%!-]", "g");
			pictoSearch = pictoSearch.replaceAll(regex, " ");
			this.images = [];
			let responseData;
			this.loading = true;
			try {
				responseData = (
					await axios.get(
						`https://api.arasaac.org/api/pictograms/${this.getUserLang()}/search/${pictoSearch}`
					)
				).data;
				for (let i = 0; i < responseData.length; i++) {
					this.images.push({
						src: `https://api.arasaac.org/api/pictograms/${responseData[i]["_id"]}?color=true&resolution=500&download=false`,
						alt: responseData[i]["keywords"][0]
							? responseData[i]["keywords"][0]["keyword"]
							: responseData[i]["categories"][0],
					});
				}
				if (responseData.length < 3) {
					this.flickrExtractImg(pictoSearch);
				} else {
					this.loading = false;
				}
			} catch (error) {
				console.log(error);
				if (error.response && error.response.status == 404) {
					this.flickrExtractImg(pictoSearch);
				} else {
					this.loading = false;
				}
			}
		},
		uploadfile(file) {
			this.picto.speech[this.languageSelectorSpeech] = file.name
				.replaceAll("-", " ")
				.replace(/\.[^/.]+$/, "");
			this.picto.meaning[this.languageSelectorSpeech] = file.name
				.replaceAll("-", " ")
				.replace(/\.[^/.]+$/, "");
			this.file = file;
			this.activeStep = 1;
		},

		discardfile() {
			this.file = {};
			this.activeStep = 0;
		},
	},
};
</script>
<style scoped>
.has-background {
	border-radius: 3px;
	-webkit-box-shadow: 0px 0px 1px 1px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
	-moz-box-shadow: 0px 0px 1px 1px #ccc; /* Firefox 3.5 - 3.6 */
	box-shadow: 0px 0px 1px 1px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.containing {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.image {
	margin: auto;
}
.mini-image {
	display: block;
	margin-left: auto;
	margin-right: auto;
	max-height: 15rem;
}
.adminMenu {
	align-self: flex-end;
	margin: 0 auto;
	margin-top: auto;
}
.center {
	display: block;
	margin-left: auto;
	margin-right: auto;
}
</style>
