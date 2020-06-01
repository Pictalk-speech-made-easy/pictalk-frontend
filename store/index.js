export const state = () => ({
    pictoviews: [],
    collections: [],
    token: null,
})

export const mutations = {

    addView(state, pictoView) {
        state.pictoviews.push(pictoView);
    },

    addPicto(state, picto) {
        const fatherPictoIndex = state.pictoviews.findIndex(view => view.id === editedPicto.fatherId);
        state.pictoviews[fatherPictoIndex].push(picto);
    },
    editPicto(state, editedPicto) {
        const fatherPictoIndex = state.pictoviews.findIndex(view => view.id === editedPicto.fatherId);
        const pictoIndex = state.pictoviews[fatherPictoIndex].findIndex(picto => picto.id === editedPicto.id);
        state.pictoviews[fatherPictoIndex].pictos[pictoIndex] = picto;
    },
    removePicto(state, removedPicto) {
        const fatherPictoIndex = state.pictoviews.findIndex(view => view.id === removedPicto.fatherId);
        const pictoIndex = state.pictoviews[fatherPictoIndex].findIndex(picto => picto.id === removedPicto.id);
        const viewIndex = state.pictoviews.findIndex(view => view.id === removedPicto.id);
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
export const actions = {

    addView(vuexContext, pictos, fatherId) {
        const view = {
            id: fatherId,
            pictos: pictos
        }
        vuexContext.commit('addView', view);
    },

    addPicto(vuexContext, picto) {

        return axios.post("", picto).then(() => {
            vuexContext.commit('addPicto', picto);
            if (picto.folder) {
                vuexContext.commit('addView', { id: picto.id, pictos: [] });
            }
        })
            .catch(e => console.log(e));

    },
    editPicto(vuexContext, editedPicto) {

        return axios
            .put(
                "" +
                editedPicto.id
                ,
                editedPicto
            )
            .then(res =>
                vuexContext.commit('editPicto', editedPicto)
            )
            .catch(e => console.log(e));
    },
    removePicto(vuexContext, removedPicto) {
        return axios.delete("")
            .then(() => {
                vuexContext.commit('removePicto', removedPicto);
            })
            .catch(e => console.log(e));
    },

    setCollections(vuexContext, collections) {
        vuexContext.commit('setCollections', collections);
    },
    addCollection(vuexContext, collection) {
        return axios.post("", collection)
            .then(() => vuexContext.commit('addCollection', collection))
            .catch(e => console.log(e));
    },
    editCollection(vuexContext, editedCollection) {
        return axios.put("", editedCollection)
            .then(() => vuexContext.commit('editCollection', editedCollection))
            .catch(e => console.log(e));
    },
    removeCollection(vuexContext, removedCollection) {
        return axios.delete("")
            .then(() => vuexContext.commit('removeCollection', removedCollection))
            .catch(e => console.log(e));
    },
    authenticateUser(vuexContext, authData) {
        let authUrl =
            "http://localhost:3000/auth/signin";
        if (!authData.isLogin) {
            authUrl =
                "http://localhost:3000/auth/signup";
        }
        return axios
            .post(authUrl, {
                email: authData.email,
                password: authData.password,
            })
            .then(result => {
                vuexContext.commit('setToken', result.data.accessToken);
                localStorage.setItem('token', result.data.accessToken);
                localStorage.setItem('tokenExpiration', new Date().getTime + Number.parseInt(result.data.expiresIn) * 1000);
                Cookie.set('jwt', result.data.accessToken);
                Cookie.set('expirationDate', new Date().getTime + Number.parseInt(result.data.expiresIn) * 1000)
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
                const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith("jwt="));
                if (!jwtCookie) {
                    return;
                }
                token = jwtCookie.split("=")[1];

                const jwtExpirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith("expirationDate="));
                if (!jwtExpirationDate) {
                    return;
                }
                expirationDate = jwtExpirationDate.split("=")[1];
            }
        } else if (process.client) {

            token = localStorage.getItem('token');
            expirationDate = localStorage.getItem('tokenExpiration');

        } else {
            token = null;
            expirationDate = null;
        }
        if (new Date().getTime() > +expirationDate || !token) {
            console.log("No token or invalid token");
            vuexContext.dispatch('logout');
            return;
        }
        vuexContext.commit("setToken", token);
    },
    logout(vuexContext) {
        vuexContext.commit("clearToken");
        Cookie.remove('jwt');
        Cookie.remove("expirationDate");
        if (process.client) {
            localStorage.removeItem("token");
            localStorage.removeItem('tokenExpiration');
        }
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
        return state.token != null
    }
}