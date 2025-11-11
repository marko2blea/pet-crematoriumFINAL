<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import type { ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler, // Importante para el 'backgroundColor' (fill: true)
} from 'chart.js';

// Registrar todos los componentes necesarios de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

// Definir los props que el componente recibirá desde 'reportes.vue'
defineProps<{
  chartData: ChartData<'line'>;
}>();

// Opciones por defecto para el gráfico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Formatear el eje Y como moneda CLP
        callback: (value: string | number) => {
          if (typeof value === 'number') {
            return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
          }
          return value;
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false, // Ocultar la leyenda (ya que solo es 1 dataset)
    },
    tooltip: {
      callbacks: {
        // Formatear el tooltip (al pasar el mouse) como moneda CLP
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
          }
          return label;
        },
      },
    },
  },
};
</script>