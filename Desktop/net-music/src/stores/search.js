import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore('searchStore', () => {
  const searchHistory = ref([])

  return { searchHistory }
})