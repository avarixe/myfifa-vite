<script setup>
  const props = defineProps({
    match: { type: Object, required: true }
  })

  const newBookings = ref([])
  let i = 0
  function startNewBooking () {
    newBookings.value.push(++i)
  }
</script>

<template>
  <v-card>
    <v-card-title>
      Bookings
      <v-btn
        icon="mdi-plus"
        @click="startNewBooking"
      />
    </v-card-title>
    <v-table>
      <thead>
        <tr>
          <th>Minute</th>
          <th>Home</th>
          <th>Player</th>
          <th>Red Card</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <booking-row
          v-for="(newBookingCount, i) in newBookings"
          :key="`new-${newBookingCount}`"
          :match="match"
          @click:remove="newBookings.splice(i, 1)"
          @created="newBookings.splice(i, 1)"
        />
        <booking-row
          v-for="booking in match.bookings"
          :key="booking.id"
          :match="match"
          :record="booking"
        />
      </tbody>
    </v-table>
  </v-card>
</template>
