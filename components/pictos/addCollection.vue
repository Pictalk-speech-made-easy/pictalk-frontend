<template>
	<form action>
		<div class="modal-card" style="width: auto">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ $t("CreateCollection") }}</p>
			</header>
			<section class="modal-card-body">
				<collection-steps create="true" />
			</section>
			<footer class="modal-card-foot">
				<b-button
					class="button"
					type="button"
					@click="$parent.close()"
					>{{ $t("Close") }}</b-button
				>
			</footer>
		</div>
	</form>
</template>
<script>
const jpegasus = require("jpegasus");
import axios from "axios";
import Webpicto from "@/components/pictos/webpicto";
import CollectionSteps from "@/components/pictos//collectionSteps";
export default {
	data() {
		return {
			selectedOption: "",
			collectionName: "",
			collectionColor: "",
			file: {},
			highQuality: this.$t("StandardQuality"),
			size: 0,
			images: [],
			activeTab: 0,
			pictoSearch: "",
		};
	},
	components: {
		Webpicto,
		CollectionSteps,
	},
	methods: {
		async onSubmitted(name, color, file, highQuality) {
			if (name != "" && file.name) {
				if (!file.name.match(/\.(jpeg|png|gif|jpg)$/)) {
					this.$buefy.notification.open({
						message: this.$t("ImageFiles"),
						type: "is-warning",
					});
					return;
				}
				if (!color) {
					color = "#ff5656";
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
					console.log(ex);
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
		getUserLang() {
			const user = this.$store.getters.getUser;
			if (user.language) {
				return user.language.replace(/[^a-z]/g, "");
			} else {
				return this.$i18n.getLocaleCookie();
			}
		},
		async pictoExtractImg(pictoSearch) {
			let results = [];
			let src;
			let alt;
			try {
				this.images = await axios
					.get(
						`https://api.arasaac.org/api/pictograms/${this.getUserLang()}/search/${pictoSearch}`,
						{ headers: {} }
					)
					.then((response) => {
						this.size = response.data.length;
						for (let index = 0; index < this.size; index++) {
							src = `https://api.arasaac.org/api/pictograms/${response.data[index]["_id"]}?color=true&resolution=500&download=false`;
							alt =
								response.data[index]["keywords"][0]["keyword"];
							results.push({ alt: alt, src: src });
						}
						return results;
					});
			} catch (error) {
				console.log(error);
			}
		},
		uploadfile(file) {
			this.activeTab = 1;
			this.collectionName = file.name
				.replaceAll("-", " ")
				.replace(/\.[^/.]+$/, "");
			this.file = file;
		},

		discardfile() {
			this.file = {};
			this.activeTab = 0;
		},
		next() {
			this.activeTab = 1;
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
.adminMenu {
	align-self: flex-end;
	margin: 0 auto;
	margin-top: auto;
}
</style>