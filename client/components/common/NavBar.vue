<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img class = "logo" src="../../public/calial_icon.png">
      <h1 class="title">
        Calial
      </h1>
    </div>
    <div class="right">
      <router-link @click.native = "discover" class = "page_link" :style= "{'font-weight': chosen == 'discover' ? 600 : 300}" to="/discover">
        Discover
      </router-link>
      <router-link @click.native = "messages" class = "page_link" :style= "{'font-weight': chosen == 'messages' ? 600 : 300}" v-if="$store.state.username" to="/messages">
        Messages
      </router-link>
      <router-link @click.native ="goToProfile" class = "page_link" :style= "{'font-weight': chosen == 'profile' ? 600 : 300}"
        v-if="$store.state.username"
        to="/profile"
      >
        My Calendar
      </router-link>
      <p v-else></p>
      <router-link @click.native = "account" class = "page_link" :style= "{'font-weight': chosen == 'account' ? 600 : 300}"
        v-if="$store.state.username"
        to="/account"
      >
      Account
      </router-link>
      <router-link class = "page_link"
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      test: "",
      chosen: ""
    };
  },
  created(){
    this.chosen = "discover";
  },
  methods: {
    async discover(){
      this.chosen = "discover";
    },
    async messages(){
      this.chosen = "messages";
    },
    async account(){
      this.chosen = "account";
    },
    async goToProfile(){
      this.chosen = "profile";
      this.$store.commit('refreshProfileFreets', this.$store.state.username);
      this.$store.commit('refreshLikes', this.$store.state.userId);
      this.$store.commit('updateProfileUsername', this.$store.state.username);
      this.$store.commit('refreshGroups');
      this.$store.commit('refreshGroupEvents');
    }
  }
}
</script>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #1a4775;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    color: #FAF9F6;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 1.75em;
    margin: 0 5px;
}

.page_link{
  color: #FAF9F6;

  font-size: 1em;
  text-decoration: none;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 21px;
    display: flex;
    gap: 12px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 8px;
    margin-right: 8px;
}

.alerts {
    width: 25%;
}
</style>
