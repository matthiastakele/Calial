<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <p>Messages Page</p>
    <Calendar
    ref="calendar"
    />
</main>
    <section>
      <div class="groupOptions">
        <div><CreateGroupForm /></div>
        <div><JoinGroupForm /></div>
      </div>
      
    </section>
    <div class="one">Tab for groups</div>
    <div class="two">Events</div>
    <div class="three">Live Chat</div>
</template>

<script>
import Calendar from '@/components/Profile/Calendar.vue';
import CreateGroupForm from '@/components/Messages/CreateGroupForm.vue';
import JoinGroupForm from '@/components/Messages/JoinGroupForm.vue';
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
export default {
  name: 'MessagesPage',
  components: { Calendar
  },
  beforeMount() {
    // users needs to be input here as an array
    // this.$refs.calendar.addEventsForUser(users);
  },
  components: { 
    Calendar,
    ChangeUsernameForm, 
    CreateGroupForm,
    JoinGroupForm
  },
  // methods: {
  // },
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
.one
{
    background-color:limegreen;    
    float: left;  
    width:33%;
}
.two
{
    background-color:orange;
    float: left;
    width:33%;
}
.three
{
    background-color: hotpink;
    float: left;
    width:33%;
}
</style>
