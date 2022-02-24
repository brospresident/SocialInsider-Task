<template>
  <v-app>
    <v-main>
      <h1 class = 'text-center'>Brand comparator</h1>
      <br>
      <div class = "d-flex justify-center">
        <v-data-table
          :headers="headers"
          :items="brands"
          :items-per-page="5"
          class = "elevation-1 width"
        ></v-data-table>
      </div>
      <v-row justify='center'>
        <v-date-picker :show-current="false" v-model="picker1" class = "margin elevation-1"></v-date-picker>
        <v-date-picker :show-current="false" v-model="picker2" class = "margin elevation-1"></v-date-picker>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

export default Vue.extend({
  name: 'App',

  data: () => ({
    headers: [
      {
        text: 'Brand name',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'Total profiles', value: 'profiles', width: '20%' },
      { text: 'Total fans', value: 'fans', width: '20%' },
      { text: 'Total engagement', value: 'engagement', width: '20%' }
    ],
    brands: [] as any,
    picker1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    picker2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
  }),
  methods: {
    formatNumber (num: number) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
    async fetchBrands (): Promise<void> {
      this.brands = []
      const axiosConfig: AxiosRequestConfig = {
        method: 'GET',
        url: 'http://localhost:3000/api/brands'
      }
      const response = await axios(axiosConfig)
      const brands = response.data
      for (const brand of brands) {
        const start: number = new Date(this.picker1).getTime()
        const end: number = new Date(this.picker2).getTime()

        let fans = 0
        let engagement = 0

        for (const profile of brand.profiles) {
          // console.log(profile, start, end)
          const id = profile.id
          const type = profile.profile_type
          // console.log(id, type, start, end)

          const url = `http://localhost:3000/api/profile/?id=${id}&type=${type}&start=${start}&end=${end}`
          const axiosConfig: AxiosRequestConfig = {
            method: 'GET',
            url: url
          }
          const response = await axios(axiosConfig)
          const data = response.data
          // console.log(data)

          const keys = Object.keys(data)
          const lastDay = data[keys[keys.length - 1]]
          let dataFans = 0

          // check if last day has a field of fans
          if (lastDay.fans) {
            dataFans = parseInt(lastDay.fans)
          } else {
            dataFans = 0
          }
          
          fans += dataFans
          console.log(brand, data[keys[keys.length - 1]])

          for (const item of keys) {
            if (!data[item].engagement) {
              engagement += 0
            } else {
              engagement += data[item].engagement
            }
          }
        }
        const newBrand: any = {
          name: brand.brandname,
          profiles: brand.profiles.length,
          fans: this.formatNumber(fans),
          engagement: this.formatNumber(engagement)
        }
        this.brands.push(newBrand)
      }
    }
  },
  watch: {
    picker2: async function () {
      await this.fetchBrands()
    }
  }
})
</script>

<style>
.margin {
  margin: 20px 10px 10px 20px;
}

.width {
  width: 60%;
}
</style>
