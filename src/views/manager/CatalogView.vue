<script setup>
import { onMounted, reactive, ref } from 'vue'
import ErrorAlert from '../../components/ErrorAlert.vue'
import CountryRegionSelect from '../../components/CountryRegionSelect.vue'
import { geographyApi, hotelsApi, tripsApi } from '../../api'
import { useAsync } from '../../composables/useAsync'
import { TRANSPORT_TYPES, isoDate } from '../../utils/format'

/** Довідники для менеджера: країни й регіони, готелі та номери, рейси транспорту. */
const countries = ref([])
const hotels = ref([])
const message = ref('')
const country = reactive({ name: '' })
const region = reactive({ countryId: '', name: '' })
const hotel = reactive({ countryId: '', regionId: '', name: '', description: '', stars: 3 })
const room = reactive({ hotelId: '', name: '', capacity: 2, pricePerNight: 100 })
const trip = reactive({
  type: 'Plane',
  fromCity: '',
  toCity: '',
  departureAt: `${isoDate(7)}T09:00`,
  arrivalAt: `${isoDate(7)}T12:00`,
  price: 150,
  seatsTotal: 100
})
const { loading, error, run } = useAsync()

const reload = () =>
  run(async () => {
    countries.value = await geographyApi.countries()
    hotels.value = await hotelsApi.search({})
  })

async function submit(action, successText) {
  message.value = ''
  const result = await run(action)
  if (result) {
    message.value = successText
    reload()
  }
}

onMounted(reload)
</script>

<template>
  <h1 class="h3 mb-3">Довідники</h1>
  <ErrorAlert :message="error" />
  <div v-if="message" class="alert alert-success py-2">{{ message }}</div>

  <div class="row g-4">
    <div class="col-lg-6">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body">
          <h2 class="h5">Країни і регіони</h2>
          <form class="input-group mb-3" @submit.prevent="submit(() => geographyApi.createCountry(country.name), 'Країну додано.')">
            <input v-model="country.name" class="form-control" placeholder="Нова країна" required />
            <button class="btn btn-brand" :disabled="loading">Додати</button>
          </form>
          <form class="row g-2" @submit.prevent="submit(() => geographyApi.createRegion(region.countryId, region.name), 'Регіон додано.')">
            <div class="col-5">
              <select v-model="region.countryId" class="form-select" required>
                <option value="">Країна</option>
                <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="col-5"><input v-model="region.name" class="form-control" placeholder="Новий регіон" required /></div>
            <div class="col-2"><button class="btn btn-brand w-100" :disabled="loading">+</button></div>
          </form>
          <ul class="small mt-3 mb-0">
            <li v-for="c in countries" :key="c.id"><strong>{{ c.name }}:</strong> {{ c.regions.map((r) => r.name).join(', ') }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body">
          <h2 class="h5">Готелі і номери</h2>
          <form
            class="row g-2 mb-3"
            @submit.prevent="submit(() => hotelsApi.create({ name: hotel.name, description: hotel.description, stars: hotel.stars, regionId: hotel.regionId }), 'Готель додано.')"
          >
            <div class="col-12">
              <CountryRegionSelect v-model:country-id="hotel.countryId" v-model:region-id="hotel.regionId" :countries="countries" required all-label="Оберіть" />
            </div>
            <div class="col-8"><input v-model="hotel.name" class="form-control" placeholder="Назва готелю" required /></div>
            <div class="col-4">
              <select v-model.number="hotel.stars" class="form-select">
                <option v-for="s in 5" :key="s" :value="s">{{ s }}★</option>
              </select>
            </div>
            <div class="col-12"><input v-model="hotel.description" class="form-control" placeholder="Опис" /></div>
            <div class="col-12"><button class="btn btn-brand" :disabled="loading">Додати готель</button></div>
          </form>
          <form
            class="row g-2"
            @submit.prevent="submit(() => hotelsApi.addRoom(room.hotelId, { name: room.name, capacity: room.capacity, pricePerNight: room.pricePerNight }), 'Номер додано.')"
          >
            <div class="col-12">
              <select v-model="room.hotelId" class="form-select" required>
                <option value="">Готель</option>
                <option v-for="h in hotels" :key="h.id" :value="h.id">{{ h.name }}</option>
              </select>
            </div>
            <div class="col-6"><input v-model="room.name" class="form-control" placeholder="Назва номера" required /></div>
            <div class="col-3"><input v-model.number="room.capacity" type="number" min="1" class="form-control" title="Місткість" /></div>
            <div class="col-3"><input v-model.number="room.pricePerNight" type="number" min="1" class="form-control" title="Ціна за ніч" /></div>
            <div class="col-12"><button class="btn btn-brand" :disabled="loading">Додати номер</button></div>
          </form>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h2 class="h5">Новий рейс</h2>
          <form class="row g-2 align-items-end" @submit.prevent="submit(() => tripsApi.create(trip), 'Рейс додано.')">
            <div class="col-md-2">
              <select v-model="trip.type" class="form-select">
                <option v-for="(label, value) in TRANSPORT_TYPES" :key="value" :value="value">{{ label }}</option>
              </select>
            </div>
            <div class="col-md-2"><input v-model="trip.fromCity" class="form-control" placeholder="Звідки" required /></div>
            <div class="col-md-2"><input v-model="trip.toCity" class="form-control" placeholder="Куди" required /></div>
            <div class="col-md-2"><input v-model="trip.departureAt" type="datetime-local" class="form-control" required /></div>
            <div class="col-md-2"><input v-model="trip.arrivalAt" type="datetime-local" class="form-control" required /></div>
            <div class="col-md-1"><input v-model.number="trip.price" type="number" min="1" class="form-control" title="Ціна" /></div>
            <div class="col-md-1"><input v-model.number="trip.seatsTotal" type="number" min="1" class="form-control" title="Місць" /></div>
            <div class="col-12"><button class="btn btn-brand" :disabled="loading">Додати рейс</button></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
