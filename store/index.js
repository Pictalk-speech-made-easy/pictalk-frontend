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
    state.pictoviews[fatherPictoIndex].push(picto);
  },
  editPicto(state, editedPicto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.id === editedPicto.fatherId
    );
    const pictoIndex = state.pictoviews[fatherPictoIndex].findIndex(
      picto => picto.id === editedPicto.id
    );
    state.pictoviews[fatherPictoIndex].pictos[pictoIndex] = editedPicto;
  },
  removePicto(state, removedPicto) {
    const fatherPictoIndex = state.pictoviews.findIndex(
      view => view.id === removedPicto.fatherId
    );
    const pictoIndex = state.pictoviews[fatherPictoIndex].findIndex(
      picto => picto.id === removedPicto.id
    );
    const viewIndex = state.pictoviews.findIndex(
      view => view.id === removedPicto.id
    );
    if (viewIndex !== -1) {
      delete state.pictoviews[viewIndex];
    }
    delete state.pictoviews[fatherPictoIndex].pictos[pictoIndex];
  },

  setCollections(state, collections) {
    state.collections = collections;
  },
  addCollection(state, collection) {
    state.collections.push(collection);
  },
  editCollection(state, editedCollection) {
    const collectionIndex = state.collections.findIndex(
      collection => collection === editedCollection.id
    );
    state.collections[collectionIndex] = editedCollection;
  },
  removeCollection(state, removedCollection) {
    const collectionIndex = state.collections.findIndex(
      collection => collection === removedCollection.id
    );
    delete state.collections[collectionIndex];
  },

  setToken(state, token) {
    state.token = token;
  },
  clearToken(state) {
    state.token = null;
  }
};
export const actions = {
  addSpeech(vuexContext, picto) {
    vuexContext.commit("addSpeech", picto);
  },
  removeSpeech(vuexContext) {
    vuexContext.commit("removeSpeech");
  },
  eraseSpeech(vuexContext) {
    vuexContext.commit("eraseSpeech");
  },

  addView(vuexContext, pictos, fatherId) {
    const view = {
      id: fatherId,
      pictos: pictos
    };
    vuexContext.commit("addView", view);
  },

  addPicto(vuexContext, picto, collection_nb) {
    return axios
      .post(URL + "/pictalk/picto/" + collection_nb, picto)
      .then(() => {
        vuexContext.commit("addPicto", {
          ...picto,
          id: result.data.id
        });
        if (picto.folder) {
          vuexContext.commit("addView", {
            id: picto.id,
            pictos: []
          });
        }
      })
      .catch(e => console.log(e));
  },
  editPicto(vuexContext, editedPicto, collection_nb) {
    return axios
      .put(
        URL + "/pictalk/picto/" + collection_nb + "/" + editedPicto.id,
        editedPicto
      )
      .then(res => vuexContext.commit("editPicto", editedPicto))
      .catch(e => console.log(e));
  },
  removePicto(vuexContext, removedPicto) {
    return axios
      .delete(URL + "/pictalk/picto/" + removedPicto.id)
      .then(() => {
        vuexContext.commit("removePicto", removedPicto);
      })
      .catch(e => console.log(e));
  },

  setCollections(vuexContext, collections) {
    vuexContext.commit("setCollections", collections);
  },
  addCollection(vuexContext, collection, file) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("name", collection.name);
    formData.append("color", collection.color);
    return axios
      .post(URL + "/pictalk/collection", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() =>
        vuexContext.commit("addCollection", {
          ...collection,
          id: result.data.id
        })
      )
      .catch(e => console.log(e));
  },
  editCollection(vuexContext, editedCollection) {
    return axios
      .put(URL + "/pictalk/collection/" + editedCollection.id, editedCollection)
      .then(() => vuexContext.commit("editCollection", editedCollection))
      .catch(e => console.log(e));
  },
  removeCollection(vuexContext, removedCollection) {
    return axios
      .delete(URL + "/pictalk/collection/" + editedCollection.id)
      .then(() => vuexContext.commit("removeCollection", removedCollection))
      .catch(e => console.log(e));
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
  getPictoView(state) {
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
