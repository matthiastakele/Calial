<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <div class="groupOptions">
        <div><CreateGroupForm /></div>
        <div><JoinGroupForm /></div>
      </div>
      
    </section>
    <div class="groupsPane">
      <h3>Your Groups</h3>
      <!-- {{$store.state.groups}} -->
      <!-- <button @click="testing">
        hi
      </button> -->
      <div class="reverseorder">
        <GroupComponent
          v-for="group in $store.state.groups"
          :username=group
        />
      </div>
      <!-- <section
        v-if="$store.state.freets.length"
      >
      <div class="reverseorder">
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </div>
      </section>
      <article
        v-else
      >
        <h3>No events found.</h3>
      </article> -->

    </div>
    <div class="two">Events</div>
    <div class="three">Live Chat</div>
  </main>
</template>

<script>
import Calendar from '@/components/Profile/Calendar.vue';
import CreateGroupForm from '@/components/Messages/CreateGroupForm.vue';
import JoinGroupForm from '@/components/Messages/JoinGroupForm.vue';
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import GroupComponent from '@/components/Messages/GroupComponent.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
export default {
  name: 'MessagesPage',
  components: { 
    Calendar,
    ChangeUsernameForm, 
    CreateGroupForm,
    JoinGroupForm,
    GroupComponent
  },
  mounted() {
    this.$store.commit('refreshGroups');
  },
  data() {
    return {
      editing: false
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
  },
};
</script>

<style scoped>
.groupButtons{
  background-color: #ffffff;
  font-size: 16px;
  border: 1px solid  black;
}
.groupOptions{
  /* border-radius: 25px;
  border: 1px solid #111;  */
  padding: 1rem;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 14px;
  position: relative;
  margin-top: 25px;
}
.groupsPane
{  
  /* padding-top: 15px; */
  text-align: center;
  border: 1px solid #111;
  float: left;  
  width:20%;
  height:100%
}
.two
{
    background-color:orange;
    float: left;
    width:40%;
}
.three
{
    background-color: hotpink;
    float: left;
    width:40%;
}
</style>
