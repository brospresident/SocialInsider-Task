<template>
  <v-app>
    <v-main>
      <h1 class = 'text-center'>Brand comparator</h1>
      <br>
      <v-data-table
        :headers="headers"
        :items="brands"
        :items-per-page="5"
      ></v-data-table>
      <v-row justify='start'>
        <v-date-picker :show-current="false" v-model="picker1"></v-date-picker>
      </v-row>
      <v-row justify='start'>
        <v-date-picker :show-current="false" v-model="picker2"></v-date-picker>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

// interface IProfile {
//     name: string;
//     profileAdded: string;
//     id: string;
//     profileType: string;
// }

// interface IBrand {
//     profiles: IProfile[];
//     brandname: string;
// }

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
      { text: 'Total profiles', value: 'profiles' },
      { text: 'Total fans', value: 'fans' },
      { text: 'Total engagement', value: 'engagement' }
    ],
    brands: [] as any,
    picker1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    picker2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
  }),
  methods: {
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
          console.log(profile, start, end)
          const id = profile.id
          if (!/^\d+$/.test(id)) {
            continue
          }
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

          for (const item of Object.keys(data)) {
            if (!data[item].fans) {
              fans += 0
            } else {
              fans += data[item].fans
            }

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
          fans,
          engagement
        }
        this.brands.push(newBrand)
      }
    }
  },
  async mounted () {
    await this.fetchBrands()
  },
  watch: {
    picker1: function () {
      this.fetchBrands()
    },
    picker2: function () {
      this.fetchBrands()
    }
  }
})
</script>
