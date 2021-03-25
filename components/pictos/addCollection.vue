<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("CreateCollection") }}</p>
			</header>
			<section class="modal-card-body">
				<b-field :label="$t('Name')">
					<b-input
						type="name"
						v-model="collectionName"
						:placeholder="$t('NameNotice')"
						required
					></b-input>
				</b-field>
				<b-field :label="$t('Color')">
					<b-input
						type="color"
						v-model="collectionColor"
						:placeholder="$t('ColorNotice')"
						required
					></b-input>
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
							collectionName,
							collectionColor,
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
			collectionName: "",
			collectionColor: "",
			file: {},
			highQuality: this.$t("StandardQuality"),
		};
	},
	methods: {
		async onSubmitted(name, color, file, highQuality) {
			if (name != "" && color != "" && file.name) {
				if (!file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
					this.$buefy.notification.open({
						message: this.$t("ImageFiles"),
						type: "is-warning",
					});
					return;
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
					const res = await this.$store.dispatch("addCollection", {
						name: name,
						color: color,
						image: cfile,
					});
					this.$buefy.notification.open({
						message: this.$t("CreatedCollection"),
						type: "is-success",
					});
					this.$parent.close();
				} catch (ex) {
					this.$buefy.notification.open({
						message: this.$t("SomeThingBadHappened"),
						type: "is-danger",
					});
				}
			} else {
				this.$buefy.notification.open({
					message: this.$t("PleaseCompleteForm"),
					type: "is-danger",
				});
			}
		},
	},
};
</script>
