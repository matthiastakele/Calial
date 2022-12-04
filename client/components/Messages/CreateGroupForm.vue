<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/circles',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'circleName', label: 'GroupName', value: ''}
      ],
      title: 'Create a Group',
      callback: () => {
        const message = `You have successfully created the group!`;
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
