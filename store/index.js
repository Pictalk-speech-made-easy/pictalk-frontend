import axios from "axios";
import Cookie from "js-cookie";
import createPersistedState from 'vuex-persistedstate';
export const strict = false;
export const plugins = [createPersistedState()];
export const state = () => ({
  collections: [],
  pictos: [],
  token: null,
  pictoSpeech: [],
  public: [],
  user: {},
  rootId: null,
  sharedId: null,
  sidebarId: null,
  copyCollectionId: null,
  shortcutCollectionId: null,
  temporaryLanguage: null,
});

export const mutations = {
  resetStore(state) {
    state.collections = [];
    state.pictos = [];
    state.pictoSpeech = [];
    state.rootId = null;
    state.copyCollectionId = null;
    state.shortcutCollectionId = null;
    state.user = {};
    state.sharedId = null;
    state.sidebarId = null;
    state.temporaryLanguage = null;
  },
  async addSpeech(state, picto) {
    if (state.pictoSpeech.length && state.pictoSpeech[state.pictoSpeech.length - 1].id == picto.id && !picto.collection) {
      state.pictoSpeech[state.pictoSpeech.length - 1].count += 1;
    } else {
      picto.count = 1;
      state.pictoSpeech.push(picto);
    }
  },
  removeSpeech(state) {
    state.pictoSpeech.pop();
  },
  eraseSpeech(state) {
    state.pictoSpeech = [];
  },
  addCollection(state, newCollections) {
    if (!Array.isArray(newCollections)) {
      newCollections = new Array(newCollections);
    }
    for (let newCollection of newCollections) {
      state.collections.push(newCollection);
      const fatherCollectionIndex = state.collections.findIndex(
        collection => collection.id === newCollection.fatherCollectionId
      );
      if (fatherCollectionIndex !== -1) {
        const collectionIndex = state.collections[fatherCollectionIndex].collections.findIndex(
          collection => collection.id === newCollection.fatherCollectionId
        );
        if (collectionIndex == -1) {
          state.collections[fatherCollectionIndex].collections.push(newCollection);
        }
      }
    }

  },
  removeCollection(state, removedCollection) {
    const collectionIndex = state.collections.findIndex(
      collection => collection.id === removedCollection.id
    );
    state.collections.splice(collectionIndex, 1);
  },
  editCollection(state, editedCollections) {
    if (!Array.isArray(editedCollections)) {
      editedCollections = new Array(editedCollections);
    }
    for (let editedCollection of editedCollections) {
      const collectionIndex = state.collections.findIndex(
        collection => collection.id === editedCollection.id
      );
      Object.assign(state.collections[collectionIndex], editedCollection);
      state.collections.push({});
      state.collections.pop();
    }
  },
  addPicto(state, pictos) {
    if (!Array.isArray(pictos)) {
      pictos = new Array(pictos);
    }
    for (let picto of pictos) {
      const collectionIndex = state.collections.findIndex(
        collection => collection.id === picto.fatherCollectionId
      );
      if (collectionIndex !== -1) {
        const pictoIndex = state.collections[collectionIndex].pictos.findIndex(
          pct => pct.id === picto.id
        );
        if (collectionIndex !== -1 && pictoIndex == -1) {
          state.collections[collectionIndex].pictos.push(picto);
        }
      }
      state.pictos.push(picto);
    }
  },
  editPicto(state, editedPictos) {
    if (!Array.isArray(editedPictos)) {
      editedPictos = new Array(editedPictos);
    }
    for (let editedPicto of editedPictos) {
      const pictoIndex = state.pictos.findIndex(
        picto => picto.id === editedPicto.id
      );
      Object.assign(state.pictos[pictoIndex], editedPicto);
      state.collections.push({});
      state.collections.pop();
    }
  },
  removePicto(state, { pictoId, fatherCollectionId }) {
    const collectionIndex = state.collections.findIndex(
      collection => collection.id === fatherCollectionId
    );
    const pictoIndex = state.collections[collectionIndex].pictos.findIndex(
      picto => picto.id === pictoId
    );
    state.collections[collectionIndex].pictos.splice(pictoIndex, 1);
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
    Object.assign(state.user, user);
  },
  setRootId(state, rootId) {
    state.rootId = rootId;
  },
  setSharedId(state, sharedId) {
    state.sharedId = sharedId;
  },
  setSidebarId(state, sidebarId) {
    state.sidebarId = sidebarId;
  },
  setCopyCollectionId(state, copied) {
    state.copyCollectionId = copied;
  },
  resetCopyCollectionId(state) {
    state.copyCollectionId = null;
  },
  setShortcutCollectionId(state, shortcut) {
    state.shortcutCollectionId = shortcut
  },
  resetShortcutCollectionId(state) {
    state.shortcutCollectionId = null;
  },
  setPublicCollections(state, collections) {
    state.public = collections;
  },
  setTemporaryLanguage(state, language) {
    state.temporaryLanguage = language;
  },
  removeMailingList(state, index) {
    state.user.mailingList.splice(index, 1);
  },
  addMailingList(state, mailingList) {
    state.user.mailingList.push(mailingList);
  }
};
export const actions = {
  async userExists(vuexContext, username) {
    try {
      const exists = (await axios.get(`/user/verify/${username.username}`)).status;
      if (exists == 200) {
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }

  },
  resetCollections(vuexContext) {
    vuexContext.commit("resetCollections");
  },
  async addPicto(vuexContext, picto) {
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
      .post("/picto/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;
    const editedNewPicto = {
      speech: picto.speech,
      meaning: picto.meaning,
      color: picto.color,
      userId: newPicto.userId,
      image: axios.defaults.baseURL + "/image/pictalk/" + newPicto.image,
      fatherCollectionId: picto.fatherCollectionId,
      id: newPicto.id,
      starred: JSON.parse(newPicto.starred),
      editors: newPicto.editors,
      viewers: newPicto.viewers,
      public: newPicto.public,
      createdDate: newPicto.createdDate,
      updatedDate: newPicto.updatedDate
    }
    vuexContext.commit("addPicto", editedNewPicto);
    return editedNewPicto;
  },
  async editPicto(vuexContext, picto) {
    let formData = new FormData();
    formData.append("speech", JSON.stringify(picto.speech));
    formData.append("meaning", JSON.stringify(picto.meaning));
    formData.append("color", picto.color);
    formData.append("share", picto.shared);
    formData.append("starred", picto.starred);
    //formData.append("collectionIds", picto.collectionIds);
    if (picto.image) {
      formData.append("image", picto.image);
    }
    const editedPicto = (await axios
      .put("/picto/" + picto.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;

    vuexContext.commit("editPicto", {
      speech: picto.speech,
      meaning: picto.meaning,
      color: picto.color,
      collections: editedPicto.collections,
      userId: editedPicto.userId,
      shared: editedPicto.shared,
      image: axios.defaults.baseURL + "/image/pictalk/" + editedPicto.image,
      fatherCollectionId: picto.fatherCollectionId,
      id: picto.id,
      starred: JSON.parse(editedPicto.starred),
      editors: editedPicto.editors,
      viewers: editedPicto.viewers,
      public: editedPicto.public,
      createdDate: editedPicto.createdDate,
      updatedDate: editedPicto.updatedDate,
    });
  },
  async removePicto(vuexContext, { pictoId, fatherCollectionId }) {
    const res = await axios
      .delete("/picto/", { params: { pictoId: pictoId, fatherId: fatherCollectionId } });
    vuexContext.commit("removePicto", { pictoId, fatherCollectionId });
    return res;
  },
  async alternatePictoStar(vuexContext, picto) {
    let formData = new FormData();
    formData.append("starred", picto.starred);
    const editedPicto = (await axios
      .put("/picto/" + picto.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;
    vuexContext.commit("editPicto", {
      starred: JSON.parse(editedPicto.starred),
      id: editedPicto.id
    });
  },
  async alternateCollectionStar(vuexContext, collection) {
    let formData = new FormData();
    formData.append("starred", collection.starred);
    const editedCollection = (await axios
      .put("/collection/" + collection.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;
    vuexContext.commit("editCollection", {
      starred: JSON.parse(editedCollection.starred),
      id: editedCollection.id
    });
  },
  async addCollection(vuexContext, collection) {
    let formData = new FormData();
    formData.append("speech", JSON.stringify(collection.speech));
    formData.append("meaning", JSON.stringify(collection.meaning));
    formData.append("color", collection.color);
    formData.append("fatherCollectionId", collection.fatherCollectionId);
    //formData.append("collectionIds", collection.collectionIds);
    //formData.append("pictoIds", collection.pictoIds);
    formData.append("share", collection.share);
    formData.append("image", collection.image);
    const newCollection = (await axios
      .post("/collection", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;
    const editedNewCollection = {
      speech: collection.speech,
      meaning: collection.meaning,
      color: collection.color,
      collection: true,
      collections: newCollection.collections ? newCollection.collections : [],
      userId: newCollection.userId,
      image: axios.defaults.baseURL + "/image/pictalk/" + newCollection.image,
      fatherCollectionId: collection.fatherCollectionId,
      pictos: newCollection.pictos ? newCollection.pictos : [],
      viewers: newCollection.viewers ? newCollection.viewers : [],
      editors: newCollection.editors ? newCollection.editors : [],
      id: newCollection.id,
      starred: JSON.parse(newCollection.starred),
      createdDate: newCollection.createdDate,
      updatedDate: newCollection.updatedDate
    };
    vuexContext.commit("addCollection", editedNewCollection);
    return editedNewCollection;
  },
  async editCollection(vuexContext, collection) {
    let formData = new FormData();
    if (collection.speech) {
      formData.append("speech", JSON.stringify(collection.speech));
    }
    if (collection.meaning) {
      formData.append("meaning", JSON.stringify(collection.meaning));
    }
    if (collection.color) {
      formData.append("color", collection.color);
    }
    if (collection.collections && collection.collections.length !== 0) {
      collection.collections.map((col, index) => formData.append('collectionIds[' + index + ']', col.id));
    }
    if (collection.pictos && collection.pictos.length !== 0) {
      collection.pictos.map((pict, index) => formData.append('pictoIds[' + index + ']', pict.id));
    }
    if (collection.share) {
      formData.append("share", collection.share);
    }
    if (collection.starred) {
      formData.append("starred", collection.starred);
    }
    if (collection.image) {
      formData.append("image", collection.image);
    }
    const editedCollection = (await axios
      .put("/collection/" + collection.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;

    vuexContext.commit("editCollection", {
      ...editedCollection,
      ...(editedCollection.meaning && { meaning: JSON.parse(editedCollection.meaning) }),
      ...(editedCollection.speech && { speech: JSON.parse(editedCollection.speech) }),
      ...(editedCollection.starred && { starred: JSON.parse(editedCollection.starred) }),
      image: axios.defaults.baseURL + "/image/pictalk/" + editedCollection.image,
      createdDate: editedCollection.createdDate,
      updatedDate: editedCollection.updatedDate,
      collections: editedCollection.collections.map((colle) => parseAndUpdateEntireCollection(vuexContext, colle)),
      pictos: editedCollection.pictos.map((pict) => parseAndUpdatePictogram(vuexContext, pict)),
    });
  },
  async removeCollection(vuexContext, { collectionId, fatherCollectionId }) {
    const res = await axios.delete("/collection/", { params: { collectionId: collectionId, fatherId: fatherCollectionId } });
    const collectionIndex = vuexContext.getters.getCollections.findIndex((col) => col.id == fatherCollectionId);
    const collection = vuexContext.getters.getCollections[collectionIndex];
    const collectionCollectionsIndex = vuexContext.getters.getCollections[collectionIndex].collections.findIndex((col) => col.id == collectionId);
    const editedCollection = JSON.parse(JSON.stringify(collection));
    editedCollection.collections.splice(collectionCollectionsIndex, 1);
    vuexContext.commit("editCollection", editedCollection);
    return res;
  },
  async authenticateUser(vuexContext, authData) {
    const res = await axios
      .post("/auth/signin", {
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
    if (token != vuexContext.getters.getToken) {
      vuexContext.commit("setToken", token);
    }
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
  async getUser(vuexContext) {
    var user = (await axios.get("/user/details/")).data;
    vuexContext.commit('setSharedId', user.shared);
    vuexContext.commit('setSidebarId', user.sider);
    vuexContext.commit('setRootId', user.root);
    user.language = JSON.parse(user.language);
    user.languages = JSON.parse(user.languages);
    user.settings = JSON.parse(user.settings);
    if (user.mailingList) {
      user.mailingList = JSON.parse(user.mailingList);
    }
    vuexContext.commit("editUser", user);
  },
  async editUser(vuexContext, user) {
    user.language = JSON.stringify(user.language);
    user.languages = JSON.stringify(user.languages);
    user.settings = JSON.stringify(user.settings);
    user.mailingList = JSON.stringify(user.mailingList);
    const newUser = (await axios
      .put("/user/details/", user)).data;
    vuexContext.commit("editUser", {
      username: newUser.username,
      displayLanguage: newUser.displayLanguage,
      language: JSON.parse(newUser.language),
      languages: JSON.parse(newUser.languages),
      settings: JSON.parse(newUser.settings),
      mailingList: JSON.parse(newUser.mailingList),
      directSharers: newUser.directSharers
    });
    return newUser;
  },
  async downloadCollections(vuexContext) {
    const res = await axios.get("/collection");
    res.data.map(collection => parseAndUpdateEntireCollection(vuexContext, collection, true)
    );
  },
  async copyCollectionById(vuexContext, { collectionId, fatherCollectionId }) {
    const params = new URLSearchParams();
    params.append('collectionId', collectionId);
    params.append('fatherCollectionId', fatherCollectionId);
    const editedCollection = (await axios
      .post("/collection/copy", params, {
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      })).data;
    parseAndUpdateEntireCollection(vuexContext, editedCollection);
    vuexContext.commit("resetCopyCollectionId");
    const index = editedCollection.collections.findIndex((coll) => coll.id == collectionId);
    return editedCollection.collections[index];
  },
  async copyPictoById(vuexContext, { pictoId, fatherCollectionId }) {
    const params = new URLSearchParams();
    params.append('pictoId', pictoId);
    params.append('fatherCollectionId', fatherCollectionId);
    const editedCollection = (await axios
      .post("/picto/copy", params, {
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      })).data;
    parseAndUpdateEntireCollection(vuexContext, editedCollection);
    vuexContext.commit("resetCopyCollectionId");
    const index = editedCollection.pictos.findIndex((pict) => pict.id == pictoId);
    return editedCollection.pictos[index];
  },
  async getPublicCollections(vuexContext, publicSearch) {
    const publicCollections = (await axios
      .get(`/collection/public?search=${publicSearch.search}&page=${publicSearch?.page}&per_page=${publicSearch?.per_page}`)).data;
    vuexContext.commit('setPublicCollections', publicCollections.map((col) => col.id));
    return publicCollections.map(collection =>
      parseAndUpdateEntireCollection(vuexContext, collection)
    );

  },
  async publish(vuexContext, collection) {
    let formData = new URLSearchParams();
    formData.append('publish', collection.public ? 0 : 1);
    const published = (await axios.put(`/collection/publish/${collection.id}`, formData)).data;
    console.log(published);
    parseAndUpdateEntireCollection(vuexContext, published);
  },
  async shareCollection(vuexContext, { collectionId, usernames, role, access }) {
    const params = new URLSearchParams();
    params.append('access', access);
    usernames.forEach((username) => params.append('usernames[]', username));
    params.append('role', role);
    const sharedCollection = (await axios.put('/collection/share/' + collectionId, params, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded'
      }
    })).data;
    if (sharedCollection) {
      parseAndUpdateEntireCollection(vuexContext, sharedCollection);
    }
  },
  async deleteNotifications(vuexContext) {
    const notifications = (await axios.delete('/user/notification')).data;
    const user = JSON.parse(JSON.stringify(vuexContext.getters.getUser));
    user.notifications = notifications;
    vuexContext.commit('editUser', user);
  },
  async serachImages(vuexContext, query) {
    const images = (await axios.get(`/image/web/?search=${query.search}&language=${query.language}`, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded'
      }
    })).data;
    return images;
  },
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
  getToken(state) {
    return state.token;
  },
  getUser(state) {
    return state.user;
  },
  getRootId(state) {
    return state.rootId;
  },
  getSharedId(state) {
    return state.sharedId;
  },
  getSidebarId(state) {
    return state.sidebarId;
  },
  getCopyCollectionId(state) {
    return state.copyCollectionId;
  },
  getShortcutCollectionId(state) {
    return state.shortcutCollectionId;
  },
  getPictos(state) {
    return state.pictos;
  },
  getPublicCollections(state) {
    return state.public;
  },
  getTemporaryLanguage(state) {
    return state.temporaryLanguage;
  }
};

function parseAndUpdateEntireCollection(vuexContext, collection, isFullSync = false) {
  let pictosToEdit = [];
  let pictosTocreate = [];
  let collectionsToEdit = [];
  let collectionsToCreate = [];
  let localCollection = getCollectionFromId(vuexContext, collection.id);
  let existsCollection = localCollection?.id == collection.id;
  let updateCollection = (localCollection?.updatedDate != collection.updatedDate) && existsCollection;
  const partialCollection = localCollection?.partial;
  if (!existsCollection || updateCollection || partialCollection) {
    if (collection.image) {
      collection.image =
        axios.defaults.baseURL +
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

    if (collection.collections && collection.pictos) {
      collection.partial = false;
    } else {
      collection.partial = true;
    }

    if (!existsCollection) {
      collectionsToCreate.push(collection);
    }
    if (updateCollection || partialCollection) {
      collectionsToEdit.push(collection);
    }
  }

  if (collection.pictos && !collection.pictos.length == 0) {
    collection.pictos.map((picto) => {
      let localPicto = getPictoFromId(vuexContext, picto.id);
      let existsPicto = localPicto?.id == picto.id;
      let updatePicto = (localPicto?.updatedDate != picto.updatedDate) && existsPicto;
      if (!existsPicto || updatePicto) {
        if (picto.image) {
          picto.image =
            axios.defaults.baseURL +
            "/image/pictalk/" +
            picto.image;
        }
        if (picto.meaning) {
          picto.meaning = JSON.parse(picto.meaning);
        }
        if (picto.speech) {
          picto.speech = JSON.parse(picto.speech);
        }
        picto.fatherCollectionId = collection.id;
        if (!existsPicto) {
          pictosTocreate.push(picto);
        }
        if (updatePicto) {
          pictosToEdit.push(picto);
        }
      }

    });
  }
  if (collection.collections && !collection.collections.length == 0) {
    collection.collections.map((col) => {
      let localCollection = getCollectionFromId(vuexContext, col.id);
      let existsCollection = localCollection?.id == col.id;
      let updateCollection = (localCollection?.updatedDate != col.updatedDate) && existsCollection;
      const partialCollection = localCollection?.partial;
      if (!existsCollection || updateCollection || partialCollection) {
        if (col.image) {
          col.image =
            axios.defaults.baseURL +
            "/image/pictalk/" +
            col.image;
        }
        if (col.meaning) {
          col.meaning = JSON.parse(col.meaning);
        }
        if (col.speech) {
          col.speech = JSON.parse(col.speech);
        }
        if (!col.pictos) {
          col.pictos = [];
        }
        if (!col.collections) {
          col.collections = [];
        }
        col.collection = true;

        col.partial = true;

        col.fatherCollectionId = collection.id;
        if (!existsCollection) {
          collectionsToCreate.push(col);
        }
        if (updateCollection || partialCollection) {
          collectionsToEdit.push(col);
        }
      }
    });
  }
  if (collectionsToCreate.length > 0) {
    vuexContext.commit("addCollection", collectionsToCreate);
  }
  if (collectionsToEdit.length > 0) {
    vuexContext.commit("editCollection", collectionsToEdit);
  }
  if (pictosTocreate.length > 0) {
    vuexContext.commit("addPicto", pictosTocreate);
  }
  if (pictosToEdit.length > 0) {
    vuexContext.commit("editPicto", pictosToEdit);
  }
  console.log(collection);
  if (!(!existsCollection || updateCollection || partialCollection)) {
    return localCollection;
  } else {
    return collection;
  }
}

function parseAndUpdatePictogram(vuexContext, picto) {
  if (picto.image) {
    picto.image =
      axios.defaults.baseURL +
      "/image/pictalk/" +
      picto.image;
  }
  if (picto.meaning) {
    picto.meaning = JSON.parse(picto.meaning);
  }
  if (picto.speech) {
    picto.speech = JSON.parse(picto.speech);
  }
  if (!getPictoFromId(vuexContext, picto.id)) {
    vuexContext.commit("addPicto", picto);
  } else {
    vuexContext.commit("editPicto", picto);
  }
  return picto;
}

function getCollectionFromId(vuexContext, id) {
  const index = vuexContext.getters.getCollections.findIndex((collection) => collection.id === id);
  return vuexContext.getters.getCollections[index];
}
function getPictoFromId(vuexContext, id) {
  const index = vuexContext.getters.getPictos.findIndex((picto) => picto.id === id);
  return vuexContext.getters.getPictos[index];
}
