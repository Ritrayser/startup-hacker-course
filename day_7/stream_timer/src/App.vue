<template>
  <div class="timer">
    <div class="timer__display" :class="{ 'timer__display--live': isLive }">
      <TimerHeader :is-live="isLive" />

      <div class="timer__countdown">
        <TimerSegment :value="days" :label="daysLabel" unit="days" />

        <div class="timer__separator">:</div>

        <TimerSegment :value="hours" :label="hoursLabel" unit="hours" />

        <div class="timer__separator">:</div>

        <TimerSegment :value="paddedMinutes" :label="minutesLabel" unit="minutes" />

        <div class="timer__separator">:</div>

        <TimerSegment :value="paddedSeconds" :label="secondsLabel" unit="seconds" />
      </div>
    </div>
  </div>
</template>

<script>
import TimerHeader from './components/TimerHeader.vue'
import TimerSegment from './components/TimerSegment.vue'

export default {
  name: 'App',
  components: {
    TimerHeader,
    TimerSegment
  },
  data() {
    return {
      streamTime: new Date('2026-01-22T18:00:00').getTime(),
      now: Date.now()
    }
  },
  computed: {
    timeLeft() {
      return this.streamTime - this.now
    },

    isLive() {
      return this.timeLeft <= 0
    },

    // Вычисление дней
    days() {
      return Math.floor(this.timeLeft / (1000 * 60 * 60 * 24))
    },

    // Вычисление часов
    hours() {
      return Math.floor((this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    },

    // Вычисление минут
    minutes() {
      return Math.floor((this.timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    },

    // Вычисление секунд
    seconds() {
      return Math.floor((this.timeLeft % (1000 * 60)) / 1000)
    },

    paddedMinutes() {
      return this.minutes.toString().padStart(2, '0')
    },

    paddedSeconds() {
      return this.seconds.toString().padStart(2, '0')
    },

    // Склонения дни, часы, минуты, секунды
    daysLabel() {
      return this.pluralize(this.days, ['день', 'дня', 'дней'])
    },
    hoursLabel() {
      return this.pluralize(this.hours, ['час', 'часа', 'часов'])
    },
    minutesLabel() {
      return this.pluralize(this.minutes, ['минута', 'минуты', 'минут'])
    },
    secondsLabel() {
      return this.pluralize(this.seconds, ['секунда', 'секунды', 'секунд'])
    }
  },
  methods: {
    // Русское склонение для всех числительных
    pluralize(n, forms) {
      n = Math.abs(n) % 100
      const n1 = n % 10
      if (n1 === 1 && n !== 11) return forms[0]
      if (n1 >= 2 && n1 <= 4 && (n < 10 || n > 20)) return forms[1]
      return forms[2]
    }
  },
  mounted() {
    // Обновляем каждую секунду
    setInterval(() => {
      this.now = Date.now()
    }, 1000)
  }
}
</script>

<style lang="scss">
/* Все стили в src/сss/style.scss */
</style>
