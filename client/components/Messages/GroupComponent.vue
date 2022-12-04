<template>
    <div
      class="group"
    >
    <button class="groupButton">
        {{username}}
    </button>
    <button class="exitButton"
        @click="exitGroup">
        X
    </button>
    
    </div>
  </template>


<script>
export default {
    name: 'GroupComponent',
    props: ['username'],
    data() {
      return {
        editing: false, // Whether or not this freet is in edit mode
      };
    },
    methods: {
        async testing(){
            this.$store.commit('refreshGroups');
            let options = {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            };
            let r = await fetch(`/api/circles/testing`, options);
            let res = await r.json();    
        },
        async exitGroup(){
            let options = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            };
            // let r = await fetch(`/api/circles/${username}/self`, options);
            let r = await fetch(`/api/circles/${this.$props.username}/self`, options);
            let res = await r.json();    
            this.$store.commit('refreshGroups');
        }

    },
  };
</script>

<style scoped>
.group {
    border-radius: 25px;
    margin: 10px;
    height: 80px;
    
    /* border: 1px solid #111; */
    /* padding: 20px; */
    position: relative;
}
.groupButton{
    width: 90%;
    height: 100%;
    font-size:x-large;
}
.exitButton{
    color: red;
    width: 10%;
    vertical-align: top;
}
</style>
