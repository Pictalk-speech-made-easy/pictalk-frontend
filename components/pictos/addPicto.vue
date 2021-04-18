<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("CreatePictogram") }}</p>
			</header>
			<section class="modal-card-body">
				<b-field :label="$t('Speech')">
					<b-input
						type="text"
						v-model="pictoSpeech"
						:placeholder="$t('SpeechNotice')"
					></b-input>
				</b-field>
				<b-button
					type="is-success"
					icon-right="message"
					@click="pronounce(pictoSpeech)"
				/>
				<br />
				<br />
				<b-field :label="$t('Meaning')">
					<b-input
						type="text"
						v-model="pictoMeaning"
						:placeholder="$t('MeaningNotice')"
						required
					></b-input>
				</b-field>
				<b-field :label="$t('Folder')">
					<b-checkbox
						v-model="isFolder"
						true-value="1"
						false-value="0"
						>{{ $t("FolderNotice") }}</b-checkbox
					>
				</b-field>
				<br />
				<div>
					<section>
						<b-field class="file">
							<b-upload
								v-model="file"
								accept="image/png, image/jpeg, image/gif, image/jpg"
								native
								expanded
								required
							>
								<a class="button is-primary is-fullwidth">
									<b-icon icon="upload"></b-icon>
									<span>{{
										file.name || $t("ClickToUpload")
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
									<div class="content has-text-centered">
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
						<b-field>
							<b-switch
								v-model="highQuality"
								:false-value="$t('StandardQuality')"
								:true-value="$t('HighQuality')"
							>
								{{ highQuality }}
							</b-switch>
						</b-field>
						<div class="tags">
							<span class="tag is-primary">
								{{ file.name }}
								<button
									class="delete is-small"
									type="button"
									@click="file = {}"
								></button>
							</span>
						</div>
					</section>
				</div>
			</section>

			<footer class="modal-card-foot">
				<b-button
					class="button"
					type="button"
					@click="$parent.close()"
					>{{ $t("Close") }}</b-button
				>
				<b-button
					class="button is-primary"
					@click="
						onSubmitted(
							pictoSpeech,
							pictoMeaning,
							isFolder,
							file,
							highQuality
						)
					"
					>{{ $t("Create") }}</b-button
				>
			</footer>
		</div>
	</form>
</template>
<script>
const jpegasus = require("jpegasus");
export default {
	created() {
		const allVoicesObtained = new Promise(function (resolve, reject) {
			let voices = window.speechSynthesis.getVoices();
			if (voices.length !== 0) {
				resolve(voices);
			} else {
				window.speechSynthesis.addEventListener(
					"voiceschanged",
					function () {
						voices = window.speechSynthesis.getVoices();
						resolve(voices);
					}
				);
			}
		});
		allVoicesObtained.then((voices) => (this.languages = voices));
	},
	data() {
		return {
			selectedOption: "",
			pictoSpeech: "",
			pictoMeaning: "",
			isFolder: "0",
			file: {},
			highQuality: this.$t("StandardQuality"),
		};
	},
	computed: {
		getUserLang() {
			const user = this.$store.getters.getUser;
			return user.language;
		},
	},
	methods: {
		async pronounce(speech) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = speech;
				let voice = this.languages.filter(
					(voice) => voice.lang == this.getUserLang
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
		async onSubmitted(speech, meaning, isfolder, file, highQuality) {
			if (meaning != "" && file.name) {
				if (!file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
					this.$buefy.notification.open({
						message: this.$t("ImageFiles"),
						type: "is-warning",
					});
					return;
				}
				if (speech == "") {
					speech = " ";
				}
				try {
					const myNewFile = new File(
						[file],
						file.name.substr(0, file.name.lastIndexOf(".")) +
							".jpeg",
						{ type: file.type }
					);
					let quality;
					quality =
						highQuality == this.$t("HighQuality")
							? (quality = 0.1)
							: (quality = 0.01);
					const cfile = await jpegasus.compress(myNewFile, {
						maxHeight: 500,
						maxWidth: 500,
						quality: quality,
					});
					this.$store.dispatch("addPicto", {
						picto: {
							speech: speech,
							meaning: meaning,
							folder: parseInt(isfolder, 10),
							image: cfile,
							fatherId: parseInt(this.$route.params.fatherId, 10),
						},
						collectionId: parseInt(
							this.$route.params.collectionId,
							10
						),
					});
					this.$buefy.notification.open({
						message: this.$t("CreatedPictogram"),
						type: "is-success",
					});
					this.$parent.close();
				} catch (ex) {
					console.log(ex);
					this.$buefy.notification.open({
						message: this.$t("SomeThingBadHappened"),
						type: "is-danger",
					});
				}
			} else {
				this.$buefy.notification.open({
					message: this.$t("ServerOffline"),
					type: "is-danger",
				});
			}
		},
	},
};
</script>
