<template>
	<div>
		<div class="container is-widescreen">
			<pictoList :pictos="loadedPictos" :adminMode="isAdmin" />
		</div>
		<div class="contenant">
			<pictoBar
				v-if="loadSpeech.length != 0"
				class="pictobar"
				:pictos="loadSpeech"
				:collectionColor="collectionColor"
			/>
		</div>
		<div class="filler"></div>
	</div>
</template>
<script>
import axios from "axios";
import pictoList from "@/components/pictos/pictoList";
import pictoBar from "@/components/pictos/pictoBar";
export default {
	layout: "pictalk",
	middleware: ["check-auth", "auth", "axios"],
	components: {
		pictoList: pictoList,
		pictoBar: pictoBar,
	},
	computed: {
		loadSpeech() {
			return this.$store.getters.getSpeech;
		},
		isAdmin() {
			if (this.$route.query.isAdmin) {
				return true;
			} else {
				return false;
			}
		},
		loadedPictos() {
			const collectionArray = this.$store.getters.getCollections.filter(
				(collection) =>
					collection.id ===
					parseInt(this.$route.params.fatherCollectionId, 10)
			);
			if (
				collectionArray.length !== 0 &&
				collectionArray[0].pictos &&
				collectionArray[0].collections
			) {
				
				let rankedPictos = [];
				collectionArray[0].collections
					.concat(collectionArray[0].pictos)
					.forEach((picto) => {
						if (picto.starred == true) {
							rankedPictos.unshift(picto);
						} else {
							rankedPictos.push(picto);
						}
					});
				return rankedPictos;
			} else {
				return [];
			}
		},
		collectionColor() {
			const collection = this.$store.getters.getCollections.filter(
				(collection) =>
					collection.id ===
					parseInt(this.$route.params.fatherCollectionId, 10)
			);
			if (collection.length !== 0) {
				if (collection[0].color) {
					return collection[0].color;
				} else {
					return "#f5f5f5";
				}
			} else {
				return "#f5f5f5";
			}
		},
	},
	async fetch() {
		const collections = this.$store.getters.getCollections;
		let collection;
		if (collections.length != 0) {
			const fatherCollectionId = collections.findIndex(
				(collection) =>
					collection.id ===
					parseInt(this.$route.params.fatherCollectionId, 10)
			);
			collection = collections[fatherCollectionId];
		}
		// TODO Traiter differement !collection et !collection.pictos || !collection.collections
		if (
			!collection ||
			!collection.pictos ||
			collection.pictos.length == 0 ||
			!collection.collections ||
			collection.collections.length == 0 ||
			collections.length == 0
		) {
			try {
				if (!this.$route.params.fatherCollectionId) {
					if (this.$store.getters.getRootId) {
						const adminMode = this.$route.query.isAdmin
							? "?isAdmin=true"
							: "";
						this.$router.push(
							"/pictalk/" +
								this.$store.getters.getRootId +
								adminMode
						);
						return;
					} else {
						var res = await axios.get("/user/root/");
						this.$store.commit("setRootId", res.data.id);
						this.$router.push(this.$route.path + "/" + res.data.id);
					}
				} else {
					var res = await axios.get(
						"/collection/find/" +
							this.$route.params.fatherCollectionId
					);
					if (res.data.image) {
						res.data.image =
							this.$config.baseURL +
							"/image/pictalk/" +
							res.data.image;
					}
					if (res.data.meaning) {
						res.data.meaning = JSON.parse(res.data.meaning);
					}
					if (res.data.speech) {
						res.data.speech = JSON.parse(res.data.speech);
					}
					res.data.collection = true;
				}
				if (res.data.pictos && !res.data.pictos.length == 0) {
					res.data.pictos.map((picto) => {	
						if (picto.image) {
							picto.image =
								this.$config.baseURL +
								"/image/pictalk/" +
								picto.image;
						}
						if (picto.meaning) {
							picto.meaning = JSON.parse(picto.meaning);
						}
						if (picto.speech) {
							picto.speech = JSON.parse(picto.speech);
						}
						picto.fatherCollectionId = res.data.id;
						if (!this.$store.getters.getPictoList[picto.id]) {
						this.$store.commit("addPictoList",picto);
					} else {
						picto = this.$store.getters.getPictoList[picto.id]
					}
					});
				}
				if (res.data.collections && !res.data.collections.length == 0) {
					res.data.collections.map((collection) => {
						if (collection.image) {
							collection.image =
								this.$config.baseURL +
								"/image/pictalk/" +
								collection.image;
						}
						if (collection.meaning) {
							collection.meaning = JSON.parse(collection.meaning);
						}
						if (collection.speech) {
							collection.speech = JSON.parse(collection.speech);
						}
						collection.collection = true;
						collection.fatherCollectionId = res.data.id;
						if (!this.$store.getters.getCollectionList[collection.id]) {
						this.$store.commit("addCollectionList",collection);
						this.$store.commit("addCollection", collection);
						} else {
							//collection = this.$store.getters.getCollectionList[collection.id];
							this.$store.commit("editCollection", collection);
						}
					});
				}
				if (!this.$store.getters.getCollectionList[res.data.id]) {
					this.$store.commit("addCollection", res.data);
					this.$store.commit("addCollectionList",res.data);
				} else {
					await this.$store.commit("editCollection", res.data);
				}
			} catch (error) {
				console.log("error ", error);
			}
		}
		const user = this.$store.getters.getUser;
		if (!user.username) {
			try {
				var res = await axios.get("/user/details/");
				this.$store.commit("editUser", res.data);
			} catch (error) {
				console.log("error ", error);
			}
		}
	},
	data() {
		return {
			isPicto: true,
		};
	},
	methods: {
		removeSpeech() {
			this.$store.commit("removeSpeech");
		},
	},
};
</script>
<style scoped>
.pictobar {
	bottom: 3%;
	width: 98%;
	max-height: 20%;
	position: fixed;
}
.filler {
	padding-bottom: 20%;
}
.contenant {
	display: flex;
	justify-content: center;
}
</style>
