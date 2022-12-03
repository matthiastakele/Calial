<template>
  <main>
    <p>{{this.a}}</p>
    <p>{{this.b}}</p>
    <button @click="customEventCreation">
      button
    </button>
    <vue-cal
      ref="vuecal"
      style="height: 600px"
      :disable-views="['years']"
      editable-events
      :on-event-dblclick="deleteEvent"
      :dblclickToNavigate = "false"
      :events="events"
    >
    </vue-cal>
  </main>
</template>

<script>
import VueCal from "vue-cal";
export default {
  components: { VueCal },
  data: () => ({
    a: "",
    b: "",
    selectedEvent: null,
    showEventCreationDialog: false,
    eventsCssClasses: ["leisure", "sport", "health"],
    events: [
      {
        start: "2022-12-01 1:00",
        end: "2022-12-01 3:00",
        title: "Need to go shopping",
        class: "leisure",
        deletable: false,
        resizable: false,
        draggable: false,
      },
    ],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
  }),
  methods: {
    /* onEventClick(event, e) {
      this.selectedEvent = event;
      this.showDialog = true;

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
      this.events = [];
    } */
    createEvent(){
      $refs.vuecal.createEvent($event, 60, {
          title: 'New Event',
          class: 'leisure',
        })
    },
    deleteEvent(event, e){
      this.a = event;
      this.b = e;
    }
  },
};
</script>

<style>
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: rgb(153, 153, 255);
}
.vuecal__title-bar {
  background-color: #e4f5ef;
}
.vuecal__cell--today,
.vuecal__cell--current {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {
  background-color: rgba(235, 255, 245, 0.4);
}
.vuecal__cell--selected:before {
  border-color: rgba(66, 185, 131, 0.5);
}
/* Cells and buttons get highlighted when an event is dragged over it. */
.vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal__cell-split--highlighted {
  background-color: rgba(195, 255, 225, 0.5);
}
.vuecal__arrow.vuecal__arrow--highlighted,
.vuecal__view-btn.vuecal__view-btn--highlighted {
  background-color: rgba(136, 236, 191, 0.25);
}

.vuecal__event {
  cursor: pointer;
  height: 100px;
}

.vuecal__event-title {
  font-size: 15px;
  font-weight: bold;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
}

.vuecal__event-content {
  font-style: italic;
}
.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}
.vuecal__event.sport {
  background-color: rgba(255, 102, 102, 0.9);
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
}
</style>
