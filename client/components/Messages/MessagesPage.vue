<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <p>Messages Page</p>
    <section>
      <div class="groupOptions">
        <div><CreateGroupForm /></div>
        <div><JoinGroupForm /></div>
      </div>
      
    </section>
    <div>
      <CreateEventForm/>
    </div>
    <div class="groupsPane">
      <h3>Your Groups</h3>
      <!-- {{$store.state.groups}} -->
      <!-- <button @click="testing">
        hi
      </button> -->
      <div class="reverseorder">
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
    <div class="two">
      <CreateEventForm/>
      <div class="proposedEvents">
      <ProposedEventComponent
        v-for="group in $store.state.groupEvents"
        :groupName=group
      />
      <!-- <button>
        {{$store.state.events}}
      </button>
      <button>
        {{$store.state.groupEvents}}
      </button> -->
    </div>
    </div>
    
    <div class="three"> 
      <h3>Live Chat</h3>
      <h5>Your Displayed Name: {{username}}</h5>
      <section v-if="joinedRoom.length === 0">
          <!-- <div v-for="room in $store.state.groups" :key="room" @click="joinRoom(room)">
              {{ room }}
          </div> -->
          <button
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
          <h2>{{ joinedRoom }}</h2>
          <input
              type="text"
              name="message"
              v-model="text"
          />
          <button
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
          <button @click="leaveRoom">
              Leave this room
          </button>
      </section>

    </div>
  </main>
</template>

<script>
import Calendar from '@/components/Profile/Calendar.vue';
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
    JoinGroupForm,
    GroupComponent,
    CreateEventForm,
    ProposedEventComponent
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
  /* display: flex; */
  background-color: aqua;
  
  /* flex-flow: row wrap; */
  
  /* justify-content: space-around; */
  
  padding: 0;
  margin: 0;
  list-style: none;
}
.three
{
    background-color: hotpink;
    float: left;
    width:40%;
}
.proposedEvents {
  /* background-color:orange; */
  /* float: left; */
  /* width:40%; */
  display: flex;
  /* background-color: aqua; */
  
  flex-flow: row wrap;
  
  justify-content: space-evenly;
  align-content: space-between;
  
  padding: 0;
  margin: 5px;
  gap: 10px;
  list-style: none;
}
</style>
