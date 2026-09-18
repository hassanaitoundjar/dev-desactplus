<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  required?: boolean
  id?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
})

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="id" class="base-input-label">
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      class="base-input-field"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" class="base-input-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.base-input-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--dp-slate);
}

.required-asterisk {
  color: var(--dp-error);
}

.base-input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-charcoal);
  background-color: var(--dp-white);
  border: 1px solid var(--dp-sand);
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box;
}

.base-input-field::placeholder {
  color: var(--dp-stone);
}

.base-input-field:focus {
  border-color: var(--dp-gold);
  box-shadow: 0 0 0 1px rgba(193, 154, 91, 0.2);
}

.base-input-error {
  font-size: 0.75rem;
  color: var(--dp-error);
  margin: 0;
}
</style>
