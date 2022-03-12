<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head" style="padding: 2%">
				<b-button
					class="button"
					type="is-danger"
					icon-left="arrow-left"
					@click="$parent.close()"
				/>
				<p
					v-if="create && isPicto"
					align="center"
					class="modal-card-title"
				>
					{{ $t("CreatePictogram") }}
				</p>
				<p
					v-if="!create && isPicto"
					align="center"
					class="modal-card-title"
				>
					{{ $t("EditPictogram") }}
				</p>
				<p
					v-if="create && !isPicto"
					align="center"
					class="modal-card-title"
				>
					{{ $t("CreateCollection") }}
				</p>
				<p
					v-if="!create && !isPicto"
					align="center"
					class="modal-card-title"
				>
					{{ $t("EditCollection") }}
				</p>
			</header>
			<section id="search" class="modal-card-body scrolling">
				<b-steps
					v-model="activeStep"
					rounded
					animated
					:has-navigation="false"
					mobile-mode="compact"
					label-position="bottom"
				>
					<b-step-item
						clickable
						step="1"
						:label="$t('Image')"
						clickable
					>
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
								focused
								type="is-success"
								icon-right="magnify"
								:loading="loading"
								@click="pictoExtractImg(pictoSearch)"
							/>
						</b-field>
						<br id="searchText" />
						<div class="columns is-multiline is-mobile">
							<Webpicto
								class="
									column
									is-one-third-mobile
									is-one-quarter-tablet
									is-one-quarter-desktop
									is-one-quarter-widescreen
									is-one-quarter-fullhd
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
						<b-notification
							v-if="this.noResults"
							auto-close
							:duration="5000"
							type="is-warning is-light"
							has-icon
							aria-close-label="Close notification"
							role="alert"
						>
							{{ $t("NoResults") }}{{ this.pictoSearch }}
						</b-notification>
						<b-button
							rounded
							expanded
							v-if="!moreImages"
							type="is-success is-light is-text"
							icon-right="magnify"
							:focused="loading"
							:loading="loading"
							@click="webImages(pictoSearch)"
						>
							{{ $t("MoreImages") }}
						</b-button>
						<div>
							<br />
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
											@input="uploadfile(file)"
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
							<b-dropdown
								aria-role="list"
								v-if="getAllUserLanguages.length > 1"
							>
								<template #trigger="{ active }">
									<b-button>{{
										getEmoji(languageSelectorSpeech)
									}}</b-button>
								</template>

								<b-dropdown-item
									v-for="language in getAllUserLanguages"
									:key="language + Math.random()"
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
										picto.speech[languageSelectorSpeech],
										getUserLang,
										voiceURI
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
					</b-step-item>
				</b-steps>
			</section>
			<footer class="modal-card-foot" style="padding: 2%">
				<div class="container">
					<div class="columns is-mobile is-full">
						<div class="column is-one-quarter">
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
								expanded
								v-if="isPicto"
								:disabled="
									!(
										Object.values(picto.meaning).length &&
										Object.values(picto.speech).length
									) ||
									(!this.file.name && create)
								"
								:class="classCreateOrEdit"
								:icon-right="iconPictoOrEdit"
								@click="onSubmitted(false)"
							>
							</b-button>
							<b-button
								expanded
								v-if="!isPicto"
								:class="classCreateOrEdit"
								:disabled="
									!Object.values(picto.meaning).length ||
									(!this.file.name && create)
								"
								:icon-right="iconCollectionOrEdit"
								@click="onSubmitted(true)"
							>
							</b-button>
						</div>
						<div class="column is-one-quarter">
							<b-button
								class="button center"
								type="button"
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
<script difer>
const jpegasus = require("jpegasus");
import axios from "axios";
import Webpicto from "@/components/pictos/webpicto";
import lang from "@/mixins/lang";
import emoji from "@/mixins/emoji";
import tts from "@/mixins/tts";
import deviceInfos from "@/mixins/deviceInfos";
export default {
	mixins: [emoji, lang, tts, deviceInfos],
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
				color: "#ffffff00",
			}),
		},
		create: {
			type: Boolean,
			required: false,
			default: () => false,
		},
		isPicto: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		classCreateOrEdit() {
			return this.create ? "is-success" : "is-info";
		},
		iconPictoOrEdit() {
			return this.create ? "image" : "image-edit";
		},
		iconCollectionOrEdit() {
			return this.create ? "folder-table" : "folder-edit";
		},
		paginate() {
			return this.images.slice(
				(this.page - 1) * this.imgLimit,
				(this.page - 1) * this.imgLimit + this.imgLimit
			);
		},
		getAllUserLanguages() {
			return Object.keys(this.$store.getters.getUser.languages);
		},
	},
	data() {
		return {
			page: 1,
			imgLimit: 12,
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
			moreImages: true,
			noResults: false,
			voices: [],
			voiceURI: "",
			voiceURIs: [],
		};
	},
	watch: {
		page: function () {
			let element = document.getElementById("search");
			element.scrollTop = 0;
		},
	},
	created() {
		this.languageSelectorSpeech = this.getUserLang;
	},
	methods: {
		switchSpeechLanguage(language) {
			this.languageSelectorSpeech = language;
		},
		nextStep() {
			this.activeStep += 1;
		},
		previousStep() {
			this.activeStep -= 1;
		},
		async onSubmitted(isCollection = false) {
			let cfile;
			if (
				Object.values(this.picto.meaning).length == 0 ||
				!this.picto.meaning[this.getUserLang]
			) {
				this.$buefy.toast.open({
					message: this.$t("MeaningEmpty"),
					type: "is-danger",
				});
				return;
			}
			if (this.create && !this.file.name) {
				this.$buefy.toast.open({
					message: this.$t("MissingImage"),
					type: "is-danger",
				});
				return;
			}
			try {
				if (this.file.name) {
					if (
						!this.file.name.match(
							/\.(jpeg|png|gif|jpg|JPEG|JPG|PNG)$/
						)
					) {
						this.$buefy.toast.open({
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
						) + ".jpg",
						{ type: this.file.type }
					);
					cfile = await jpegasus.compress(myNewFile, {
						maxHeight: 300,
						maxWidth: 300,
						quality: 0.15,
					});
				}
				if (this.create || this.traductionNeeded()) {
					this.getAllUserLanguages
						.map((languages) => languages.replace(/[^a-z]/g, ""))
						.forEach(async (language) => {
							if (
								language == this.getUserLang ||
								this.picto.meaning[language] ||
								this.picto.speech[language] ||
								(!this.picto.speech[this.getUserLang] &&
									!this.picto.meaning[this.getUserLang])
							) {
								return;
							}
							if (
								this.picto.meaning[this.getUserLang] ==
								this.picto.speech[this.getUserLang]
							) {
								this.picto.meaning[language] =
									this.picto.speech[language] = (
										await axios.get("/translation/", {
											params: {
												text: this.picto.meaning[
													this.getUserLang
												],
												targetLang: language,
												sourceLang: this.getUserLang,
											},
										})
									)?.data.translation;
							} else {
								if (this.picto.meaning[this.getUserLang]) {
									this.picto.meaning[language] = (
										await axios.get("/translation/", {
											params: {
												text: this.picto.meaning[
													this.getUserLang
												],
												targetLang: language,
												sourceLang: this.getUserLang,
											},
										})
									)?.data.translation;
								}
								if (this.picto.speech[this.getUserLang]) {
									this.picto.speech[language] = (
										await axios.get("/translation/", {
											params: {
												text: this.picto.speech[
													this.getUserLang
												],
												targetLang: language,
												sourceLang: this.getUserLang,
											},
										})
									)?.data.translation;
								}
							}
						});
				}
				if (Object.keys(this.picto.speech).length === 0) {
					this.picto.speech = { ...this.picto.meaning };
					for (let key of Object.keys(this.picto.speech)) {
						this.picto.speech[`${key}`] = "a";
					}
				}
				if (this.create) {
					await this.$store.dispatch(
						isCollection ? "addCollection" : "addPicto",
						{
							collection: isCollection,
							speech: this.picto.speech,
							meaning: this.picto.meaning,
							color: this.picto.color,
							share: 1,
							fatherCollectionId: parseInt(
								this.$route.params.fatherCollectionId,
								10
							),
							image: cfile,
						}
					);
					this.$buefy.toast.open({
						message: isCollection
							? this.$t("CreatedCollection")
							: this.$t("CreatedPictogram"),
						type: "is-success",
					});
					this.$parent.close();
				} else {
					await this.$store.dispatch(
						isCollection ? "editCollection" : "editPicto",
						{
							starred: this.picto.starred,
							id: this.picto.id,
							collection: isCollection,
							speech: this.picto.speech,
							meaning: this.picto.meaning,
							color: this.picto.color,
							share: 1,
							fatherCollectionId: parseInt(
								this.$route.params.fatherCollectionId,
								10
							),
							image: cfile,
						}
					);
					this.$buefy.toast.open({
						message: isCollection
							? this.$t("EditedCollection")
							: this.$t("EditedPictogram"),
						type: "is-success",
					});
					this.$parent.close();
				}
			} catch (err) {
				console.log(err);
				this.$buefy.toast.open({
					message: this.$t("SomeThingBadHappened"),
					type: "is-danger",
				});
			}
			this.$emit("close");
		},
		traductionNeeded() {
			// Si meaning du language principal change
			// Si meaning vide
			const savedPicto = this.picto.collection
				? this.getCollectionFromId(this.picto.id)
				: this.getPictoFromId(this.picto.id);
			if (
				!savedPicto.meaning[this.getUserLang] ||
				savedPicto.meaning[this.getUserLang] !=
					this.picto.meaning[this.getUserLang]
			) {
				return true;
			} else {
				return false;
			}
		},
		getCollectionFromId(id) {
			const index = this.$store.getters.getCollections.findIndex(
				(collection) => collection.id === id
			);
			return this.$store.getters.getCollections[index];
		},
		getPictoFromId(id) {
			const index = this.$store.getters.getPictos.findIndex(
				(picto) => picto.id === id
			);
			return this.$store.getters.getPictos[index];
		},
		async webImages(pictoSearch) {
			const regex = new RegExp("[$&+,:;=?@#|'<>.^*()%!-]", "g");
			pictoSearch = pictoSearch.replaceAll(regex, " ");
			let webData;
			this.loading = true;
			try {
				webData = await this.$store.dispatch("serachImages", {
					language: this.getUserLang,
					search: pictoSearch,
				});
				webData.forEach((photo) => {
					this.images.push({
						src: photo.thumbnail,
						title: photo.title,
						download: photo.download,
						source: photo.source,
						author: photo.author,
					});
				});
				if (webData.length === 0) {
					this.noResults = true;
				} else {
					this.noResults = false;
				}
			} catch (err) {
				console.log(err);
				throw new Error("Web images not available");
			}
			this.moreImages = true;
			this.loading = false;
		},
		async pictoExtractImg(pictoSearch) {
			const regex = new RegExp("[$&+,:;=?@#|'<>.^*()%!-]", "g");
			pictoSearch = pictoSearch.replaceAll(regex, " ");
			this.images = [];
			this.loading = true;
			this.page = 1;
			let promises = [];
			try {
				const arasaacData = axios
					.get(
						`https://api.arasaac.org/api/pictograms/${this.getUserLang}/search/${pictoSearch}`
					)
					.then((arasaacData) => {
						arasaacData = arasaacData.data;
						for (let i = 0; i < arasaacData?.length; i++) {
							this.images.push({
								src: `https://api.arasaac.org/api/pictograms/${arasaacData[i]["_id"]}?color=true&resolution=500&download=false`,
								title: arasaacData[i]["keywords"][0]
									? arasaacData[i]["keywords"][0]["keyword"]
									: arasaacData[i]["categories"][0],
								download: `https://api.arasaac.org/api/pictograms/${arasaacData[i]["_id"]}?color=true&resolution=500&download=false`,
								source: "arasaac",
								author: "",
							});
						}
					})
					.catch((error) => {
						console.log(error);
					});

				const scleraData = axios
					.get(
						`https://symbotalkapiv1.azurewebsites.net/search/?name=${pictoSearch}&lang=${this.getUserLang}&repo=sclera&limit=10`
					)
					.then((scleraData) => {
						scleraData = scleraData.data;
						if (scleraData != "no result") {
							for (let i = 0; i < scleraData?.length; i++) {
								this.images.push({
									src: scleraData[i].image_url,
									title: scleraData[i].translations[0].tName,
									download: scleraData[i].image_url,
									source: "sclera-symbotalk",
									author: scleraData[i].author,
								});
							}
						}
					})
					.catch((error) => {
						console.log(error);
					});

				const tawasolData = axios
					.get(
						`https://symbotalkapiv1.azurewebsites.net/search/?name=${pictoSearch}&lang=${this.getUserLang}&repo=tawasol&limit=10`
					)
					.then((tawasolData) => {
						tawasolData = tawasolData.data;
						if (tawasolData != "no result") {
							for (let i = 0; i < tawasolData?.length; i++) {
								this.images.push({
									src: tawasolData[i].image_url,
									title: tawasolData[i].translations[0].tName,
									download: tawasolData[i].image_url,
									source: "tawasol-symbotalk",
									author: tawasolData[i].author,
								});
							}
						}
					})
					.catch((error) => {
						console.log(error);
					});

				const mulberryData = axios
					.get(
						`https://symbotalkapiv1.azurewebsites.net/search/?name=${pictoSearch}&lang=${this.getUserLang}&repo=mulberry&limit=10`
					)
					.then((mulberryData) => {
						mulberryData = mulberryData.data;
						if (mulberryData != "no result") {
							for (let i = 0; i < mulberryData?.length; i++) {
								this.images.push({
									src: mulberryData[i].image_url,
									title: mulberryData[i].translations[0]
										.tName,
									download: mulberryData[i].image_url,
									source: "mulberry-symbotalk",
									author: mulberryData[i].author,
								});
							}
						}
					})
					.catch((error) => {
						console.log(error);
					});

				promises.push(arasaacData);
				promises.push(scleraData);
				promises.push(tawasolData);
				promises.push(mulberryData);
				await Promise.allSettled(promises).then();

				if (this.images.length < 5) {
					this.webImages(pictoSearch);
				} else {
					this.noResults = false;
					this.loading = false;
					this.moreImages = false;
				}
			} catch (error) {
				console.log(error);
				if (error.response && error.response.status == 404) {
					this.webImages(pictoSearch);
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
.halfWidth {
	width: 40%;
}
.scrolling {
	scrollbar-width: thin;
	scroll-behavior: smooth;
}
</style>
