<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="addClick"
            @input="gotName(ticker)"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
            v-for="t of gotName(ticker)"
            :key="t.name"
            @click="pushName(t)"
          >
            {{ t }}
          </span>
        </div>
        <div v-if="exist" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button
      @click="addClick"
      v-on:keydown.enter="addClick"
      type="button"
      class="my-4"
    />
  </section>
</template>
<script>
import addButton from "./addButton.vue";
export default {
  props:{
    gotName: {
      type: Array,
      required: false,
      
    },
    exist: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    addButton,
  },
  data() {
    return {
      ticker: "",
      
    };
  },
  methods: {
    addClick() {
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },
    pushName(text){
      this.ticker = text;
      this.addClick();
    }
  },
};
</script>
