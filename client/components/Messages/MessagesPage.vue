<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <!-- <div class = "compiledCalendar">
      <Calendar ref="personalCalendar" />
    </div> -->
    <div class="groupsPane">
      <div
        class="groupOptions">

        <div style="margin-bottom: 20px;"
          v-if="createPromptButton===true">
          <button
            class="createGroupButton pretty_button"
            @click="createPromptButton=false">
            Create a new Group
          </button>
        </div>
        <div style="margin-bottom: 20px;"
          v-else>
          <CreateGroupForm/>
          <button
            @click="createPromptButton=true"
            class="exitGroupOptions">Cancel
          </button>
        </div>

        <div 
          v-if="joinPromptButton===true">
          <button
            class="joinGroupButton pretty_button"
            @click="joinPromptButton=false">
            Join a new Group
          </button>
        </div>
        <div
          v-else>
          <JoinGroupForm/>
          <button
            @click="joinPromptButton=true"
            class="exitGroupOptions">Cancel
          </button>
        </div>
      </div>


      <div 
        class="leftMargin groupOptions" style="padding: 0.5rem;">
        <h3>Your Groups</h3>
      </div>
      <!-- {{$store.state.groups}} -->
      <div>
        <GroupComponent
          v-for="group in $store.state.groups"
          :groupName=group
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

    <div class="three"> 
      <h3>Chat with {{$store.state.currentGroup}}</h3>
      <h5>Your Displayed Name: {{username}}</h5>
      <section v-if="joinedRoom.length === 0">
          <button class = "pretty_button"
            :key = $store.state.currentGroup
            @click="joinRoom($store.state.currentGroup)">
            Join the Live Chat for: {{$store.state.currentGroup}}
          </button>
      </section>

      <!-- <section v-if="joinedRoom.length === 0">
          <div v-for="room in rooms" :key="room" @click="joinRoom(room)">
              {{ room }}
          </div>
      </section> -->

      <section v-else>
          <h2 style="color: #FAF9F6;">{{ joinedRoom }}</h2>
          <input
              type="text"
              name="message"
              v-model="text"
          />
          <button class = "pretty_button"
              @click="sendMessage"
          >
              Send chat
          </button>
          <div v-for="message in messages" :key="message.id">
              <b>
              {{ message.username }}
              </b>
              : {{ message.text }}
          </div>
          <button class = "pretty_button" @click="leaveRoom">
              Leave this room
          </button>
      </section>
      <div v-if="showCompiledCalendarButton==false">
        <CompiledCalendar/>
      </div>
    </div>

    <div class="two">
      <div v-if="suggestEventButton==true">
        <button class = "createEventButton pretty_button" @click="suggestEventButton=false">Suggest an Event</button>
      </div>
      <div class="eventForm" v-else>
        <CreateEventForm style="border: none;"/>
        <button class = "cancelEvent" @click="suggestEventButton=true">Cancel</button>
      </div>
      <div v-if="showCompiledCalendarButton==true">
        <button class = "createEventButton pretty_button" @click="showCompiledCalendarButton=false">Show Compiled Calendar</button>
      </div>
      <div v-else>
        <button class = "createEventButton pretty_button" @click="showCompiledCalendarButton=true">Close Compiled Calendar</button>
      </div>
      <div>
        <div class="suggestedEventTitle">
          <h3>Suggested Events</h3>
          <h5>from others in {{$store.state.currentGroup}}</h5>
        </div>
        <div class="proposedEvents">
          <ProposedEventComponent
            v-for="group in $store.state.groupEvents"
            :groupName=group
          />
        </div>
      </div>
      
    </div>
    
    
  </main>
</template>

<script>
import Calendar from '@/components/Profile/Calendar.vue';
import CompiledCalendar from '@/components/Messages/CompiledCalendar.vue';
import CreateGroupForm from '@/components/Messages/CreateGroupForm.vue';
import JoinGroupForm from '@/components/Messages/JoinGroupForm.vue';
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import GroupComponent from '@/components/Messages/GroupComponent.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateEventForm from '@/components/Discover/CreateEventForm.vue';
import ProposedEventComponent from '@/components/Messages/ProposedEventComponent.vue';
import io from "socket.io-client";
export default {
  name: 'MessagesPage',
  mounted() {
    this.$refs.personalCalendar.addEventsForUser([this.$store.state.username]);
  },
  updated() {
    this.$refs.personalCalendar.addEventsForUser([this.$store.state.username]);
  },
  components: { 
    Calendar,
    CompiledCalendar,
    ChangeUsernameForm, 
    CreateGroupForm,
    JoinGroupForm,
    GroupComponent,
    CreateEventForm,
    ProposedEventComponent,
  },
  mounted() {
    this.$store.commit('refreshGroups');
    this.$store.commit('refreshGroupEvents');
  },
  data() {
    return {
      editing: false, 
      username: this.$store.state.username,
      text: "",
      messages: [],
      rooms: ["Room1", "Room2"],
      joinedRoom: "",
      currentGroup: "current",
      createPromptButton: true,
      joinPromptButton: true,
      suggestEventButton: true,
      showCompiledCalendarButton: true
    };
  },
  created() {
    // initialize socket
    this.socketInstance = io("http://localhost:3000");

    // receive message
    this.socketInstance.on("message:received", (data) => {
        this.messages = this.messages.concat(data);
    });

    // reflect changed name
    this.socketInstance.on("username:received", (data) => {
        this.updateNameInMessages(data.userId, data.newUsername);
    });

    // someone joined
    this.socketInstance.on("join", (data) => {
        this.messages = this.messages.concat(data);
    });

    // someone left
    this.socketInstance.on("leave", (data) => {
        this.messages = this.messages.concat(data);
    });
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
    sendMessage() {
        const message = {
            id: new Date().getTime(),
            text: this.text,
            username: this.username,
            userId: this.socketInstance.id,
            roomName: this.joinedRoom,
        };
        this.messages = this.messages.concat(message); // show message in my client
        this.socketInstance.emit('message', message); // send message to others
        this.text = ""; // intialize input
    },
    changeName() {
        this.socketInstance.emit('username', {
            userId: this.socketInstance.id,
            newUsername: this.username,
        }); // send new name to others

        this.updateNameInMessages(this.socketInstance.id, this.username); // change name in my chat
    },
    updateNameInMessages(userId, newUsername) {
        this.messages = this.messages.map(message => {
            if (message.userId === userId) {
                return {
                    ...message,
                    username: newUsername
                }
            }
            return message;
        });
    },
    joinRoom(room) {
        this.socketInstance.emit("join-room", {
            roomName: room,
        });
        this.joinedRoom = room;
    },
    leaveRoom() {
        this.socketInstance.emit("leave-room", {
            roomName: this.joinedRoom,
        });
        this.joinedRoom = "";
    }
  },
};
</script>

<style scoped>
@import "/components/global_css.css";
h3, h4, h5{
  color: #FAF9F6;
}
.suggestedEventTitle{
  text-align: left;
  margin: 0;
  padding: 0;
  line-height: 0;
}
.testDiv{
  background-color: lightgray;
}
.groupButtons{
  background-color: #ffffff;
  font-size: 16px;
  border: 1px solid  black;
}
.groupOptions{
  /* border-radius: 25px; */
  border: 1px solid #111; 
  padding: 1rem;
  /* display: flex; */
  /* justify-content: space-evenly; */
  /* margin-bottom: 14px; */
  /* position: relative; */
  /* margin-top: 25px; */
  background-color: rgb(34, 37, 88);
}
.groupsPane
{  
  /* padding-top: 15px; */
  /* text-align: center; */
  /* border: 3px solid #111; */
  border: 1px solid #111;
  float: left;  
  width:20%;
  height:100%;
  margin-top: 30px;
}
.two
{
  /* background-color:orange; */
  float: left;
  width:30%;
  background-color: rgb(34, 37, 88);
  border: 1px solid black;
  text-align: center;
  padding: 0;
  margin: 0;
  list-style: none;
  /* margin-left: 5px;
  margin-right: 5px; */
  padding: 10px;
  margin-top: 30px;
}
.three
{
    background-color: rgb(34, 37, 88);
    border: 1px solid #111;
    float: left;
    width:50%;
    padding: 5px;
    min-height: 100%;
    height: 100%;
    margin-top: 30px;
}
.proposedEvents {
  text-align: left;
  display: flex;
  
  flex-flow: row wrap;
  
  justify-content: space-evenly;
  align-content: space-between;
  
  padding: 0;
  margin: 5px;
  gap: 10px;
  list-style: none;
  height: 500px;
  overflow:auto;
}
.createGroupForm{
  background-color: aqua;
}

.exitGroupOptions{
  height: 30px;
  width: 100%;
  background-color: transparent;
  color: #EE4B2B;
  border: none;
  font-size: 15px;
  /* border-top: none;
  border-left: 2px solid #111; 
  border-bottom: 2px solid #111; 
  border-right: 2px solid #111; */
}

.cancelEvent{
  color: #EE4B2B;
  font-size: 15px;
  background-color: transparent;
  border: none;
}
.createGroupButton{
  background-color: #50C878;
  color: white;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}
.joinGroupButton{
  background-color: #5D3FD3;
  color: white;
  width: 100%;
  height: 50px;
}

.createEventButton{
  background-color: rgb(62, 126, 245);
  color: white;
  width: 100%;
  height: 50px;
  margin-bottom: 5px;
}
.leftMargin{
  padding-left: 20px;
  /* background-color: bisque; */
}

.eventForm {
  border-radius: 25px;
  border: 2px solid #111;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}
</style>
