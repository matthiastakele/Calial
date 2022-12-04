

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ViewEventsForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/events',
      method: 'GET',
      hasBody: false,
      title: 'All Available Events',
      callback: () => {
        const message = 'Successfully viewed events!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
