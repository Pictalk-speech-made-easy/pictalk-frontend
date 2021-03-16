import axios from "axios";
import Cookie from "js-cookie";

export const state = () => ({
  pictoviews: [],
  collections: [],
  token: null,
  pictoSpeech: [],
  user: {}
});
const URL = "";

export const mutations = {
  resetStore(state) {
    state.pictoviews = [];
    state.collections = [],
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

  addView(state, pictoView) {
    state.pictoviews.push(pictoView);
  },

  addPicto(state, picto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.fatherId === picto.picto.fatherId &&
        view.collectionId === picto.collectionId
    );
    state.pictoviews[fatherPictoIndex].pictos.push(picto.picto);
  },
  editPicto(state, editedPicto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.fatherId === editedPicto.editedPicto.fatherId &&
        view.collectionId === editedPicto.collectionId
    );
    const pictoIndex = state.pictoviews[fatherPictoIndex].pictos.findIndex(
      picto => picto.id === editedPicto.editedPicto.id
    );
    state.pictoviews[fatherPictoIndex].pictos.splice(pictoIndex, 1);
    state.pictoviews[fatherPictoIndex].pictos.push(editedPicto.editedPicto);
  },
  removePicto(state, removedPicto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.fatherId === removedPicto.picto.fatherId &&
        view.collectionId === removedPicto.collectionId
    );
    const pictoIndex = state.pictoviews[fatherPictoIndex].pictos.findIndex(
      picto => picto.id === removedPicto.picto.id
    );
    const viewIndex = state.pictoviews.findIndex(
      view => view.fatherId === removedPicto.picto.id &&
        view.collectionId === removedPicto.collectionId
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
  resetViews(state) {
    state.pictoviews = [];
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

};
export const actions = {
  resetViews(vuexContext) {
    vuexContext.commit("resetViews");
  },
  addView(vuexContext, {
    pictos,
    fatherId,
    collectionId
  }) {
    const view = {
      fatherId: fatherId,
      pictos: pictos,
      collectionId: collectionId
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
      picto: {
        speech: picto.speech,
        meaning: picto.meaning,
        path: axios.defaults.baseURL + "/pictalk/image/" + res.data.path,
        folder: picto.folder,
        fatherId: picto.fatherId,
        id: res.data.id
      },
      collectionId: collectionId
    });
    if (picto.folder == 1) {
      vuexContext.commit("addView", {
        fatherId: res.data.id,
        pictos: [],
        collectionId: collectionId
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
      editedPicto: {
        speech: editedPicto.speech,
        meaning: editedPicto.meaning,
        path: axios.defaults.baseURL + "/pictalk/image/" + res.data.path,
        folder: editedPicto.folder,
        fatherId: editedPicto.fatherId,
        id: editedPicto.id
      },
      collectionId: collectionId
    });
    return res;
  },
  async removePicto(vuexContext, removedPicto) {
    const res = await axios
      .delete(URL + "/pictalk/picto/" + removedPicto.picto.id);
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
      color: collection.color,
      path: axios.defaults.baseURL + "/pictalk/image/" + res.data.path,
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
      path: axios.defaults.baseURL + "/pictalk/image/" + res.data.path,
      id: editedCollection.id
    });
    return res;
  },

  removeCollection(vuexContext, removedCollectionId) {
    return axios.delete(URL + "/pictalk/collection/" + removedCollectionId).then(() => vuexContext.commit("removeCollection", removedCollectionId)).catch(e => console.log(e));
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
    Cookie.set("jwt", res.data.accessToken);
    Cookie.set("expirationDate", expDate);
    return res;
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
    vuexContext.commit("resetStore");
  },
  async editUser(vuexContext, user) {
    const res = await axios
      .put(URL + "/auth/details/", user);
    vuexContext.commit("editUser", {
      username: user.username,
      language: user.language
    });
    return res;
  },
  async downloadAll(vuexContext) {
    this.dl_launched = true;
    const res = await axios.get("/pictalk/allPictos");
    var views = vuexContext.getters.getPictoViews;
    var already_saved_pictos = [];
    await vuexContext.dispatch("resetViews");
    await views.forEach((view) => {
      view.pictos.forEach((picto) => {
        already_saved_pictos.push(picto.id);
      });
    });
    this.nb_requests = res.data.length - already_saved_pictos.length;
    res.data.map(picto => {
      if (!already_saved_pictos.find((elem) => elem == picto.id)) {
        if (picto.path) {
          picto.path =
            axios.defaults.baseURL + "/pictalk/image/" + picto.path;
        }
        // View existante pour le picto ?
        const viewExists = views.findIndex(
          view => view.fatherId === picto.fatherId &&
            view.collectionId === picto.collectionId
        );
        if (picto.folder == 1) {
          const folderExists = views.findIndex(
            view => view.fatherId === picto.id &&
              view.collectionId === picto.collectionId
          );
          if (folderExists != -1) {
            views.push({ collectionId: picto.collectionId, fatherId: picto.id, pictos: Array() }); //View of folder
          }
        }
        if (viewExists == -1) {
          views.push({ collectionId: picto.collectionId, fatherId: picto.fatherId, pictos: Array() }); //Add view if not here
          views[views.length - 1].pictos.push({ ...picto });
        } else {
          views[viewExists].pictos.push({ ...picto });
          already_saved_pictos.push(picto.id);
        }
      }
    });
    views.forEach((view) => {
      vuexContext.dispatch('addView', view);
    });

    return;
  }
}
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
  },
  getUser(state) {
    return state.user;
  }
};
