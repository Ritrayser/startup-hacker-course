<template>
  <div class="card" :class="{
    'card--flipped': card.flipped || card.matched,
    'card--matched': card.matched,
    'card--disabled': disabled
  }" @click="!disabled && !card.flipped && !card.matched ? $emit('flip', card.id) : null">
    <div class="card__inner">
      <div class="card__face card__face--front">
        <div class="card__pattern"></div>
      </div>
      <div class="card__face card__face--back">
        <div class="card__number">{{ card.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
