<template>
    <div class="memory">
        <div class="memory__stats">
            <div class="memory__stat">
                <div class="memory__stat-number">{{ moves }}</div>
                <div class="memory__stat-label">ходов</div>
            </div>
            <div class="memory__stat">
                <div class="memory__stat-number">{{ cardsLeft }}</div>
                <div class="memory__stat-label">карт</div>
            </div>
            <div class="memory__stat">
                <div class="memory__stat-number">{{ gameTime }}s</div>
                <div class="memory__stat-label">времени</div>
            </div>
            <div class="memory__stat">
                <div class="memory__stat-number">{{ totalCards }}</div>
                <div class="memory__stat-label">всего</div>
            </div>
        </div>

        <div class="memory__level-selector">
            <button class="memory__level-btn" :class="{ 'memory__level-btn--active': level === 6 }"
                @click="setLevel(6)">
                Легко (12 карт)
            </button>
            <button class="memory__level-btn" :class="{ 'memory__level-btn--active': level === 12 }"
                @click="setLevel(12)">
                Средне (24 карты)
            </button>
            <button class="memory__level-btn" :class="{ 'memory__level-btn--active': level === 18 }"
                @click="setLevel(18)">
                Сложно (36 карт)
            </button>
        </div>

        <div class="memory__board" :style="{ gridTemplateColumns: gridColumns }">
            <Card v-for="card in cards" :key="card.id" :card="card" :disabled="flippedCards.length === 2 || gameWon"
                @flip="flipCard" />
        </div>

        <div v-if="gameWon" class="memory__result">
            <div class="memory__result-card">
                <h2 class="memory__result-title">🎉 Победа!</h2>
                <div class="memory__result-rating">Оценка: <strong>{{ rating }}</strong></div>
                <button class="memory__result-btn" @click="newGame">Играть снова</button>
            </div>
        </div>
    </div>
</template>

<script>
import Card from './components/Card.vue'

export default {
    name: 'MemoryApp',
    components: { Card },
    data() {
        return {
            level: 12,
            cards: [],
            flippedCards: [],
            moves: 0,
            startTime: null,
            gameTime: 0,
            gameWon: false,
            timer: null
        }
    },
    computed: {
        cardsLeft() {
            return this.cards.filter(card => !card.matched).length
        },
        totalCards() {
            return this.level * 2
        },
        gridColumns() {
            const totalCards = this.cards.length
            if (totalCards <= 12) return 'repeat(4, 130px)'
            if (totalCards <= 24) return 'repeat(6, 130px)'
            return 'repeat(9, 130px)'
        },
        rating() {
            if (!this.gameWon) return ''
            const optimalMoves = this.level * 1.5
            if (this.moves <= optimalMoves) return '⭐⭐⭐ Отлично!'
            if (this.moves <= optimalMoves * 2) return '⭐⭐ Хорошо!'
            return '⭐ Нормально'
        }
    },
    methods: {
        setLevel(pairs) {
            this.level = pairs
            this.newGame()
        },
        newGame() {
            if (this.timer) {
                clearInterval(this.timer)
            }

            const values = Array.from({ length: this.level }, (_, i) => i + 1)
            const deck = [...values, ...values]

            this.cards = deck
                .sort(() => Math.random() - 0.5)
                .map((value, index) => ({
                    id: index,
                    value,
                    flipped: false,
                    matched: false
                }))

            this.flippedCards = []
            this.moves = 0
            this.gameWon = false
            this.gameTime = 0
            this.startTime = Date.now()

            this.timer = setInterval(() => {
                if (this.startTime && !this.gameWon) {
                    this.gameTime = Math.floor((Date.now() - this.startTime) / 1000)
                }
            }, 1000)
        },
        flipCard(cardId) {
            if (this.gameWon || this.flippedCards.length === 2) return

            const card = this.cards.find(c => c.id === cardId)
            if (card.flipped || card.matched) return

            card.flipped = true
            this.flippedCards.push(cardId)

            if (this.flippedCards.length === 2) {
                this.moves++
                setTimeout(() => this.checkMatch(), 1200)
            }
        },
        checkMatch() {
            const [id1, id2] = this.flippedCards
            const card1 = this.cards[id1]
            const card2 = this.cards[id2]

            if (card1.value === card2.value) {
                card1.matched = true
                card2.matched = true
                this.checkWin()
            } else {
                card1.flipped = false
                card2.flipped = false
            }

            this.flippedCards = []
        },
        checkWin() {
            this.gameWon = this.cards.every(card => card.matched)
            if (this.gameWon && this.timer) {
                clearInterval(this.timer)
            }
        }
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    mounted() {
        this.newGame()
    }
}
</script>
