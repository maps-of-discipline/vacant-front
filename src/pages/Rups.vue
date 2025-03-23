<template>
    <div class="flex flex-column gap-3 m-auto w-11">
        <Panel header="Направления">
            <pre> {{ options }} </pre>
            <div class="header flex flex-row gap-3 mb-3 w-full">
                <Select 
                    placeholder="Первое направление" 
                    class="w-full" 
                    filter 
                    :options="yearFilteredPrograms(year1)" 
                    optionLabel="label" 
                    optionValue="value"
                    v-model="program1"    
                    :loading="isProgramsLoading"
                />
                <Select placeholder="Год" :loading="isProgramsLoading" v-model='year1' :options="yearOptions"/>
            </div>
            <div class="header flex flex-row gap-3 mb-3 w-full">
                <Select 
                    placeholder="Первое направление" 
                    class="w-full" 
                    filter 
                    :options="yearFilteredPrograms(year2)" 
                    optionLabel="label" 
                    optionValue="value"
                    v-model="program2"    
                    :loading="isProgramsLoading"
                />
                <Select placeholder="Год" :loading="isProgramsLoading" v-model='year2' :options="yearOptions"/>
            </div>
            
            <Select 
                placeholder="Семестр" 
                :options="semesterOptions"
                v-model="semester"
                optionLabel="label"
                optionValue="value"
            />
        </Panel>
        <Panel header="Расхождения">
            <div class="flex flex-column gap-3 w-full">
                

                <ProgressSpinner v-if="isRupsLoading" class="m-auto"/>
                <SelectButton :options="['method1', 'method2']" v-model="rupsMethod" class="m-auto"/>
                <DataTable v-if="!isRupsLoading" :value="chosedMethodTableData" size="small" stripedRows`` showGridlines>
                    <Column field="aup1" header="АУП1"></Column> 
                    <Column field="zet1" header="ЗЕТ1"></Column> 
                    <Column field="zet2" header="ЗЕТ2"></Column> 
                    <Column field="aup2" header="АУП2"></Column> 
                    <Column field="similarity" header="Схожесть"></Column> 
                </DataTable>
            </div>
        </Panel>
    </div>
</template>

<script setup>
import { 
    onMounted, 
    reactive, 
    ref, 
    watch, 
    computed
} from 'vue';

import {
    Select,
    Panel, 
    ProgressSpinner, 
    DataTable,
    Column, 
    SelectButton
} from 'primevue'

import MapsService from '../services/mapsService.js'

const programOptions = reactive([])
const yearOptions = reactive([])
const semesterOptions = [
    {label: '1 семестр', value: 1},
    {label: '2 семестр', value: 2},
    {label: '3 семестр', value: 3},
    {label: '4 семестр', value: 4},
    {label: '5 семестр', value: 5},
    {label: '6 семестр', value: 6},
    {label: '7 семестр', value: 7},
    {label: '8 семестр', value: 8},
]

const rups = ref([])


const program1 = ref(null)
const program2 = ref(null)
const year1 = ref(null)
const year2 = ref(null)
const semester = ref(null)

const isProgramsLoading = ref(false)
const isRupsLoading = ref(false)

const rupsMethod = ref('method1')



const yearFilteredPrograms = (year) => {
    return programOptions.filter(item => item.year === year)
}


const fetchMaps = async () => {
    isProgramsLoading.value = true
    let maps = await MapsService.getProgramOptions()
    console.log('maps', maps);
    maps = maps.filter(item => !item.adminOnly)


    const options = maps.map((faculty) => {
        const options = faculty.directions.map(dir => {
            return {
                label: dir.okco_code + " " + dir.name,
                value: dir.code,
                year: dir.year,
            }
        })
        return options
    }).reduce((acc, curr) => {
        return acc.concat(curr)
    }, [])
    programOptions.push(...options)

    const years = options.reduce((acc, curr) => {
        if (!acc.includes(curr.year)) {
            acc.push(curr.year)
        }
        return acc
    }, [])
    yearOptions.push(...years.sort((a, b) => b - a))
    console.log(yearOptions)
    year1.value = year2.value = years[0] 

    isProgramsLoading.value = false
}

onMounted(async () => {
    await fetchMaps();
});

watch([program1, program2, semester], async ([program1, program2, semester]) => {
    console.log('watch', program1, program2, semester)
    if (!program1 || !program2 || !semester) {
        return
    }
    isRupsLoading.value = true

    rups.value = await MapsService.getRups(program1, program2, semester)
    console.log('rups', rups.value.method2)
    isRupsLoading.value = false
})

const chosedMethodTableData = computed(() => {
    console.log(rups.value)
    return rups.value[rupsMethod.value]
})

</script>

<style></style>