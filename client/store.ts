import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    profileFreets: [],
    likes: [],
    username: null, // Username of the logged in user
    userId: null,
    events: [],
    profileUsername: null, // current clicked on profile username (particularly helpful when clicking other users)
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    groups: [],
    currentGroup: ""
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUserId(state, userId){
      /**
       * Update the stored userId to the specified one.
       * @param userId - new userId to set
       */
      state.userId = userId;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateEvents(state, events) {
      state.events = events;
    },
    updateProfileFreets(state, profileFreets){
      state.profileFreets = profileFreets;      
    },
    updateLikes(state, likes) {
      /**
       * Update the stored freets to the provided likes.
       * @param likes - Likes to store
       */
      state.likes = likes;
    },
    updateProfileUsername(state, username) {
      /**
       * Update the stored freets to the provided likes.
       * @param likes - Likes to store
       */
      state.profileUsername = username;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshEvents(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = '/api/events'; //SUSPECT
      const res = await fetch(url).then(async r => r.json());
      state.events = res;
    },
    async refreshGroups(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/circles`;
      const res = await fetch(url).then(async r => r.json());
      Vue.set(state, 'groups', []);
      for (let i = 0; i < res.length; i++) {
        // state.groups.push(res[i])
        state.groups.push(res[i].name);
      }
    },
    async refreshProfileFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/freets?author=${state.profileUsername}`;
      const res = await fetch(url).then(async r => r.json());
      state.profileFreets = res;
    },
    async refreshLikes(state, userId) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/likes/users/${userId}`;
      const res = await fetch(url).then(async r => r.json());
      const freetIds = res.likes.map(like => like.freetId);
      state.likes = state.freets.filter(function (freet) {
        return freetIds.includes(freet._id);
      });
    },
    async refreshGroups(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/circles`;
      const res = await fetch(url).then(async r => r.json());
      Vue.set(state, 'groups', []);
      for (let i = 0; i < res.length; i++) {
        // state.groups.push(res[i])
        state.groups.push(res[i].name);
      }
    }, 
    selectGroup(state, group){
      Vue.set(state, 'currentGroup', group);
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
