<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <CreateEventForm/>
    <ViewEventsForm/>
    <div>
      <EventComponent
        v-for="event in $store.state.events"
          :key="event.id"
          :event="event"
      />
    </div>
  </main>

</template>

<script>
import EventComponent from '@/components/Discover/EventComponent.vue';
import CreateEventForm from '@/components/Discover/CreateEventForm.vue';
import ViewEventsForm from '@/components/Discover/ViewEventsForm.vue';
// import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
// import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
// import FreetComponent from '@/components/Freet/GetFreetsForm.vue';
export default {
  name: 'DiscoverPage',
  components: { EventComponent, CreateEventForm, ViewEventsForm
  }
};
</script>
