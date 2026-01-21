<template>
    <div class="ship" :class="{
        'ship--low-fuel': fuelPercent < 10,
        'ship--exploded': exploded
    }" :style="{ left: x + 'px', top: y + 'px' }" @click="!exploded ? refuel() : null">
        <img :src="`/${exploded ? ship.type.crashed : ship.type.img}`" />
        <div class="ship__fuel" :style="{ width: fuelPercent + '%' }"></div>
        <div class="ship__name">{{ ship.name }}</div>
    </div>
</template>

<script>
export default {
    name: 'Ship',
    props: { ship: Object },
    data() {
        return {
            x: this.ship.x,
            y: this.ship.y,
            exploded: false,
            rafId: null
        }
    },
    computed: {
        fuelPercent() {
            return Math.max(0, (this.ship.fuel / this.ship.maxFuel) * 100)
        }
    },
    mounted() {
        this.gameLoop()
    },
    beforeUnmount() {
        if (this.rafId) cancelAnimationFrame(this.rafId)
    },
    methods: {
        gameLoop() {
            if (this.exploded) return

            const speed = this.ship.speed || 2
            this.x += speed
            this.ship.fuel -= speed * 0.1

            // 10% падение вниз
            if (this.fuelPercent < 10) {
                this.y += 2
            }

            // Падение при 0
            if (this.ship.fuel <= 0) {
                this.exploded = true
                setTimeout(() => {
                    this.$emit('crashed', this.ship.id)
                }, 1000)
                return
            }

            // Границы
            if (this.x > window.innerWidth - 250) {
                this.x = 450
                this.y = Math.random() * 300 + 100
            }

            if (this.y > window.innerHeight - 200) {
                this.y = 100
                this.x = 450
            }

            this.rafId = requestAnimationFrame(this.gameLoop)
        },
        refuel() {
            this.$emit('refuel', this.ship.id)
        }
    }
}
</script>

<style>
@import '../../style.css';
</style>
