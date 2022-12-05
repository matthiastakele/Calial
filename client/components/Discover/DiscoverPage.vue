<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <br>
    <h1 style="font-size:30px"><center><b>Welcome back, @{{$store.state.username}}</b></center></h1>
    <CreateEventForm/>
    <ViewEventsForm ref = "vieweventsform"/>
    <p style="font-size:30px" ><center><b>Discover Events</b> </center></p>
    <div
        v-if="$store.state.events.length"
    >
      <div>
        <EventComponent
          v-for="event in $store.state.events"
            :key="event.id"
            :event="event"
        />
      </div>
    </div>
    <div v-else>
      No Upcoming Events
    </div>
  </main>

</template>

<script>
import EventComponent from '@/components/Discover/EventComponent.vue';
import CreateEventForm from '@/components/Discover/CreateEventForm.vue';
import ViewEventsForm from '@/components/Discover/ViewEventsForm.vue';
export default {
  name: 'DiscoverPage',
  components: { EventComponent, CreateEventForm, ViewEventsForm
  },
  mounted() {
    this.$refs.vieweventsform.submit();
  }
};
</script>