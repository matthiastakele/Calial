<!-- Reusable component representing a single like and its actions -->

<template>
  <div class="like">
    <button class="notLikeBtn" v-if="!liked" @click="submitLike">
      <font-awesome-icon icon="fa-regular fa-heart" />
    </button>
    <button class="likeBtn" v-if="liked" @click="submitUnlike">
      <font-awesome-icon icon="fa-solid fa-heart" />
    </button>
    <p>{{ this.total }}</p>
  </div>
</template>

<script>
export default {
  name: "LikeComponent",
  props: ["freetId"],
  data() {
    return {
      liked: false,
      total: null,
    };
  },
  async created() {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const r = await fetch(`/api/likes/freets/${this.freetId}`, options);
    const res = await r.json();
    for(const l of res.likes){
      if(l.userId === this.$store.state.userId){
        this.liked = true;
      }
    }
    this.total = res.likes.length;
  },
  methods: {
    async submitLike() {
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freetId: this.freetId }),
      };
      await fetch(`/api/likes`, options);
      this.liked = this.liked ? false : true;
      this.total += 1;
    },
    async submitUnlike() {
      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/likes/${this.freetId}`, options);
      this.liked = this.liked ? false : true;
      this.total -= 1;
    },
  },
};
</script>

<style scoped>
.like {
  display: flex;
}
.notLikeBtn {
  background-color: transparent;
  border: none; /* Remove borders */
  font-size: 25px; /* Set a font size */
  cursor: pointer; /* Mouse pointer on hover */
}

.likeBtn {
  background-color: transparent;
  color: darksalmon;
  border: none; /* Remove borders */
  font-size: 25px; /* Set a font size */
  cursor: pointer; /* Mouse pointer on hover */
}

p{
  font-size: 22px;
}
</style>
