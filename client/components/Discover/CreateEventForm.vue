<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateEventForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/events',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'title', label: 'Name Of Event', value: ''},
        {id: 'start', label: 'Start Date', value: ''},
        {id: 'end', label: 'End Date', value: ''},
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create an event',
      callback: () => {
        const message = 'Successfully created an event!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
