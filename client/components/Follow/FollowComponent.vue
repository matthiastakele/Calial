<!-- Reusable component representing a single like and its actions -->

<template>
  <div>
  <button v-if = "!followed && $store.state.username" class="follow_btn" @click = "submitFollow">+</button>
  <button v-if = "followed && $store.state.username" class="follow_btn" @click = "submitUnfollow">-</button>
  </div>
</template>

<script>
export default {
  name: "FollowComponent",
  props: ["username"],
  data() {
    return {
      followed: false,
      display: null,
      userId: null
    };
  },
  async created() {
    let options = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    let r = await fetch(`/api/users/userIds/${this.username}`, options);
    let res = await r.json();
    this.userId = res.userId;

    r = await fetch(`/api/follows/${this.$store.state.userId}/following`, options);
    res = await r.json();
    this.display = res;
    for(const f of res.following){
      if(f.followee === this.userId){
        this.followed = true;
      }
    }
  },
  methods: {
    async submitFollow(){
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: this.userId }),
    };
    await fetch(`/api/follows`, options);
    this.followed = true;
    },
    async submitUnfollow(){
      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      await fetch(`/api/follows/${this.userId}`, options);
      this.followed = false; 
    }
  },
};
</script>

<style scoped>
@import "/components/global_css.css";
.follow_btn{
  display: inline-block;
  text-decoration: none;
  background-color: #F0F0F1;
  color: #353535;
  width: 30px;
  height: 30px;
  line-height: 20px;
  border-radius: 50%;
  border: solid 2px rgb(153, 153, 255);;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  font-weight: bold;
  font-size: 18px;
  transition: .4s;
}

.follow_btn:hover {
    background: rgb(153, 153, 255);
}
</style>
