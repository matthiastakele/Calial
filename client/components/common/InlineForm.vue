<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <input 
      v-model="value"
      type="text"
      :placeholder="placeholder"
    >
    <button class = "pretty_button"
      type="submit"
    >
      {{ button }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: 'InlineForm',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {value: '', alerts: {}};
  }
};
</script>

<style scoped>
@import "/components/global_css.css";
form {
    display: flex;
    position: relative;
}

input {
    padding: 0 5px;
    min-width: 200px;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
}
</style>
