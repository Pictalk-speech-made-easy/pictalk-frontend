import axios from "axios";
import Cookie from "js-cookie";

export const state = () => ({
	collections: [],
	token: null,
	pictoSpeech: [],
	user: {},
	rootId: null
});
const URL = "http://localhost:3001";

export const mutations = {
	resetStore(state) {
		state.collections = [];
		state.pictoSpeech = [],
			state.user = {}
	},
	addSpeech(state, picto) {
		state.pictoSpeech.push(picto);
	},
	removeSpeech(state) {
		state.pictoSpeech.pop();
	},
	eraseSpeech(state) {
		state.pictoSpeech = [];
	},
	addCollection(state, collection) {
		state.collections.push(collection);
	},
	addPicto(state, picto) {
		const fatherPictoIndex = state.collections.findIndex(
			collection => collection.fatherCollectionId === picto.fatherCollectionId
		);
		state.collections[fatherPictoIndex].pictos.push(picto);
	},
	editPicto(state, editedPicto) {
		const fatherPictoIndex = state.collections.findIndex(
			collection => collection.fatherCollectionId === editedPicto.editedPicto.fatherCollectionId
		);
		const pictoIndex = state.collections[fatherPictoIndex].pictos.findIndex(
			picto => picto.id === editedPicto.editedPicto.id
		);
		state.collections[fatherPictoIndex].pictos.splice(pictoIndex, 1);
		state.collections[fatherPictoIndex].pictos.push(editedPicto.editedPicto);
	},
	removePicto(state, removedPicto) {
		const fatherPictoIndex = state.collections.findIndex(
			collection => collection.fatherCollectionId === removedPicto.fatherCollectionId
		);
		const pictoIndex = state.collections[fatherPictoIndex].pictos.findIndex(
			picto => picto.id === removedPicto.id
		);
		const collectionIndex = state.collections.findIndex(
			collection => collection.fatherCollectionId === removedPicto.id
		);
		if (collectionIndex !== -1) {
			state.collections.splice(collectionIndex, 1);
		}
		state.collections[fatherPictoIndex].pictos.splice(pictoIndex, 1);
	},
	resetCollections(state) {
		state.collections = [];
	},
	setCollections(state, collections) {
		state.collections = collections;
	},
	setToken(state, token) {
		state.token = token;
	},
	clearToken(state) {
		state.token = null;
	},
	editUser(state, user) {
		state.user = user;
	},
	setRootId(state, rootId) {
		state.rootId = rootId;
	}

};
export const actions = {
	resetCollections(vuexContext) {
		vuexContext.commit("resetCollections");
	},
	addCollection(vuexContext, collection) {
		const newCollection = {
			fatherCollectionId: collection.fatherCollectionId,
			pictos: []
		};
		vuexContext.commit("addCollection", newCollection);
	},
	// NEEDS CHANGES
	async addPicto(vuexContext, picto,) {
		let formData = new FormData();
		formData.append("speech", JSON.stringify(picto.speech));
		formData.append("meaning", JSON.stringify(picto.meaning));

		if (picto.color != 0) {
			formData.append("color", picto.color);
		}
		formData.append("share", picto.share);
		formData.append("fatherCollectionId", picto.fatherCollectionId);
		//formData.append("collectionIds", picto.collectionIds);
		formData.append("image", picto.image);
		const newPicto = (await axios
			.post(URL + "/picto/", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})).data;
		vuexContext.commit("addPicto", {
			speech: picto.speech,
			meaning: picto.meaning,
			color: picto.color,
			userId: newPicto.userId,
			image: axios.defaults.baseURL + "/image/pictalk/" + newPicto.image,
			fatherCollectionId: picto.fatherCollectionId,
			id: newPicto.id,
			starred: newPicto.starred,
			editors: newPicto.editors,
			viewers: newPicto.viewers,
			public: newPicto.public
		});
	},
	// NEEDS CHANGES
	async editPicto(vuexContext, picto) {
		let formData = new FormData();
		formData.append("speech", JSON.stringify(picto.speech));
		formData.append("meaning", JSON.stringify(picto.meaning));
		formData.append("language", JSON.stringify(picto.language));
		formData.append("color", picto.color);
		formData.append("share", picto.shared);
		formData.append("starred", picto.starred);
		formData.append("collectionIds", picto.collectionIds);
		if (picto.image) {
			formData.append("image", picto.image);
		}
		const editedPicto = (await axios
			.put(URL + "/picto/" + picto.id, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})).data;

		vuexContext.commit("editPicto", {
			speech: picto.speech,
			meaning: picto.meaning,
			language: picto.language,
			color: picto.color,
			collections: editedPicto.collections,
			userId: editedPicto.userId,
			shared: editedPicto.shared,
			image: axios.defaults.baseURL + "/image/" + editedPicto.image,
			fatherCollectionId: editedPicto.fatherCollectionId,
			id: picto.id
		});
	},
	async removePicto(vuexContext, removedPicto) {
		const res = await axios
			.delete(URL + "/picto/" + removedPicto.id);
		vuexContext.commit("removePicto", removedPicto);
		return res;
	},
	async addCollection(vuexContext, collection) {
		let formData = new FormData();
		formData.append("speech", JSON.stringify(collection.speech));
		formData.append("meaning", JSON.stringify(collection.meaning));
		formData.append("language", JSON.stringify(collection.language));
		formData.append("color", collection.color);
		formData.append("fatherCollectionId", collection.fatherCollectionId);
		//formData.append("collectionIds", collection.collectionIds);
		//formData.append("pictoIds", collection.pictoIds);
		formData.append("share", collection.share);
		formData.append("image", collection.image);
		const newCollection = (await axios
			.post(URL + "/collection", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})).data;
		vuexContext.commit("addCollection", {
			speech: collection.speech,
			meaning: collection.meaning,
			language: collection.language,
			color: collection.color,
			collections: newCollection.collections,
			userId: newCollection.userId,
			image: axios.defaults.baseURL + "/image/" + newCollection.image,
			fatherCollectionId: collection.fatherCollectionId,
			pictos: newCollection.pictos,
			id: newCollection.id
		});
		vuexContext.commit("addPicto", {
			speech: collection.speech,
			meaning: collection.meaning,
			language: collection.language,
			color: collection.color,
			collections: newCollection.collections,
			userId: newCollection.userId,
			image: axios.defaults.baseURL + "/image/" + newCollection.image,
			fatherCollectionId: collection.fatherCollectionId,
			pictos: newCollection.pictos,
			id: newCollection.id
		})
	},
	async editCollection(vuexContext, collection) {
		let formData = new FormData();
		formData.append("speech", JSON.stringify(collection.speech));
		formData.append("meaning", JSON.stringify(collection.meaning));
		formData.append("language", JSON.stringify(collection.language));
		formData.append("color", collection.color);
		formData.append("fatherCollectionId", collection.fatherCollectionId);
		formData.append("collectionIds", collection.collectionIds);
		formData.append("pictoIds", collection.pictoIds);
		formData.append("share", collection.share);
		if (collection.image) {
			formData.append("image", collection.image);
		}
		const editedCollection = (await axios
			.put(URL + "/pictalk/collection/" + editedCollection.id, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})).data;

		vuexContext.commit("editCollection", {
			speech: collection.speech,
			meaning: collection.meaning,
			language: collection.language,
			color: collection.color,
			collections: editedCollection.collections,
			pictos: editedCollection.pictos,
			userId: collection.userId,
			image: axios.defaults.baseURL + "/image/" + editedCollection.image,
			fatherCollectionId: collection.fatherCollectionId,
			id: collection.id
		});
	},
	// DONT CHANGE
	removeCollection(vuexContext, removedCollectionId) {
		return axios.delete(URL + "/collection/" + removedCollectionId).then(() => vuexContext.commit("removeCollection", removedCollectionId)).catch(e => console.log(e));
	},
	async authenticateUser(vuexContext, authData) {
		let authUrl = URL + "/auth/signin";
		const res = await axios
			.post(authUrl, {
				username: authData.username,
				password: authData.password
			});
		const expDate = new Date().getTime() + Number.parseInt(res.data.expiresIn) * 1000;
		vuexContext.commit("setToken", res.data.accessToken);
		localStorage.setItem("token", res.data.accessToken);
		localStorage.setItem("tokenExpiration", expDate);
		Cookie.set("jwt", res.data.accessToken, { sameSite: 'none', secure: true });
		Cookie.set("expirationDate", expDate, { sameSite: 'none', secure: true });
		return res;
	},
	// NEEDS CHANGES
	initAuth(vuexContext, req) {
		let token;
		let expirationDate;
		if (req) {
			if (!req.headers.cookie) {
				return;
			} else {
				const jwtCookie = req.headers.cookie
					.split(";")
					.find(c => c.trim().startsWith("jwt="));
				if (!jwtCookie) {
					return;
				}
				token = jwtCookie.split("=")[1];

				const jwtExpirationDate = req.headers.cookie
					.split(";")
					.find(c => c.trim().startsWith("expirationDate="));
				if (!jwtExpirationDate) {
					return;
				}
				expirationDate = jwtExpirationDate.split("=")[1];
			}
		} else if (process.client) {
			token = localStorage.getItem("token");
			expirationDate = localStorage.getItem("tokenExpiration");
		} else {
			token = null;
			expirationDate = null;
		}
		if (new Date().getTime() > +expirationDate || !token) {
			vuexContext.dispatch("logout");
			return;
		}
		vuexContext.commit("setToken", token);
	},
	// DONT KNOW
	logout(vuexContext) {
		vuexContext.commit("clearToken");
		Cookie.remove("jwt");
		Cookie.remove("expirationDate");
		if (process.client) {
			localStorage.removeItem("token");
			localStorage.removeItem("tokenExpiration");
		}
		vuexContext.commit("resetStore");
	},
	// NEEDS CHANGES
	async editUser(vuexContext, user) {
		const res = await axios
			.put(URL + "/auth/details/", user);
		vuexContext.commit("editUser", {
			username: user.username,
			language: user.language,
			languages: user.languages,
			directSharers: user.directSharers
		});
		return res;
	},
	async downloadCollections(vuexContext) {
		const res = await axios.get("/collection");
		res.data.map(collection => {
			if (collection.image) {
				collection.image =
					axios.defaults.baseURL + "/image/" + collection.image;
			}
			if (collection.meaning) {
				collection.meaning = JSON.parse(collection.meaning);
			}
			if (collection.speech) {
				collection.speech = JSON.parse(collection.speech);
			}
			collection.pictos.map((picto) => {
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
			});
			collection.collections.map((coll) => {
				if (coll.image) {
					coll.image =
						this.$config.baseURL +
						"/image/pictalk/" +
						coll.image;
				}
				if (coll.meaning) {
					coll.meaning = JSON.parse(coll.meaning);
				}
				if (coll.speech) {
					coll.speech = JSON.parse(coll.speech);
				}
				coll.collection = true;
			});
			collection.collection = true;
		});
		vuexContext.commit("resetCollections");
		vuexContext.commit("setCollections", res.data);
	}
}
export const getters = {
	getCollections(state) {
		return state.collections;
	},
	isAuthenticated(state) {
		return state.token != null;
	},
	getSpeech(state) {
		return state.pictoSpeech;
	},
	getUser(state) {
		return state.user;
	},
	getRootId(state) {
		return state.rootId;
	}
};
