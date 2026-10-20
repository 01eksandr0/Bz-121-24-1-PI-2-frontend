<script setup>
import { computed } from 'vue'

/** Пара випадних списків "країна → регіон". Регіони залежать від обраної країни. */
const props = defineProps({
  countries: { type: Array, required: true },
  countryId: { type: [Number, String], default: '' },
  regionId: { type: [Number, String], default: '' },
  required: { type: Boolean, default: false },
  allLabel: { type: String, default: 'Усі' }
})
const emit = defineEmits(['update:countryId', 'update:regionId'])

const regions = computed(() => props.countries.find((c) => c.id === Number(props.countryId))?.regions ?? [])

function changeCountry(event) {
  emit('update:countryId', event.target.value === '' ? '' : Number(event.target.value))
  emit('update:regionId', '')
}
</script>

<template>
  <div class="row g-2">
    <div class="col-md-6">
      <label class="form-label small text-muted">Країна</label>
      <select class="form-select" :value="countryId" :required="required" @change="changeCountry">
        <option value="">{{ allLabel }}</option>
        <option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option>
      </select>
    </div>
    <div class="col-md-6">
      <label class="form-label small text-muted">Регіон</label>
      <select
        class="form-select"
        :value="regionId"
        :required="required"
        :disabled="!regions.length"
        @change="emit('update:regionId', $event.target.value === '' ? '' : Number($event.target.value))"
      >
        <option value="">{{ allLabel }}</option>
        <option v-for="region in regions" :key="region.id" :value="region.id">{{ region.name }}</option>
      </select>
    </div>
  </div>
</template>
