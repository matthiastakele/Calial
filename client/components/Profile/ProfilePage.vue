<!-- Default page that also displays freets -->

<template>
  <main>
    <span class="profilePic">{{this.username.charAt(0).toUpperCase()}}</span>
    <h3 style = "margin-left: 2%;">@{{this.username}}</h3>
    <h4 style = "margin-left: 2%;">{{this.followers}} Followers  &nbsp; {{this.following}} Following</h4>
      <div class="options">
        <button class = "pretty_button options_item" @click="chooseFreets" :style= "{'background-color': chosen == 'freets' ? 'rgb(153, 153, 255)' : '#f8f8f8'}">
          Freets
        </button>
        <button class = "pretty_button options_item" @click="chooseLikes" :style= "{'background-color': chosen == 'likes' ? 'rgb(153, 153, 255)' : '#f8f8f8'}">
          Likes
        </button>
      </div>
    <section v-if="chosen == 'freets'">
      <section
        v-if="$store.state.freets.length"
      >
      <div class="reverseorder">
        <FreetComponent
          v-for="freet in $store.state.profileFreets"
          :key="freet.id"
          :freet="freet"
        />
      </div>
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>

    <section v-if="chosen == 'likes'">
      <div class="reverseorder">
      <FreetComponent
          v-for="freet in $store.state.likes"
          :key="freet.id"
          :freet="freet"
        />
      </div>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm},
  data() {
    return {
      chosen: "freets",
      userId: null,
      username: this.$store.state.profileUsername,
      followers: null,
      following: null,
      display: "",
      view: false,
    };
  },
  async created() {
    let options = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    let r = await fetch(`/api/users/userIds/${this.$store.state.profileUsername}`, options);
    let res = await r.json();
    this.userId = res.userId;

    r = await fetch(`/api/follows/${this.userId}/followers`, options);
    res = await r.json();
    this.followers = res.followers.length;

    r = await fetch(`/api/follows/${this.userId}/following`, options);
    res = await r.json();
    this.following = res.following.length;
  },
  methods: {
    chooseFreets(){
      this.chosen = "freets";
      this.$store.commit('refreshFreets');
      this.view = false;
    },
    chooseLikes(){
      if(this.freetsChosen){
        this.$store.commit('refreshLikes', this.userId);
      }
      this.chosen = "likes";
      this.view = false;
    }
  }
};
</script>

<style scoped>
@import "/components/global_css.css";
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.reverseorder {
  display: flex;
  flex-direction: column-reverse;
}
.options {
  display: flex;
  margin: 10px -30px;
  justify-content: center;
}
.options_item {
  margin: 10px 30px;
  /* background-color: rgb(153, 153, 255); */
  font-size: 1em;
}
span.profilePic{
  background: rgb(153, 153, 255);
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  color: #353535;
  display: inline-block;
  font-weight: bold;
  font-size: 40px;
  line-height: 75px;
  margin-left: 2%;
  margin-top: 2%;
  text-align: center;
  width: 75px;
}

.grid-container {
  margin-top: 20px;
  display: grid;
  justify-content: center;
  align-content: center;
  gap: 75px;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr;
}
.grid-item {
  font-size: 20px;
  text-align: center;
}
.column {
  float: left;
  width: 40%;
}

/* Clear floats after the columns */
.row {
  display: flex;
}
</style>
