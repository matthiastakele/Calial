<template>
  <main>
    <p>{{ this.test }}</p>
    <vue-cal
      ref="vuecal"
      style="height: 700px"
      today-button
      :disable-views="['years']"
      :editable-events="{ title: true, drag: false, resize: true, delete: true, create: true }"
      :drag-to-create-event="false"
      :cell-click-hold="false"
      @cell-dblclick="
        $refs.vuecal.createEvent($event, 60, {
          title: 'New Event',
          class: 'leisure',
        })
      "
      :on-event-create="createEvent"
      @event-delete="deleteEvent"
      @event-title-change="changeTitle"
      @event-drop="changeDrop"
      @event-duration-change="changeDuration"
      :dblclickToNavigate="false"
      :events="events"
    >
    </vue-cal>
  </main>
</template>

<script>
import VueCal from "vue-cal";
export default {
  components: { VueCal },
  async created() {
    const events =
      await `/api/events?author=${this.$store.state.profileUsername}`;
    for (event of events) {
      this.events.push({
        start: event.start,
        end: event.end,
        titke: event.title,
      });
    }
  },
  data: () => ({
    a: "",
    b: "",
    test: "",
    selectedEvent: null,
    showEventCreationDialog: false,
    eventsCssClasses: ["leisure", "sport", "health"],
    events: [],
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
    async createEvent(event, deleteEventFunction) {
      const start = this.convertDate(event.start);
      const end = this.convertDate(event.end);
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: this.$store.state.username,
          start: start,
          end: end,
          title: event.title,
        }),
      };
      await fetch(`/api/events`, options);
      return event;
    },
    async editEvent(event, deleteEventFunction) {
      const start = this.convertDate(event.start);
      const end = this.convertDate(event.end);
      let options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: this.$store.state.username,
          start: start,
          end: end,
          title: event.title,
        }),
      };
      await fetch(`/api/events`, options);
      return event;
    },
    async deleteEvent(event, e) {
      const start = this.convertDate(event.start);
      const end = this.convertDate(event.end);
      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: start,
          end: end,
        }),
      };
      await fetch(`/api/events`, options);
    },
    async changeDuration(event) {
      const originalEvent = event.originalEvent;
      const newEvent = event.event;
      this.deleteEvent(originalEvent, "_");
      this.createEvent(newEvent, "_");
    },
    async changeTitle(event) {
      const newEvent = event.event;
      //this.deleteEvent(newEvent, "_");
      this.editEvent(newEvent, "_");
    },
    async changeDrop(event) {
      this.test = event;
      const originalEvent = event.originalEvent;
      const newEvent = event.event;
      // this.deleteEvent(originalEvent, "_");
      // this.createEvent(newEvent, "_");
    },
    convertDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      const hour =
        date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
      const minutes =
        date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
      return year + "-" + month + "-" + day + " " + hour + ":" + minutes;
    },
    calculateTimeDiff(start, end) {
      const startTime = start.split(" ")[1].split(":");
      const endTime = String(end).split(" ")[1].split(":");
      const hourDiff = (Number(endTime[0]) - 1 - Number(startTime[0])) * 60;
      const minDiff = Number(endTime[1]) + 60 - Number(startTime[1]);
      return hourDiff + minDiff;
    },
    // goes through every username in an array and adds the event to a calendar.
    async addEventsForUser(usernames) {
      for (const username of usernames) {
        const allEventsUrl = `/api/events?author=${username}`;
        try {
          const r = await fetch(allEventsUrl);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          // res contains a list of the events for that username
          for (const event of res) {
            // const timeDiff = 500;
            const timeDiff = this.calculateTimeDiff(event.start, event.end);
            this.$refs.vuecal.createEvent(
              // Formatted start date and time or JavaScript Date object.
              event.start,
              // Event duration in minutes (Integer).
              timeDiff,
              // Custom event props (optional).
              { title: event.title, content: event.content, class: "leisure" }
            );
            // const timeDiff = this.calculateTimeDiff(event.start, event.end);
            // this.$refs.vuecal.createEvent(event.start, timeDiff, {
            // title: event.title,
            // content: event.content,
            // })
          }
        } catch (e) {
          // do nothing
        }
      }
    },
  },
};
</script>

<style>
.vuecal__menu, .vuecal__cell-events-count {
  background-color: rgb(153, 153, 255) !important;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
}
.vuecal__title-bar {
  background-color: #caccff !important;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
}
.vuecal__cell-date { font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif; }
.vuecal__cell--today, .vuecal__cell--current {
  background-color: rgba(240, 240, 255, 0.4) !important;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected { background-color: rgba(235, 255, 245, 0.4) !important; }
.vuecal__cell--selected:before { border-color: rgba(66, 185, 131, 0.5) !important; }
/* Cells and buttons get highlighted when an event is dragged over it. */
.vuecal__cell--highlighted:not(.vuecal__cell--has-splits), .vuecal__cell-split--highlighted { background-color: rgba(195, 255, 225, 0.5) !important; }
.vuecal__arrow.vuecal__arrow--highlighted, .vuecal__view-btn.vuecal__view-btn--highlighted { background-color: rgba(136, 236, 191, 0.25) !important; }
.vuecal__event {
  cursor: pointer;
  height: 100px;
}
.vuecal__event-title {
  font-size: 15px;
  font-weight: bold;
  font-family: Arial;
}
.vuecal--view-with-time .vuecal__weekdays-headings, .vuecal--view-with-time .vuecal__all-day {
    padding-right: 17px;
    background-color: rgb(255, 255, 255) !important;
}
.vuecal__heading .weekday-label {
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  display: flex;
  font-size: 70%;
  font-weight: bold;
  justify-content: center;
  align-items: center;
}
.vuecal__time-column .vuecal__time-cell {
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  color: rgb(90, 90, 90) !important;
  text-align: center !important;
  font-size: 70% !important;
}
.vuecal__no-event {
  /* padding-top: 1em; */
  color: rgb(148, 148, 148) !important;
  justify-self: flex-start;
  margin-bottom: auto;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 70%;
}
.vuecal__event-time {
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 85%;
  display: inline-block;
  margin-bottom: 3px;
  padding-bottom: 3px;
}
.vuecal__event-title {
  padding-top: 6px;
  font-size: 15px;
  font-weight: bold;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
}
.vuecal__event-content {
  font-style: italic;
  font-size: 15px;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
}
.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9) !important;
  border: 1px solid rgb(233, 136, 46) !important;
  color: #fff !important;
}
.vuecal__event.sport {
  background-color: rgba(255, 102, 102, 0.9) !important;
  border: 1px solid rgb(235, 82, 82) !important;
  color: #fff !important;
}
.vuecal__event-delete {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 1.4em;
  line-height: 1.4em;
  background-color: #dd3333d9 !important;
  color: #fff !important;
  cursor: pointer;
  transition: 0.3s;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 85%;
}
</style>