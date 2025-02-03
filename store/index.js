import axios from "axios";
import Cookie from "js-cookie";

async function getDexieDB() {
  return require('~/plugins/dexieDB').getDatabase();
}

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

export const state = () => ({
  navigation: [],
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
    state.navigation = [];
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
  },
  pushNavigation(state, navigation) {
    if (state.navigation[state.navigation.length - 1] == navigation) return;
    state.navigation.push(navigation);
  },
  popNavigation(state) {
    state.navigation.pop();
  },
  resetNavigation(state) {
    if (state.user.root) {
      state.navigation = [String(state.user.root)];
    } else {
      state.navigation = [];
    }
  }
};
export const actions = {
  async dbAddCollection(state, newCollections) {
    if (!Array.isArray(newCollections)) {
      newCollections = new Array(newCollections);
    }
    const db = await getDexieDB();
    let collection;
    let toModify = [];
    // Merge with the newCollections array
    toModify = toModify.concat(newCollections);
    for (let newCollection of newCollections) {
      if (newCollection.fatherCollectionId) {
        if (db && newCollection.fatherCollectionId) {
          collection = await db.collection.get(newCollection.fatherCollectionId);
        }
        if (collection) {
          const collectionIndex = collection.collections.findIndex(
            col => col.id === newCollection.id
          );
          if (collection && collectionIndex == -1) {
            collection.collections.push({ id: newCollection.id });
            toModify.push(collection);
          }
        }
      }
    }
    await db.collection.bulkPut(toModify);
    return;
  },
  async dbRemoveCollection(state, removedCollection) {
    const db = await getDexieDB();
    return db.collection.delete(removedCollection.id);
  },
  async dbEditCollection(state, editedCollections) {
    if (!Array.isArray(editedCollections)) {
      editedCollections = new Array(editedCollections);
    }
    const db = await getDexieDB();
    editedCollections = await Promise.all(editedCollections.map(async (collection) => {
      let col;
      if (db && collection.id) {
        col = await db.collection.get(collection.id)
      }
      if (!col) {
        col = collection;
      }
      Object.assign(col, collection);
      col.collections = col.collections.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
      col.pictos = col.pictos.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
      return col;
    }));
    return db.collection.bulkPut(editedCollections);
  },
  async dbAddPicto(state, pictos) {
    if (!Array.isArray(pictos)) {
      pictos = new Array(pictos);
    }
    let collection;
    const db = await getDexieDB();
    for (let picto of pictos) {
      if (picto.fatherCollectionId && db) {
        collection = await db.collection.get(picto.fatherCollectionId);
      }
      if (collection) {
        const pictoIndex = collection.pictos.findIndex(
          pct => pct.id === picto.id
        );
        if (collection && pictoIndex == -1) {
          collection.pictos.push(picto);
          await db.collection.put(collection);
        }
      }
    }
    // Dexie transition
    return db.pictogram.bulkPut(pictos);
  },
  async dbEditPicto(state, editedPictos) {
    if (!Array.isArray(editedPictos)) {
      editedPictos = new Array(editedPictos);
    }
    const db = await getDexieDB();
    editedPictos = await Promise.all(editedPictos.map(async (picto) => {
      const pct = await db.pictogram.get(picto.id)
      Object.assign(pct, picto);
      return pct;
    }));
    return db.pictogram.bulkPut(editedPictos);
  },
  async dbResetCollections(state) {
    const db = await getDexieDB();
    return db.collection.clear();
  },
  async dbSetCollections(state, collections) {
    const db = await getDexieDB();
    return db.collection.bulkPut(collections);
  },

  async fetchCollection(vuexContext, collectionId) {
    const res = await axios.get("/collection/find/" + collectionId);
    const collection = res.data;
    collection.image = axios.defaults.baseURL + "/image/pictalk/" + collection.image;
    collection.collection = true;
    collection.partial = false;
    await vuexContext.dispatch("dbAddCollection", collection);
    await parseAndUpdateEntireCollection(vuexContext, collection);
    return vuexContext.dispatch('getCollectionFromId', collectionId);
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

    //parseAndUpdateEntireCollection(vuexContext, fatherCollection);
    const fatherCollection = await getCollectionFromId(vuexContext, fatherCollectionId);
    if (moveToCollectionDto.sourceCollectionId) {
      fatherCollection.collections.splice(fatherCollection.collections.findIndex((col) => col.id == moveToCollectionDto.sourceCollectionId), 1)
    } else if (moveToCollectionDto.sourcePictoId) {
      fatherCollection.pictos.splice(fatherCollection.pictos.findIndex((col) => col.id == moveToCollectionDto.sourcePictoId), 1)
    }
    await vuexContext.dispatch('dbEditCollection', { ...fatherCollection });
    // ------- Add the new collection or pictogram to the target collection

    const targetCollection = await getCollectionFromId(vuexContext, moveToCollectionDto.targetCollectionId);
    if (moveToCollectionDto.sourceCollectionId) {
      targetCollection.collections.push({ id: moveToCollectionDto.sourceCollectionId });
    } else if (moveToCollectionDto.sourcePictoId) {
      targetCollection.pictos.push({ id: moveToCollectionDto.sourcePictoId });
    }
    await vuexContext.dispatch('dbEditCollection', { ...targetCollection });

  },
  async resetCollections(vuexContext) {
    vuexContext.commit("resetCollections");

    // Dexie transition
    const db = await getDexieDB();
    await db.collection.clear();
  },
  async getPublicBundles(vuexContext) {
    try {
      let publicBundles = (await axios.get('/collection/levels')).data;
      await Promise.all(Object.keys(publicBundles).map(async (key) => parseAndUpdateEntireCollection(vuexContext, publicBundles[key])));
      publicBundles = Object.keys(publicBundles).map((key) => { return { id: publicBundles[key].id, level: key } });
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
    await vuexContext.dispatch("dbAddPicto", editedNewPicto);
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

    await vuexContext.dispatch("dbEditPicto", {
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
    const parentCollection = await vuexContext.dispatch("getCollectionFromId", fatherCollectionId);
    const pictoIndex = parentCollection.pictos.findIndex((pct) => pct.id == pictoId);
    parentCollection.pictos.splice(pictoIndex, 1);
    await vuexContext.dispatch("dbEditCollection", parentCollection);
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
    await vuexContext.dispatch("dbEditPicto", {
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
    await vuexContext.dispatch("dbEditCollection", {
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
    console.log("Collection call done");
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
      priority: JSON.parse(newCollection.priority),
      createdDate: newCollection.createdDate,
      updatedDate: newCollection.updatedDate,
      ...(collection.pictohubId && { pictohubId: Number(collection.pictohubId) }),
    };
    await vuexContext.dispatch("dbAddCollection", editedNewCollection);
    console.log("Collection added to db");
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
    const nestedCollections = await Promise.all(editedCollection.collections.map((colle) => parseAndUpdateEntireCollection(vuexContext, colle)));
    const nestedPictos = await Promise.all(editedCollection.pictos.map((pict) => parseAndUpdatePictogram(vuexContext, pict)));
    await vuexContext.dispatch("dbEditCollection", {
      ...editedCollection,
      ...(editedCollection.meaning && { meaning: editedCollection.meaning }),
      ...(editedCollection.speech && { speech: editedCollection.speech }),
      ...(editedCollection.priority && { priority: JSON.parse(editedCollection.priority) }),
      image: axios.defaults.baseURL + "/image/pictalk/" + editedCollection.image,
      createdDate: editedCollection.createdDate,
      updatedDate: editedCollection.updatedDate,
      collections: nestedCollections,
      pictos: nestedPictos,
      collection: true,
      ...(collection.pictohubId && { pictohubId: Number(collection.pictohubId) }),
    });
  },
  async editCollectionV2(vuexContext, { collection, collectionsAdded, pictosAdded, collectionsRemoved, pictosRemoved }) {
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
    if (collectionsAdded) {
      collectionsAdded.map((id, index) => formData.append('collectionsAdded[' + index + ']', id));
    }
    if (pictosAdded) {
      pictosAdded.map((id, index) => formData.append('pictosAdded[' + index + ']', id));
    }
    if (collectionsRemoved) {
      collectionsRemoved.map((id, index) => formData.append('collectionsRemoved[' + index + ']', id));
    }
    if (pictosRemoved) {
      pictosRemoved.map((id, index) => formData.append('pictosRemoved[' + index + ']', id));
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
    console.log(formData)
    const editedCollection = (await axios
      .put("/collection/V2/" + collection.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).data;
    const nestedCollections = await Promise.all(editedCollection.collections.map((colle) => parseAndUpdateEntireCollection(vuexContext, colle)));
    const nestedPictos = await Promise.all(editedCollection.pictos.map((pict) => parseAndUpdatePictogram(vuexContext, pict)));
    await vuexContext.dispatch("dbEditCollection", {
      ...editedCollection,
      ...(editedCollection.meaning && { meaning: editedCollection.meaning }),
      ...(editedCollection.speech && { speech: editedCollection.speech }),
      ...(editedCollection.priority && { priority: JSON.parse(editedCollection.priority) }),
      image: axios.defaults.baseURL + "/image/pictalk/" + editedCollection.image,
      createdDate: editedCollection.createdDate,
      updatedDate: editedCollection.updatedDate,
      collections: nestedCollections,
      pictos: nestedPictos,
      collection: true,
      ...(collection.pictohubId && { pictohubId: Number(collection.pictohubId) }),
    });
  },
  async removeCollection(vuexContext, { collectionId, fatherCollectionId }) {
    const res = await axios.delete("/collection/", { params: { collectionId: collectionId, fatherId: fatherCollectionId } });
    const parentCollection = await vuexContext.dispatch("getCollectionFromId", fatherCollectionId);
    const collectionIndex = parentCollection.collections.findIndex((col) => col.id == collectionId);
    parentCollection.collections.splice(collectionIndex, 1);
    await vuexContext.dispatch("dbEditCollection", parentCollection);
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
    } else {
      token = localStorage.getItem("token");
      expirationDate = localStorage.getItem("tokenExpiration");
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
  async logout(vuexContext) {
    vuexContext.commit("clearToken");
    Cookie.remove("jwt");
    Cookie.remove("expirationDate");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    // Check if dexie db is different from the default one
    if (vuexContext.state.user.username) {
      const db = await getDexieDB();
      db.delete();
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
    let toUpdate = res.map(collection => parseAndUpdateEntireCollection(vuexContext, collection, true)); // We now have to add all the collections and merge them
    let collectionsToCreate = [];
    let collectionsToEdit = [];
    let pictosTocreate = [];
    let pictosToEdit = [];
    let collectionsWithoutFatherCollectionId = [];
    toUpdate = await Promise.all(toUpdate);
    for (let update of toUpdate) {
      collectionsToCreate = collectionsToCreate.concat(update.collectionsToCreate);
      collectionsToEdit = collectionsToEdit.concat(update.collectionsToEdit);
      pictosTocreate = pictosTocreate.concat(update.pictosTocreate);
      pictosToEdit = pictosToEdit.concat(update.pictosToEdit);
      collectionsWithoutFatherCollectionId = collectionsWithoutFatherCollectionId.concat(update.collectionsWithoutFatherCollectionId);
    }
    if (collectionsWithoutFatherCollectionId.length > 0) {
    }
    // We can find the collectionsWithoutFatherCollectionId in the collectionsToCreate or to edit
    let count = 0;
    for (let collection of collectionsWithoutFatherCollectionId) {
      const index = collectionsToCreate.findIndex((col) => col.id == collection.id);
      if (index != -1) {
        collectionsToCreate[index].fatherCollectionId = collection.fatherCollectionId;
        collectionsToCreate.splice(index, 1);
        collectionsToCreate.push(collection);
        count += 1;
      }
      if (index == -1) {
        const index2 = collectionsToEdit.findIndex((col) => col.id == collection.id);
        if (index2 != -1) {
          collectionsToEdit[index2].fatherCollectionId = collection.fatherCollectionId;
          collectionsToEdit.splice(index2, 1);
          collectionsToEdit.push(collection);
          count += 1;
        }
      }
    }

    if (collectionsToCreate.length > 0) {
      await vuexContext.dispatch("dbAddCollection", collectionsToCreate);
    }
    if (collectionsToEdit.length > 0) {
      await vuexContext.dispatch("dbEditCollection", collectionsToEdit);
    }
    if (pictosTocreate.length > 0) {
      await vuexContext.dispatch("dbAddPicto", pictosTocreate);
    }
    if (pictosToEdit.length > 0) {
      await vuexContext.dispatch("dbEditPicto", pictosToEdit);
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
    await parseAndUpdateEntireCollection(vuexContext, editedCollection);
    vuexContext.commit("resetCopyCollectionId");
    return;
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
    return Promise.all(publicCollections.map(collection =>
      parseAndUpdateEntireCollection(vuexContext, collection)
    ));
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
    if (notificationsRequest.status !== 200) return;

    let notifications = notificationsRequest.data;
    if (notifications?.length != vuexContext.getters.getUser.notifications.length) {
      vuexContext.dispatch("downloadCollections");
    }
    notifications = await Promise.all(notifications?.map(async (notification) => {
      if (notification.meaning) {
        try {
          notification.meaning = JSON.parse(notification?.meaning)
        } catch (err) {
          notification.meaning = notification?.meaning
        }
      }
      if (notification.affected) {
        let collection = await getCollectionFromId(vuexContext, parseInt(notification.affected, 10));
        if (!collection) {
          await vuexContext.dispatch('fetchCollection', parseInt(notification.affected, 10));
        }
        collection = await getCollectionFromId(vuexContext, parseInt(notification.affected, 10));
        notification.image = collection?.image;
      }
      return notification;
    }));
    // Mettre les notifications dans user
    let user = { ...vuexContext.getters.getUser };
    user.notifications = notifications;
    vuexContext.commit("editUser", {
      ...vuexContext.getters.getUser,
      notifications: notifications,
    });
    return notifications;
  },
  async getCollections(vuexContext) {
    const db = await getDexieDB();
    return db.collection.toArray();
  },
  async getCollectionFromId(vuexContext, id) {
    const db = await getDexieDB();
    if (!db || !id) return;
    return db.collection.get(id);
  },
  async getCollectionsFromFatherCollectionId(vuexContext, fatherCollectionId) {
    const db = await getDexieDB();
    if (!db || !fatherCollectionId) return;
    const collection = await db.collection.get(fatherCollectionId);
    return Promise.all(collection.collections.map(async (collection) => {
      return db.collection.get(collection.id);
    }));
  },
  async getPictos(state) {
    const db = await getDexieDB();
    return db.pictogram.toArray();
  },
  async getPictoFromId(state, id) {
    const db = await getDexieDB();
    if (!db || !id) return;
    return db.pictogram.get(id);
  },
  async getPictosFromFatherCollectionId(state, fatherCollectionId) {
    const db = await getDexieDB();
    if (!db || !fatherCollectionId) return;
    const collection = await db.collection.get(fatherCollectionId);
    return Promise.all(collection.pictos.map(async (picto) => {
      return db.pictogram.get(picto.id)
    }));
  },
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
  getNavigation(state) {
    return state.navigation;
  }
};

async function parseAndUpdateEntireCollection(vuexContext, collection, download = false) {
  if (collection.id == 346) {
    console.log(collection);
  }
  let pictosToEdit = [];
  let pictosTocreate = [];
  let collectionsToEdit = [];
  let collectionsToCreate = [];
  // Map of the collections that don't have a fatherCollectionId
  let collectionsWithoutFatherCollectionId = []; // Collections that don't have a fatherCollectionId have to be merged with their duplicatas with a fatherCollectionId
  let localCollection = await getCollectionFromId(vuexContext, collection.id);
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

    // TODO Est-ce qu'on peut recuperer fatherCollectionId d'une autre facon ?
    // SI la collection n'existe pas alors cela sera undefined...
    if (localCollection) {
      Object.assign(localCollection, collection);
      collection = localCollection;
      collection.fatherCollectionId = localCollection.fatherCollectionId;
    } else {
      collectionsWithoutFatherCollectionId.push(collection);
    }

    if (!existsCollection && collection.fatherCollectionId) {
      collectionsToCreate.push(collection);
    }
    if (updateCollection || partialCollection) {
      collectionsToEdit.push(collection);
    }
  }
  if (collection.pictos && !collection.pictos.length == 0) {
    await Promise.all(collection.pictos.map(async (picto) => {
      let localPicto = await getPictoFromId(vuexContext, picto.id);
      let existsPicto = localPicto?.id == picto.id;
      let updatePicto = (localPicto?.updatedDate != picto.updatedDate) && existsPicto;
      if (!existsPicto || updatePicto) {
        if (picto.image) {
          picto.image =
            axios.defaults.baseURL +
            "/image/pictalk/" +
            picto.image;
        }
        picto.fatherCollectionId = collection.id;
        if (!existsPicto) {
          pictosTocreate.push(picto);
        }
        if (updatePicto) {
          pictosToEdit.push(picto);
        }
      }

    }));
  }
  if (collection.collections && !collection.collections.length == 0) {
    await Promise.all(collection.collections.map(async (col) => {
      let localCollections = await getCollectionFromId(vuexContext, col.id);
      let existsCollections = localCollections?.id == col.id;
      let updateCollection = (localCollections?.updatedDate != col.updatedDate) && existsCollections;
      const partialCollection = localCollections?.partial;
      if (!existsCollections || updateCollection || partialCollection) {
        if (col.image) {
          col.image =
            axios.defaults.baseURL +
            "/image/pictalk/" +
            col.image;
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
    }));
  }
  if (!download) {
    if (collectionsToCreate.length > 0) {
      await vuexContext.dispatch("dbAddCollection", collectionsToCreate);
    }
    if (collectionsToEdit.length > 0) {
      await vuexContext.dispatch("dbEditCollection", collectionsToEdit);
    }
    if (pictosTocreate.length > 0) {
      await vuexContext.dispatch("dbAddPicto", pictosTocreate);
    }
    if (pictosToEdit.length > 0) {
      await vuexContext.dispatch("dbEditPicto", pictosToEdit);
    }
    if (collectionsWithoutFatherCollectionId.length > 0) {
      await vuexContext.dispatch("dbEditCollection", collectionsWithoutFatherCollectionId);
    }
    if (existsCollection && !updateCollection) {
      return localCollection;
    } else {
      return collection;
    }
  }
  return { collectionsToCreate, collectionsToEdit, pictosTocreate, pictosToEdit, collectionsWithoutFatherCollectionId };
}

async function parseAndUpdatePictogram(vuexContext, picto) {
  if (picto.image) {
    picto.image =
      axios.defaults.baseURL +
      "/image/pictalk/" +
      picto.image;
  }
  if (picto.meaning) {
    picto.meaning = picto.meaning;
  }
  if (picto.speech) {
    picto.speech = picto.speech;
  }
  if (!getPictoFromId(vuexContext, picto.id)) {
    await vuexContext.dispatch("dbAddPicto", picto);
  } else {
    await vuexContext.dispatch("dbEditPicto", picto);
  }
  return picto;
}

async function getCollectionFromId(vuexContext, id) {
  const db = await getDexieDB();
  if (!db || !id) return;
  return db.collection.get(id);
}
async function getPictoFromId(vuexContext, id) {
  const db = await getDexieDB();
  if (!db || !id) return;
  return db.pictogram.get(id);
}
