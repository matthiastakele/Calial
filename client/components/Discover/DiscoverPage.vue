<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <ViewEventsForm/>
    <GetFreetsForm/>
    <div>
      <EventComponent
        v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
      />
    </div>
  </main>

</template>

<script>
import EventComponent from '@/components/Discover/EventComponent.vue';
import CreateFreetForm from '@/components/Discover/ViewEventsForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
export default {
  name: 'DiscoverPage',
  components: { GetFreetsForm, FreetComponent
  }
};
</script>
