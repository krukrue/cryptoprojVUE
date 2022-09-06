<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!-- <div class="
        fixed
        w-100
        h-100
        opacity-80
        bg-purple-800
        inset-0
        z-50
        flex
        items-center
        justify-center
      ">
      <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div> -->
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                @keydown.enter="addClick($event)"
                @input="getNames"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>
            <div
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                v-for="t of getNames().slice(0, 4)"
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
      <template v-if="tickers != 0">
        <p>
          <button
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page == 1 ? page : page--"
          >
            Назад
          </button>
          <button
            class="mx-2 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page++"
            v-if="!hasNextPage"
          >
            Вперед
          </button>
          Фильтр: <input v-model="filter" />
        </p>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="(tick, idx) of paginatedTickers"
            :key="tick.name"
            @click="select(tick)"
            :class="sel == tick ? 'border-4' : ''"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div
              :class="{ 'bg-red-100': !checkExist(tick.name) }"
              class="px-4 py-5 sm:p-6 text-center"
            >
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ tick.name.toUpperCase() }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatedPrice(tick.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="deleteUSD(tick, idx)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section class="relative" v-if="sel">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ sel.name }}
        </h3>
        <div
          class="flex items-end border-gray-600 border-b border-l h-64"
          ref="graf"
        >
          <div
            v-for="(bar, idx) of normalizeGraf"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button @click="sel = 0" type="button" class="absolute top-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unSubscribeTicker } from "./api";
import addButton from "./components/addButton.vue";

export default {
  name: "App",

  components: {
    addButton,
  },

  data() {
    return {
      ticker: "",
      sel: null,
      graf: [],
      bgcolor: "bg-red-100",
      tickers: [],
      namesT: [],
      exist: false,
      coinLista: this.checkAllPrices(),
      coinNames: [],
      page: 1,
      filter: "",
    };
  },

  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) {
      this.filter = windowData.filter;
    }
    if (windowData.page) {
      this.page = windowData.page;
    }

    const tickersData = localStorage.getItem("crypto-list");
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.name, (newPrice) =>
          this.updateTicker(ticker.name, newPrice)
        );
      });
    }
    //setInterval(this.updateInterval, 5000);
  },
  computed: {
    start() {
      return (this.page - 1) * 6;
    },
    end() {
      return this.page * 6;
    },
    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.name.toUpperCase().includes(this.filter.toUpperCase())
      );
    },
    paginatedTickers() {
      return this.filteredTickers.slice(this.start, this.end);
    },
    hasNextPage() {
      return this.filteredTickers.length <= this.end;
    },
    normalizeGraf() {
      const maxValue = Math.max(...this.graf);
      const minValue = Math.min(...this.graf);
      if (maxValue === minValue) return this.graf.map(() => 50);
      return this.graf.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
  },
  methods: {
    updateTicker(tickerName, price) {
      //console.log('Update Ticker', this.$refs.graf)
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          t.price = price;
          if (t === this.sel) {
            this.graf.push(price);
            if (this.graf.length > 150) {
              this.graf.shift();
            }
          }
        });
    },
    formatedPrice(price) {
      if (price === "-") {
        return price;
      }
      price = +price;
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
    checkExist(tickerName) {
      if (!this.coinNames.includes(tickerName)) {
        return false;
      } else {
        return true;
      }
    },
    addClick() {
      const currentTicker = {
        name: this.ticker.toUpperCase(),
        price: "-",
      };

      if (!this.namesT.includes(currentTicker.name)) {
        this.exist = false;
        this.namesT.push(currentTicker.name);
        this.tickers = [...this.tickers, currentTicker];
        subscribeToTicker(currentTicker.name, (newPrice) =>
          this.updateTicker(currentTicker.name, newPrice)
        );
      } else {
        console.log("This name already exist");
        this.exist = true;
      }
      this.ticker = "";
    },
    deleteUSD(ti) {
      this.tickers = this.tickers.filter((t) => t !== ti);
      this.namesT = this.namesT.filter((t) => t !== ti.name.toUpperCase());

      if (this.sel == ti) {
        this.sel = null;
      }
      unSubscribeTicker(ti.name);
    },
    select(t) {
      this.sel = t;
      this.graf = [];
    },

    checkAllPrices() {
      const cc = require("cryptocompare");
      cc.setApiKey(
        "<c535d1fe1979392ae7970e53cce4ea0b0a2a6a2f5c318cf1f22f23aeeed2d287>"
      );

      cc.coinList()
        .then((coinList) => {
          console.log(coinList);
          for (let coin of Object.entries(coinList.Data)) {
            this.coinNames.push(coin[1].Name);
          }
        })
        .catch(console.error);
    },
    getNames() {
      let filtred = this.coinNames.filter((filtered) =>
        filtered.toUpperCase().startsWith(this.ticker.toUpperCase())
      );
      return filtred;
    },
    pushName(text) {
      this.ticker = text;
      this.addClick();
    },
  },
  watch: {
    tickers() {
      localStorage.setItem("crypto-list", JSON.stringify(this.tickers));
      localStorage.setItem("crypto-name-list", JSON.stringify(this.namesT));
      console.log("Add to localStorage");
    },
    sel() {
      this.graf = [];
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    filter() {
      this.page = 1;
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
      );
    },
    page() {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${this.filter}&page=${this.page}`
      );
    },
  },
};
</script>
