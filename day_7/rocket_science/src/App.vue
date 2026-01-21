<template>
  <div class="rockets">
    <!-- Космос -->
    <div class="rockets__space"></div>
    
    <!-- Меню -->
    <div class="rockets__sidebar">
      <h1>🚀 Космофлот</h1>
      
      <div class="ship-selector">
        <div 
          v-for="ship in shipsData" 
          :key="ship.id"
          class="ship-selector__item"
          :class="{ 'ship-selector__item--active': selectedShip?.id === ship.id }"
          @click="openModal(ship)"
        >
          <img :src="`/${ship.img}`" :alt="ship.name" />
          <div class="ship-selector__info">
            <h3>{{ ship.name }}</h3>
            <div>⛽ {{ ship.fuel }}</div>
            <div>⚡ {{ ship.speed.toFixed(1) }}x</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Статистика -->
    <div class="rockets__stats-top">
      <div class="stat">
        <span class="stat__number">{{ stats.active }}</span>
        <span>активных</span>
      </div>
      <div class="stat">
        <span class="stat__number">{{ stats.crashed }}</span>
        <span>разбитых</span>
      </div>
      <div class="stat">
        <span class="stat__number">{{ stats.launched }}</span>
        <span>запущено</span>
      </div>
    </div>
    
    <!-- Поле -->
    <div class="rockets__field">
      <Ship 
        v-for="ship in activeShips"
        :key="ship.id"
        :ship="ship"
        @refuel="refuelShip"
        @crashed="onShipCrashed"
      />
    </div>
    
    <ShipModal 
      v-if="showModal"
      :ship-type="selectedShip"
      @launch="launchShip"
      @close="closeModal"
    />
  </div>
</template>

<script>
import Ship from './components/Ship.vue'
import ShipModal from './components/ShipModal.vue'

export default {
  name: 'RocketScience',
  components: { Ship, ShipModal },
  data() {
    return {
      showModal: false,
      selectedShip: null,
      activeShips: [],
      nextShipId: 1,
      stats: { active: 0, crashed: 0, launched: 0 },
      shipsData: [
        { id: 1, name: 'Scout', fuel: 80, speed: 3, img: 'ship.png', crashed: 'ship_crashed3.png' },
        { id: 2, name: 'Falcon', fuel: 120, speed: 2.5, img: 'ship1.png', crashed: 'ship_crashed1.png' },
        { id: 3, name: 'Destroyer', fuel: 200, speed: 2, img: 'ship2.png', crashed: 'ship_crashed2.png' },
        { id: 4, name: 'Carrier', fuel: 300, speed: 1.5, img: 'ship4.png', crashed: 'ship_crashed4.png' },
        { id: 5, name: 'Titan', fuel: 500, speed: 1, img: 'ship5.png', crashed: 'ship_crashed5.png' }
      ]
    }
  },
  methods: {
    openModal(ship) {
      this.selectedShip = ship
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedShip = null
    },
    launchShip(shipName) {
      if (!shipName.trim() || !this.selectedShip) return
      
      const shipData = this.shipsData.find(s => s.id === this.selectedShip.id)
      const ship = {
        id: this.nextShipId++,
        name: shipName,
        type: shipData,
        fuel: shipData.fuel,
        maxFuel: shipData.fuel,
        speed: shipData.speed,
        x: 450,
        y: Math.random() * 400 + 100
      }
      
      this.activeShips.push(ship)
      this.stats.active++
      this.stats.launched++
      this.closeModal()
    },
    refuelShip(shipId) {
      const ship = this.activeShips.find(s => s.id === shipId)
      if (ship) ship.fuel = ship.maxFuel * 0.8
    },
    onShipCrashed(shipId) {
      const shipIndex = this.activeShips.findIndex(s => s.id === shipId)
      if (shipIndex > -1) {
        this.activeShips.splice(shipIndex, 1)
        this.stats.active--
        this.stats.crashed++
      }
    }
  }
}
</script>

<style>
@import '../style.css';
</style>
