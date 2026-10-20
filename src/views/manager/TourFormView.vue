<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ErrorAlert from '../../components/ErrorAlert.vue'
import CountryRegionSelect from '../../components/CountryRegionSelect.vue'
import { geographyApi, toursApi } from '../../api'
import { useAsync } from '../../composables/useAsync'
import { TOUR_TYPES, isoDate } from '../../utils/format'

const DEFAULT_START_DAYS = 30
const DEFAULT_NIGHTS = 7
const props = defineProps({ id: { type: String, default: null } })
const router = useRouter()
const isEdit = computed(() => Boolean(props.id))
const countries = ref([])
const countryId = ref('')
const form = reactive({
  title: '',
  description: '',
  type: 'Beach',
  regionId: '',
  startDate: isoDate(DEFAULT_START_DAYS),
  endDate: isoDate(DEFAULT_START_DAYS + DEFAULT_NIGHTS),
  pricePerPerson: 500,
  discountPercent: 0,
  capacity: 20
})
const { loading, error, run } = useAsync()

onMounted(() =>
  run(async () => {
    countries.value = await geographyApi.countries()
    if (isEdit.value) {
      const tour = await toursApi.get(props.id)
      countryId.value = tour.countryId
      Object.assign(form, {
        title: tour.title,
        description: tour.description,
        type: tour.type,
        regionId: tour.regionId,
        startDate: tour.startDate.slice(0, 10),
        endDate: tour.endDate.slice(0, 10),
        pricePerPerson: tour.pricePerPerson,
        discountPercent: tour.discountPercent,
        capacity: tour.capacity
      })
    }
  })
)

async function save() {
  const saved = await run(() => (isEdit.value ? toursApi.update(props.id, form) : toursApi.create(form)))
  if (saved) {
    router.push({ name: 'manage-tours' })
  }
}
</script>

<template>
  <h1 class="h3 mb-3">{{ isEdit ? 'Редагування туру' : 'Новий тур' }}</h1>
  <ErrorAlert :message="error" />
  <form class="card border-0 shadow-sm" @submit.prevent="save">
    <div class="card-body row g-3">
      <div class="col-md-8">
        <label class="form-label small text-muted">Назва</label>
        <input v-model="form.title" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label class="form-label small text-muted">Тип</label>
        <select v-model="form.type" class="form-select">
          <option v-for="(label, value) in TOUR_TYPES" :key="value" :value="value">{{ label }}</option>
        </select>
      </div>
      <div class="col-12">
        <label class="form-label small text-muted">Опис</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>
      <div class="col-md-8">
        <CountryRegionSelect v-model:country-id="countryId" v-model:region-id="form.regionId" :countries="countries" required all-label="Оберіть" />
      </div>
      <div class="col-md-2">
        <label class="form-label small text-muted">Початок</label>
        <input v-model="form.startDate" type="date" class="form-control" required />
      </div>
      <div class="col-md-2">
        <label class="form-label small text-muted">Кінець</label>
        <input v-model="form.endDate" type="date" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label class="form-label small text-muted">Ціна за особу, $</label>
        <input v-model.number="form.pricePerPerson" type="number" min="1" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label class="form-label small text-muted">Знижка, % (більше 0 — «гарячий» тур)</label>
        <input v-model.number="form.discountPercent" type="number" min="0" max="90" class="form-control" />
      </div>
      <div class="col-md-4">
        <label class="form-label small text-muted">Кількість місць</label>
        <input v-model.number="form.capacity" type="number" min="1" class="form-control" required />
      </div>
      <div class="col-12 d-flex justify-content-end gap-2">
        <RouterLink :to="{ name: 'manage-tours' }" class="btn btn-outline-secondary">Скасувати</RouterLink>
        <button class="btn btn-brand" :disabled="loading">Зберегти</button>
      </div>
    </div>
  </form>
</template>
