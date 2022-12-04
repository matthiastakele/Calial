<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <p>Messages Page</p>
    <Calendar
    ref="calendar"
    />
</main>
</template>

<script>
import Calendar from '@/components/Profile/Calendar.vue';
export default {
  name: 'MessagesPage',
  components: { Calendar
  },
  beforeMount() {
    // users needs to be input here as an array
    // this.$refs.calendar.addEventsForUser(users);
  },
};
</script>
