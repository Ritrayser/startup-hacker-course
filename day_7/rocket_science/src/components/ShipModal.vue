<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal">
            <h2>🚀 Запуск {{ shipType?.name || 'Корабля' }}</h2>
            <input v-model="shipName" class="modal__input" placeholder="Имя корабля" @keyup.enter="launch"
                autocomplete="off" />
            <div class="modal__buttons">
                <button class="btn btn--primary" @click="launch" :disabled="!shipName.trim()">
                    Запустить
                </button>
                <button class="btn btn--secondary" @click="$emit('close')">
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShipModal',
    props: { shipType: Object },
    data() {
        return { shipName: '' }
    },
    methods: {
        launch() {
            if (this.shipName.trim()) {
                this.$emit('launch', this.shipName)
                this.shipName = ''
            }
        }
    }
}
</script>

<style>
@import '../../style.css';
</style>
