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
								accept="image/png, image/jpeg, image/gif"
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
								accept="image/png, image/jpeg, image/gif"
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
		delay(delayInms) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(2);
				}, delayInms);
			});
		},
		async pronounce(speech) {
			if ("speechSynthesis" in window) {
				var msg = new SpeechSynthesisUtterance();
				msg.text = speech;
				let voices = window.speechSynthesis.getVoices();
				let voice = voices.filter(
					(voice) => voice.lang == this.getUserLang
				);
				let increment;
				while (voice.length == 0 && increment != 10) {
					voices = window.speechSynthesis.getVoices();
					voice = voices.filter(
						(voice) => voice.lang == this.getUserLang
					);
					increment++;
					await this.delay(10);
				}
				voice = voices.filter(
					(voice) => voice.lang == this.getUserLang
				);
				if (voice.length !== 0) {
					msg.voice = voice[0];
				} else {
					console.log("No voices found !");
				}
				window.speechSynthesis.speak(msg);
			} else {
				console.log("Your browser doesn't support speechSynthesis :(");
			}
		},
		async onSubmitted(speech, meaning, isfolder, file, highQuality) {
			if (meaning != "" && file.name) {
				if (!file.name.match(/\.(jpeg|png|gif)$/)) {
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
					let quality;
					quality =
						highQuality == this.$t("HighQuality")
							? (quality = 0.1)
							: (quality = 0.01);
					const cfile = await jpegasus.compress(file, {
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
