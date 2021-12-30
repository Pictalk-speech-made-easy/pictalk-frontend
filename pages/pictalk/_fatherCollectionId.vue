<template>
	<div>
		<div class="container is-widescreen">
			<pictoList
				:isPicto="isPicto"
				:pictos="loadedPictos"
				:adminMode="isAdmin"
			/>
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
			const collection = this.$store.getters.getCollections.filter(
				(collection) =>
					collection.fatherCollectionId ===
					parseInt(this.$route.params.fatherCollectionId, 10)
			);
			if (collection.length !== 0) {
				let rankedPictos = [];
				collection[0].pictos.forEach((picto) => {
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
			if (parseInt(this.$route.params.fatherCollectionId, 10) == 0) {
				return;
			} else {
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
				}
			}
		},
	},
	async fetch() {
		const collections = await this.$store.getters.getCollections;
		let collection;
		if (collections.length != 0) {
			const fatherCollectionId = collections.findIndex(
				(collection) =>
					collection.fatherCollectionId ===
					parseInt(this.$route.params.fatherCollectionId, 10)
			);
			collection = collections[fatherCollectionId];
		}
		if (!collection || collections.length == 0) {
			try {
				if (!this.$route.params.fatherCollectionId) {
					var res = await axios.get("/user/root/");
					this.$router.push(this.$route.path + "/" + res.data.id);
				} else {
					var res = await axios.get(
						"/pictalk/collection/" +
							this.$route.params.fatherCollectionId
					);
				}

				res.data.pictos.map((picto) => {
					if (picto.path) {
						picto.path =
							this.$config.baseURL +
							"/pictalk/image/" +
							picto.path;
					}
				});
				res.data.collections.map((picto) => {
					if (picto.path) {
						picto.path =
							this.$config.baseURL +
							"/pictalk/image/" +
							picto.path;
					}
				});
				await this.$store.commit("addCollection", {
					pictos: [...res.data.pictos, ...res.data.collections],
					fatherCollectionId: parseInt(
						this.$route.params.fatherCollectionId,
						10
					),
				});
			} catch (error) {
				console.log("error ", error);
			}
		}
		const user = this.$store.getters.getUser;
		if (!user.username) {
			try {
				var res = await axios.get("/user/details/");
				console.log(res.data);
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
