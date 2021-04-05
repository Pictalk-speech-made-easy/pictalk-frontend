<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("EditCollection") }}</p>
			</header>
			<section class="modal-card-body">
				<b-field :label="$t('Name')">
					<b-input
						v-model="collection.name"
						type="name"
						:placeholder="$t('NameNotice')"
						required
					></b-input>
				</b-field>
				<b-field :label="$t('Color')">
					<b-input
						type="color"
						:placeholder="$t('ColorNotice')"
						v-model="collection.color"
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
							collection.name,
							collection.color,
							file,
							collection.id,
							highQuality
						)
					"
					>{{ $t("Edit") }}</b-button
				>
			</footer>
		</div>
	</form>
</template>
<script>
const jpegasus = require("jpegasus");
export default {
	props: {
		collection: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			selectedOption: "",
			file: {},
			highQuality: this.$t("StandardQuality"),
		};
	},
	methods: {
		async onSubmitted(name, color, file, id, highQuality) {
			if (name != "" && color != "") {
				try {
					if (file.name) {
						if (!file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
							this.$buefy.notification.open({
								message: this.$t("ImageFiles"),
								type: "is-warning",
							});
							return;
						}
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
						const res = await this.$store.dispatch(
							"editCollection",
							{
								id: id,
								name: name,
								color: color,
								image: cfile,
							}
						);
					} else {
						const res = await this.$store.dispatch(
							"editCollection",
							{
								id: id,
								name: name,
								color: color,
							}
						);
					}

					this.$buefy.notification.open({
						message: this.$t("EditedCollection"),
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
					message: this.$t("UpdatedCollection"),
					type: "is-danger",
				});
			}
		},
	},
};
</script>
