<template>
    <div
      class="group"
    >
    <button 
        v-if="group.name === $store.state.currentGroup"
        class="selectedGroupButton"
        @click="selectGroup(group)">
        {{group.name}}
    </button>
    <button 
        v-else
        class="groupButton"
        @click="selectGroup(group)">
        {{group.name}}
    </button>
    <button class="selectedExitButton"
        v-if="group.name === $store.state.currentGroup"
        @click="exitGroup">
        X
    </button>
    <button class="exitButton"
        v-else
        @click="exitGroup">
        X
    </button>
    
    </div>
  </template>


<script>
export default {
    name: 'GroupComponent',
    props: ['group'],
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
            let r = await fetch(`/api/circles/${this.$props.group.name}/self`, options);
            let res = await r.json();    
            this.$store.commit('refreshGroups');
            this.$store.commit('refreshGroupEvents');
        },
        selectGroup(group){
            this.$store.commit('selectGroup', group);
            this.$store.commit('refreshGroups');
            this.$store.commit('refreshGroupEvents');
            
        },

    },
  };
</script>

<style scoped>
.group {
    border-radius: 25px;
    /* margin: 10px; */
    height: 80px;
    
    /* border: 1px solid #111; */
    /* padding: 20px; */
    position: relative;
}
.groupButton{
    width: 90%;
    height: 100%;
    font-size:x-large;
    padding: 3px;
    border: none;
    background-color: white;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}
.selectedGroupButton{
    width: 90%;
    height: 100%;
    font-size:x-large;
    background-color: #1434A4;
    padding: 3px;
    border: none;
    color: white;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}
.exitButton{
    color: black;
    background-color: white;
    border: none;
    width: 10%;
    height: 100%;
    vertical-align: top;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}
.selectedExitButton{
    color: black;
    background-color: #1434A4;
    border: none;
    width: 10%;
    height: 100%;
    vertical-align: top;
    color: white;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}
</style>
