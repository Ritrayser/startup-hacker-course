<template>
    <div class="timer__status" :class="{ 'timer__status--live': isLive }">
        {{ isLive ? '🔴 В эфире' : 'До стрима' }}
    </div>
</template>

<script>
export default {
    name: 'TimerHeader',  
    props: {
        isLive: Boolean    
    }
}
</script>