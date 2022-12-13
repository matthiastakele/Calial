<template>
    <div
        class="proposedEventButton">
        <h3>{{groupName.title}} @{{groupName.author}}</h3>
        <h4>From: {{groupName.start.split(" ")[1]}} {{groupName.start.split(" ")[0].split("-")[1]}}/{{groupName.start.split(" ")[0].split("-")[2]}}/{{groupName.start.split(" ")[0].split("-")[0]}}</h4>
        <h4>To: {{groupName.end.split(" ")[1]}} {{groupName.end.split(" ")[0].split("-")[1]}}/{{groupName.end.split(" ")[0].split("-")[2]}}/{{groupName.end.split(" ")[0].split("-")[0]}}</h4>
        <h4 v-if="groupName.content.length > 0">Location: {{groupName.content}}</h4>
    </div>
  </template>


<script>
export default {
    name: 'ProposedEventComponent',
    props: ['groupName'],
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
            this.$store.commit('refreshGroupEvents');
        },
        selectGroup(group){
            this.$store.commit('selectGroup', group)
        },

    },
  };
</script>

<style scoped>
.group {
    /* margin: 10px; */
    /* display: flex;
    flex-wrap: row wrap;
    justify-content: space-around; */
    /* border: 1px solid black; */
    /* border: 1px solid #111; */
    /* padding: 20px; */
    /* position: relative; */
    background: tomato;
  padding: 5px;
  width: 200px;
  height: 150px;
  margin-top: 10px;
  line-height: 150px;
  color: white;
  font-weight: bold;
  font-size: 3em;
  text-align: center;
}
.child{
    width: 100px;  /* Or whatever */
    height: 100px; /* Or whatever */
    margin: auto;  /* Magic! */
}
.groupButton{
    width: 90%;
    height: 100%;
    font-size:x-large;
    padding: 3px;
    /* background-color: white; */
}
.proposedEventButton{
    width: 250px;
    height: auto;
    /* font-size:x-large; */
    background-color: white;
    /* border: 1px solid black;  */
    border-radius: 5px;
    padding: 3px;
    font-size: 1rem;
    text-align: center;
}
.exitButton{
    color: red;
    width: 10%;
    vertical-align: top;
}
</style>
