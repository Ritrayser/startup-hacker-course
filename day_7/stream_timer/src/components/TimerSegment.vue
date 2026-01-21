<template>
    <div class="timer__unit">
        <span class="timer__number" :class="`timer__number--${unit}`">{{ value }}</span>
        <span class="timer__label">{{ label }}</span>
    </div>
</template>

<script>
export default {
    name: 'TimerSegment',
    props: {
        value: [Number, String],
        label: String,
        unit: String
    }
}
</script>
