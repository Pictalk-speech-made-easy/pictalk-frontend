import axios from "axios";
import Cookie from "js-cookie";

export const state = () => ({
  pictoviews: [],
  collections: [],
  token: null,
  pictoSpeech: []
});
const URL = "http://localhost:3001";
export const mutations = {
  addSpeech(state, picto) {
    state.pictoSpeech.push(picto);
  },
  removeSpeech(state) {
    state.pictoSpeech.pop();
  },
  eraseSpeech(state) {
    state.pictoSpeech = [];
  },

  addView(state, pictoView) {
    state.pictoviews.push(pictoView);
  },

  addPicto(state, picto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.id === picto.fatherId
    );
    state.pictoviews[fatherPictoIndex].pictos.push(picto);
  },
  editPicto(state, editedPicto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.id === editedPicto.fatherId
    );
    const pictoIndex = state.pictoviews[fatherPictoIndex].pictos.findIndex(
      picto => picto.id === editedPicto.id
    );
    state.pictoviews[fatherPictoIndex].pictos.splice(pictoIndex, 1);
    state.pictoviews[fatherPictoIndex].pictos.push(editedPicto);
  },
  removePicto(state, removedPicto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.id === removedPicto.fatherId
    );
    const pictoIndex = state.pictoviews[fatherPictoIndex].pictos.findIndex(
      picto => picto.id === removedPicto.id
    );
    const viewIndex = state.pictoviews.findIndex(
      view => view.id === removedPicto.id
    );
    if (viewIndex !== -1) {
      state.pictoviews.splice(viewIndex, 1);
    }
    state.pictoviews[fatherPictoIndex].pictos.splice(pictoIndex, 1);
  },

  setCollections(state, collections) {
    state.collections = collections;
  },
  addCollection(state, collection) {
    state.collections.push(collection);
  },
  editCollection(state, editedCollection) {
    const collectionIndex = state.collections.findIndex(
      collection => collection.id === editedCollection.id
    );
    state.collections.splice(collectionIndex, 1);
    state.collections.push(editedCollection);
  },
  removeCollection(state, removedCollectionId) {
    const collectionIndex = state.collections.findIndex(
      collection => collection.id === removedCollectionId
    );
    state.collections.splice(collectionIndex, 1);
  },

  setToken(state, token) {
    state.token = token;
  },
  clearToken(state) {
    state.token = null;
  }
};
export const actions = {

  addView(vuexContext, pictos, fatherId) {
    const view = {
      id: fatherId,
      pictos: pictos
    };
    vuexContext.commit("addView", view);
  },

  async addPicto(vuexContext, {
    picto,
    collectionId
  }) {
    let formData = new FormData();
    formData.append("speech", picto.speech);
    formData.append("meaning", picto.meaning);
    formData.append("folder", picto.folder);
    formData.append("fatherId", picto.fatherId);
    formData.append("image", picto.image);
    const res = await axios
      .post(URL + "/pictalk/picto/" + collectionId, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    vuexContext.commit("addPicto", {
      speech: picto.speech,
      meaning: picto.meaning,
      path: URL + "/pictalk/" + res.data.path,
      folder: picto.folder,
      fatherId: picto.fatherId,
      id: res.data.id
    });
    if (picto.folder == 1) {
      vuexContext.commit("addView", {
        id: picto.id,
        pictos: []
      });
    }
    return res;
  },

  async editPicto(vuexContext, {
    editedPicto,
    collectionId
  }) {
    let formData = new FormData();
    formData.append("speech", editedPicto.speech);
    formData.append("meaning", editedPicto.meaning);
    formData.append("folder", editedPicto.folder);
    formData.append("fatherId", editedPicto.fatherId);
    if (editedPicto.image) {
      formData.append("image", editedPicto.image);
    }
    const res = await axios
      .put(URL + "/pictalk/picto/" + editedPicto.id + "/" + collectionId, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

    vuexContext.commit("editPicto", {
      speech: editedPicto.speech,
      meaning: editedPicto.meaning,
      path: URL + "/pictalk/" + res.data.path,
      folder: editedPicto.folder,
      fatherId: editedPicto.fatherId,
      id: editedPicto.id
    });
    return res;
  },
  async removePicto(vuexContext, removedPicto) {
    const res = await axios
      .delete(URL + "/pictalk/picto/" + removedPicto.id);
    vuexContext.commit("removePicto", removedPicto);
    return res;
  },

  setCollections(vuexContext, collections) {
    vuexContext.commit("setCollections", collections);
  },
  async addCollection(vuexContext, collection) {
    let formData = new FormData();
    formData.append("image", collection.image);
    formData.append("name", collection.name);
    formData.append("color", collection.color);
    const res = await axios
      .post(URL + "/pictalk/collection", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    vuexContext.commit("addCollection", {
      name: collection.name,
      color: collection.name,
      path: URL + "/pictalk/" + res.data.path,
      id: res.data.id
    });
    return res;
  },
  async editCollection(vuexContext, editedCollection) {
    let formData = new FormData();
    formData.append("name", editedCollection.name);
    formData.append("color", editedCollection.color);
    if (editedCollection.image) {
      formData.append("image", editedCollection.image);
    }
    const res = await axios
      .put(URL + "/pictalk/collection/" + editedCollection.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

    vuexContext.commit("editCollection", {
      name: editedCollection.name,
      color: editedCollection.color,
      path: URL + "/pictalk/" + res.data.path,
      id: editedCollection.id
    });
    return res;
  },

  removeCollection(vuexContext, removedCollectionId) {
    return axios.delete(URL + "/pictalk/collection/" + removedCollectionId).then(() => vuexContext.commit("removeCollection", removedCollectionId)).catch(e => console.log(e));
  },
  authenticateUser(vuexContext, authData) {
    let authUrl = URL + "/auth/signin";
    if (!authData.isLogin) {
      authUrl = URL + "/auth/signup";
    }
    return axios
      .post(authUrl, {
        username: authData.username,
        password: authData.password
      })
      .then(result => {
        const expDate =
          new Date().getTime() + Number.parseInt(result.data.expiresIn) * 1000;
        vuexContext.commit("setToken", result.data.accessToken);
        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("tokenExpiration", expDate);
        Cookie.set("jwt", result.data.accessToken);
        Cookie.set("expirationDate", expDate);
      })
      .catch(e => console.log(e));
  },
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
      console.log("No token or invalid token");
      vuexContext.dispatch("logout");
      return;
    }
    vuexContext.commit("setToken", token);
  },
  logout(vuexContext) {
    vuexContext.commit("clearToken");
    Cookie.remove("jwt");
    Cookie.remove("expirationDate");
    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
    }
  }
};
export const getters = {
  getPictoViews(state) {
    return state.pictoviews;
  },
  getCollections(state) {
    return state.collections;
  },
  isAuthenticated(state) {
    return state.token != null;
  },
  getSpeech(state) {
    return state.pictoSpeech;
  }
};
