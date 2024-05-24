import axios from "axios";
import Cookie from "js-cookie";
export const strict = false;

// use the axios middleware
axios.interceptors.request.use((config) => {
  if (!config.url.includes('api.arasaac.org') && !config.url.includes('flickr.com') && !config.url.includes('staticflickr.com')) {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
},);

function getDexieDB() {
  if (process.client) {
    return require('~/plugins/dexieDB').db;
  }
}


export const state = () => ({
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
  publicBundles: null,
  dragndrop: null,
  ttsBoundarySupport: null,
});

export const mutations = {
  resetStore(state) {
    state.pictoSpeech = [];
    state.rootId = null;
    state.copyCollectionId = null;
    state.shortcutCollectionId = null;
    state.user = {};
    state.sharedId = null;
    state.sidebarId = null;
    state.temporaryLanguage = null;
    state.publicBundles = null;
    state.dragndrop = null;
    state.token = null;
  },
  async setTtsBoundarySupport(state, ttsBoundarySupport) {
    state.ttsBoundarySupport = ttsBoundarySupport;
  },
  async setPublicBundles(state, bundles) {
    state.publicBundles = bundles;
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
  },
  setDragndrop(state, dragndrop) {
    state.dragndrop = dragndrop;
  }
};
export const actions = {
  async getCollectionFromId(vuexContext, collectionId) {
    return getDexieDB().collection.get(collectionId);
  },
  async getCollectionFromFatherId(vuexContext, fatherCollectionId) {
    return getDexieDB().collection.get(fatherCollectionId);
  },
  async getPictoFromId(vuexContext, pictoId) {
    return getDexieDB().pictogram.get(pictoId);
  },
  async moveToCollection(vuexContext, { moveToCollectionDto, fatherCollectionId }) {
    await axios
      .put(`/collection/move/${fatherCollectionId}`,
        {
          ...(moveToCollectionDto.sourcePictoId && {
            sourcePictoId: String(moveToCollectionDto.sourcePictoId),
          }),
          ...(moveToCollectionDto.sourceCollectionId && {
            sourceCollectionId: String(moveToCollectionDto.sourceCollectionId),
          }),
          targetCollectionId: String(moveToCollectionDto.targetCollectionId),
        }
      );

    const fatherCollection = getDexieDB().collection.get(fatherCollectionId);
    if (moveToCollectionDto.sourceCollectionId) {
      fatherCollection.collections.splice(fatherCollection.collections.findIndex((col) => col.id == moveToCollectionDto.sourceCollectionId), 1)
    } else if (moveToCollectionDto.sourcePictoId) {
      fatherCollection.pictos.splice(fatherCollection.pictos.findIndex((col) => col.id == moveToCollectionDto.sourcePictoId), 1)
    }
    getDexieDB().collection.put(fatherCollection);

    if (moveToCollectionDto.sourceCollectionId) {
      const targetFatherCollection = getDexieDB().collection.get(moveToCollectionDto.targetCollectionId);
      targetFatherCollection.collections.push(moveToCollectionDto.sourceCollectionId);
      getDexieDB().collection.put(targetFatherCollection);
    } else if (moveToCollectionDto.sourcePictoId) {
      const targetFatherCollection = getDexieDB().collection.get(moveToCollectionDto.targetCollectionId);
      targetFatherCollection.pictos.push(moveToCollectionDto.sourcePictoId);
      getDexieDB().collection.put(targetFatherCollection);
    }
  },
  resetCollections(vuexContext) {
    getDexieDB().delete();
  },
  async getPublicBundles(vuexContext) {
    try {
      let publicBundles = (await axios.get('/collection/levels')).data;
      publicBundles = Object.keys(publicBundles).map((key) => { parseAndUpdateEntireCollection(vuexContext, publicBundles[key]); return { id: publicBundles[key].id, level: key } });
      //publicBundles = publicBundles.map((bundle) => { parseAndUpdateEntireCollection(vuexContext, bundle); bundle.level = bundle; return bundle.id; });
      vuexContext.commit('setPublicBundles', publicBundles);
      return publicBundles;
    } catch (err) {
      console.log(err)
    }
  },
  async addPicto(vuexContext, picto) {
    let formData = new FormData();
    formData.append("speech", JSON.stringify(picto.speech));
    formData.append("meaning", JSON.stringify(picto.meaning));

    if (picto.color != 0) {
      formData.append("color", picto.color);
    }
    if (picto.pictohubId) {
      formData.append("pictohubId", picto.pictohubId);
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
      priority: JSON.parse(newPicto.priority),
      editors: newPicto.editors,
      viewers: newPicto.viewers,
      public: newPicto.public,
      createdDate: newPicto.createdDate,
      updatedDate: newPicto.updatedDate,
      ...(picto.pictohubId && { pictohubId: Number(picto.pictohubId) }),
    }
    getDexieDB().pictogram.put(editedNewPicto);
    return editedNewPicto;
  },
  async editPicto(vuexContext, picto) {
    let formData = new FormData();
    formData.append("speech", JSON.stringify(picto.speech));
    formData.append("meaning", JSON.stringify(picto.meaning));
    formData.append("color", picto.color);
    formData.append("share", picto.shared);
    formData.append("priority", picto.priority);

    if (picto.pictohubId) {
      formData.append("pictohubId", picto.pictohubId);
    }
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
    getDexieDB().pictogram.put({
      speech: picto.speech,
      meaning: picto.meaning,
      color: picto.color,
      collections: editedPicto.collections,
      userId: editedPicto.userId,
      shared: editedPicto.shared,
      image: axios.defaults.baseURL + "/image/pictalk/" + editedPicto.image,
      fatherCollectionId: picto.fatherCollectionId,
      id: picto.id,
      priority: JSON.parse(editedPicto.priority),
      editors: editedPicto.editors,
      viewers: editedPicto.viewers,
      public: editedPicto.public,
      createdDate: editedPicto.createdDate,
      updatedDate: editedPicto.updatedDate,
      ...(picto.pictohubId && { pictohubId: Number(picto.pictohubId) }),
    });
  },
  async removePicto(vuexContext, { pictoId, fatherCollectionId }) {
    const res = await axios
      .delete("/picto/", { params: { pictoId: pictoId, fatherId: fatherCollectionId } });
    const collection = getDexieDB().collection.get(fatherCollectionId);
    collection.pictos.splice(collection.pictos.findIndex((pict) => pict.id == pictoId), 1);
    return res;
  },
  async alternatePictoStar(vuexContext, picto) {
    let formData = new FormData();
    formData.append("priority", picto.priority);
    const editedPicto = (await axios
      .put("/picto/" + picto.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;
    getDexieDB().pictogram.put({
      priority: JSON.parse(editedPicto.priority),
      id: editedPicto.id
    });
  },
  async alternateCollectionStar(vuexContext, collection) {
    let formData = new FormData();
    formData.append("priority", collection.priority);
    const editedCollection = (await axios
      .put("/collection/" + collection.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;
    getDexieDB().collection.put({
      priority: JSON.parse(editedCollection.priority),
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

    if (collection.pictohubId) {
      formData.append("pictohubId", collection.pictohubId);
    }

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
      collections: newCollection.collections ? newCollection.collections.map((collection) => collection.id) : [],
      userId: newCollection.userId,
      image: axios.defaults.baseURL + "/image/pictalk/" + newCollection.image,
      fatherCollectionId: collection.fatherCollectionId,
      pictos: newCollection.pictos ? newCollection.pictos.map((picto) => picto.id) : [],
      viewers: newCollection.viewers ? newCollection.viewers : [],
      editors: newCollection.editors ? newCollection.editors : [],
      id: newCollection.id,
      priority: JSON.parse(newCollection.priority),
      createdDate: newCollection.createdDate,
      updatedDate: newCollection.updatedDate,
      ...(collection.pictohubId && { pictohubId: Number(collection.pictohubId) }),
    };
    getDexieDB().collection.put(editedNewCollection);
    return editedNewCollection;
  },
  async editCollection(vuexContext, collection) {
    let formData = new FormData();
    if (collection.speech) {
      formData.append("speech", JSON.stringify(collection.speech));
    }

    if (collection.pictohubId) {
      formData.append("pictohubId", collection.pictohubId);
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
    if (collection.priority) {
      formData.append("priority", collection.priority);
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
    getDexieDB().collection.put({
      ...editedCollection,
      ...(editedCollection.meaning && { meaning: editedCollection.meaning }),
      ...(editedCollection.speech && { speech: editedCollection.speech }),
      ...(editedCollection.priority && { priority: JSON.parse(editedCollection.priority) }),
      image: axios.defaults.baseURL + "/image/pictalk/" + editedCollection.image,
      createdDate: editedCollection.createdDate,
      updatedDate: editedCollection.updatedDate,
      collections: editedCollection.collections.map((colle) => parseAndUpdateEntireCollection(vuexContext, colle)),
      pictos: editedCollection.pictos.map((pict) => parseAndUpdatePictogram(vuexContext, pict)),
      ...(collection.pictohubId && { pictohubId: Number(collection.pictohubId) }),
    });
  },
  async removeCollection(vuexContext, { collectionId, fatherCollectionId }) {
    const res = await axios.delete("/collection/", { params: { collectionId: collectionId, fatherId: fatherCollectionId } });
    const collectionIndex = vuexContext.getters.getCollections.findIndex((col) => col.id == fatherCollectionId);
    const collection = vuexContext.getters.getCollections[collectionIndex];
    const collectionCollectionsIndex = vuexContext.getters.getCollections[collectionIndex].collections.findIndex((col) => col.id == collectionId);
    const editedCollection = JSON.parse(JSON.stringify(collection));
    editedCollection.collections.splice(collectionCollectionsIndex, 1);
    getDexieDB().collection.put(editedCollection);
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
    Cookie.set("jwt", res.data.accessToken, { sameSite: 'none', secure: true, expires: 7 });
    Cookie.set("expirationDate", expDate, { sameSite: 'none', secure: true, expires: 7 });
    createDatabaseForUser(authData.username);
    axios.interceptors.request.use((config) => {
      if (!config.url.includes('api.arasaac.org') && !config.url.includes('flickr.com') && !config.url.includes('staticflickr.com')) {
        let token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
      (error) => {
        return Promise.reject(error);
      });

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
    if (!Cookie.get('jwt') && token) {
      Cookie.set("jwt", token, { sameSite: 'none', secure: true, expires: 7 });
    }
    if (!Cookie.get('expirationDate') && expirationDate) {
      Cookie.set("expirationDate", expirationDate, { sameSite: 'none', secure: true, expires: 7 });
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
    user.notifications.forEach((notification) => {
      if (notification.meaning != "") {
        try {
          notification.meaning = JSON.parse(notification.meaning)
        } catch (err) {
          notification.meaning = notification.meaning
        }
      }
    });
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
  async getOrphanedCollections(vuexContext) {
    const orphanedCollections = (await axios.get("/collection/orphaned")).data;
    return orphanedCollections.map(collection =>
      parseAndUpdateEntireCollection(vuexContext, collection)
    );
  },
  async downloadCollections(vuexContext, alreadyFetchedCollections = null) {
    let res;
    if (alreadyFetchedCollections) {
      res = alreadyFetchedCollections;
    } else {
      res = (await axios.get("/collection")).data;
    }
    let toUpdate = res.map(collection => parseAndUpdateEntireCollection(vuexContext, collection, true));
    let collectionsToCreate = [];
    let collectionsToEdit = [];
    let pictosTocreate = [];
    let pictosToEdit = [];
    for (let update of toUpdate) {
      collectionsToCreate = collectionsToCreate.concat(update.collectionsToCreate);
      collectionsToEdit = collectionsToEdit.concat(update.collectionsToEdit);
      pictosTocreate = pictosTocreate.concat(update.pictosTocreate);
      pictosToEdit = pictosToEdit.concat(update.pictosToEdit);
    }
    if (collectionsToCreate.length > 0) {
      getDexieDB().collection.bulkPut(collectionsToCreate);
    }
    if (collectionsToEdit.length > 0) {
      getDexieDB().collection.bulkPut(collectionsToCreate);
    }
    if (pictosTocreate.length > 0) {
      getDexieDB().pictogram.bulkPut(pictosTocreate);
    }
    if (pictosToEdit.length > 0) {
      getDexieDB().pictogram.bulkPut(pictosTocreate);
    }
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
    return getDexieDB().collection.get(collectionId);
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
    return getDexieDB().pictogram.get(pictoId);
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
    return sharedCollection;
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
  async getNotifications(vuexContext) {
    const notificationsRequest = await axios.get("/user/notification");
    if (notificationsRequest.status == 200) {
      const notifications = notificationsRequest.data;
      if (notifications?.length != vuexContext.getters.getUser.notifications.length) {
        vuexContext.dispatch("downloadCollections");
      }
      notifications?.forEach(async (notification) => {
        if (notification.meaning) {
          try {
            notification.meaning = JSON.parse(notification?.meaning)
          } catch (err) {
            notification.meaning = notification?.meaning
          }
        }
        if (notification.affected) {
          const colletcion = getDexieDB().collection.get(notification.affected);
          if (!colletcion) {
            var res = await axios.get("/collection/find/" + parseInt(notification.affected, 10));
            parseAndUpdateEntireCollection(vuexContext, res.data);
          }
        }
      });
      // Mettre les notifications dans user
      let user = { ...vuexContext.getters.getUser };
      user.notifications = notifications;
      vuexContext.commit("editUser", {
        ...vuexContext.getters.getUser,
        notifications: notifications,
      });

      // DL les nouvelles collections
      return notifications;
    }
  }
}
export const getters = {
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
  },
  getPublicBundles(state) {
    return state.publicBundles;
  },
  getDragndrop(state) {
    return state.dragndrop;
  },
  getJwtFromCookie(state) {
    return localStorage.getItem("token");
  },
  getJwtExpDateFromCookie(state) {
    return localStorage.getItem("tokenExpiration");
  },
  getTtsBoundarySupport(state) {
    return state.ttsBoundarySupport;
  },
};

async function parseAndUpdateEntireCollection(vuexContext, collection, download = false) {
  const db = getDexieDB();
  let pictosToEdit = [];
  let pictosToCreate = [];
  let collectionsToEdit = [];
  let collectionsToCreate = [];

  let localCollection = await db.collection.get(collection.id);
  let existsCollection = localCollection?.id === collection.id;
  let updateCollection = localCollection?.updatedDate !== collection.updatedDate && existsCollection;
  const partialCollection = localCollection?.partial;

  if (!existsCollection || updateCollection || partialCollection) {
    if (collection.image) {
      collection.image = axios.defaults.baseURL + "/image/pictalk/" + collection.image;
    }
    collection.collection = true;

    if (collection.collections && collection.pictos) {
      collection.partial = false;
    } else {
      collection.partial = true;
    }

    if (!collection.collections) {
      collection.collections = [];
    }
    if (!collection.pictos) {
      collection.pictos = [];
    }

    if (!existsCollection) {
      collectionsToCreate.push(collection);
    }
    if (updateCollection || partialCollection) {
      collectionsToEdit.push(collection);
    }
  }

  if (collection.pictos && collection.pictos.length > 0) {
    for (let picto of collection.pictos) {
      let localPicto = await db.pictogram.get(picto.id);
      let existsPicto = localPicto?.id === picto.id;
      let updatePicto = localPicto?.updatedDate !== picto.updatedDate && existsPicto;

      if (!existsPicto || updatePicto) {
        if (picto.image) {
          picto.image = axios.defaults.baseURL + "/image/pictalk/" + picto.image;
        }
        picto.fatherCollectionId = collection.id;
        if (!existsPicto) {
          pictosToCreate.push(picto);
        }
        if (updatePicto) {
          pictosToEdit.push(picto);
        }
      }
    }
  }

  if (collection.collections && collection.collections.length > 0 && !download) {
    for (let col of collection.collections) {
      let localCollections = await db.collection.get(col.id);
      let existsCollections = localCollections?.id === col.id;
      let updateCollection = localCollections?.updatedDate !== col.updatedDate && existsCollections;
      const partialCollection = localCollections?.partial;

      if (!existsCollections || updateCollection || partialCollection) {
        if (col.image) {
          col.image = axios.defaults.baseURL + "/image/pictalk/" + col.image;
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

        if (!existsCollections) {
          collectionsToCreate.push(col);
        }
        if (updateCollection || partialCollection) {
          collectionsToEdit.push(col);
        }
      }
    }
  }

  if (!download) {
    if (collectionsToCreate.length > 0) {
      await db.collection.bulkPut(collectionsToCreate);
    }
    if (collectionsToEdit.length > 0) {
      await db.collection.bulkPut(collectionsToEdit);
    }
    if (pictosToCreate.length > 0) {
      await db.pictogram.bulkPut(pictosToCreate);
    }
    if (pictosToEdit.length > 0) {
      await db.pictogram.bulkPut(pictosToEdit);
    }

    if (existsCollection && !updateCollection) {
      return localCollection;
    } else {
      return collection;
    }
  }

  return { collectionsToCreate, collectionsToEdit, pictosToCreate, pictosToEdit };
}

function parseAndUpdatePictogram(vuexContext, picto) {
  if (picto.image) {
    picto.image =
      axios.defaults.baseURL +
      "/image/pictalk/" +
      picto.image;
  }
  getDexieDB().pictogram.put(picto);
  return picto;
}