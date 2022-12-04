<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img class = "logo" src="../../public/logo.png">
      <h1 class="title">
        Calial
      </h1>
    </div>
    <div class="right">
      <router-link @click.native = "goToHome" class = "page_link" to="/discover">
        <font-awesome-icon icon="fa-regular fa-compass" size="xl" />
      </router-link>
      <router-link @click.native = "goToHome" class = "page_link" v-if="$store.state.username" to="/messages">
        <font-awesome-icon icon="fa-regular fa-message" size="xl" />
      </router-link>
      <router-link @click.native="goToProfile" class = "page_link"
        v-if="$store.state.username"
        to="/profile"
      >
      <font-awesome-icon icon="fa-regular fa-user" size="xl"/>
      </router-link>
      <p v-else></p>
      <router-link class = "page_link"
        v-if="$store.state.username"
        to="/account"
      >
      <font-awesome-icon icon="fa-solid fa-gear" size="xl" />
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
    };
  },
  methods: {
    async goToProfile(){
      this.$store.commit('refreshProfileFreets', this.$store.state.username);
      this.$store.commit('refreshLikes', this.$store.state.userId);
      this.$store.commit('updateProfileUsername', this.$store.state.username);
      this.$store.commit('refreshGroups');
    }
  }
}
</script>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: rgb(153, 153, 255);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    color: rgb(51, 51, 204);
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 1.75em;
    margin: 0 5px;
}

.page_link{
  color: #353535;
  font-weight: 600;
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
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
