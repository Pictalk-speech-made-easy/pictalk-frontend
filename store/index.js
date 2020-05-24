export const state = () => ({
    pictoviews: [],
    collections: [],
    token: null,
})

export const mutations = {
    setPictoViews(state, pictos) {
        state.pictoviews.push(pictos);
    },

    addPicto(state, picto) {
        const fatherPictoIndex = state.pictoviews.findIndex(view => view === editedPicto.fatherId);
        state.pictoviews[fatherPictoIndex].push(picto);
    },
    editPicto(state, editedPicto) {
        const fatherPictoIndex = state.pictoviews.findIndex(view => view === editedPicto.fatherId);
        const pictoIndex = state.pictoviews[fatherPictoIndex].findIndex(picto => picto.id === editedPicto.id);
        state.pictoviews[fatherPictoIndex].pictos[pictoIndex] = picto;
    },
    removePicto(state, removedPicto) {
        const fatherPictoIndex = state.pictoviews.findIndex(view => view === removedPicto.fatherId);
        const pictoIndex = state.pictoviews[fatherPictoIndex].findIndex(picto => picto.id === removedPicto.id);
        delete state.pictoviews[fatherPictoIndex].pictos[pictoIndex];
    },

    setCollections(state, collections) {
        state.collections = collections;
    },
    addCollection(state, collection) {
        state.collections.push(collection);
    },
    editCollection(state, editedCollection) {
        const collectionIndex = state.collections.findIndex(collection => collection === editedCollection.id);
        state.collections[collectionIndex] = editedCollection;
    },
    removeCollection(state, removedCollection) {
        const collectionIndex = state.collections.findIndex(collection => collection === removedCollection.id);
        delete state.collections[collectionIndex];
    },

    setToken(state, token) {
        state.token = token;
    },
    clearToken(state) {
        state.token = null;
    }
}