<template>
    <div class="timeline-container">
      <div class="timeline">
        <div
          v-for="(phase, index) in phases"
          :key="phase"
          class="timeline-item"
          :class="{ 'completed': index <= currentPhaseIndex, 'current': index === currentPhaseIndex }"
        >
          <div class="timeline-icon">
            <i :class="getPhaseIcon(phase)"></i>
          </div>
          <div class="timeline-content">
            <h3>{{ phase }}</h3>
            <div class="timeline-progress" :style="{ width: getProgressWidth(index) }"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const phases = [
    "onboarding",
    "discovery",
    "design",
    "development",
    "final approval",
    "testing",
    "launch",
    "live",
  ];
  
  interface Props {
    phase: string;
  }
  
  const props = defineProps<Props>();
  
  const currentPhaseIndex = computed(() => phases.indexOf(props.phase));
  
  const getPhaseIcon = (phase: string) => {
    const icons = {
      onboarding: 'fas fa-handshake',
      discovery: 'fas fa-search',
      design: 'fas fa-palette',
      development: 'fas fa-code',
      'final approval': 'fas fa-check-double',
      testing: 'fas fa-vial',
      launch: 'fas fa-rocket',
      live: 'fas fa-globe',
    };
    return icons[phase] || 'fas fa-circle';
  };
  
  const getProgressWidth = (index: number) => {
    if (index < currentPhaseIndex.value) return '100%';
    if (index === currentPhaseIndex.value) return '50%';
    return '0%';
  };
  </script>
  
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  
  .timeline-container {
    max-width: 90%;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  .timeline {
    position: relative;
    padding: 1rem 0;
  }
  
  .timeline::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    height: 100%;
    width: 4px;
    background-color: #e9ecef;
  }
  
  .timeline-item {
    position: relative;
    padding-left: 60px;
    margin-bottom: 2rem;
  }
  
  .timeline-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    font-size: 1.2rem;
    z-index: 2;
    transition: all 0.3s ease;
  }
  
  .timeline-content {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .timeline-content h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #495057;
    text-transform: capitalize;
  }
  
  .timeline-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background-color: #4facfe;
    transition: width 0.5s ease;
  }
  
  .timeline-item.completed .timeline-icon {
    background-color: #4facfe;
    color: #ffffff;
  }
  
  .timeline-item.current .timeline-icon {
    background-color: #4facfe;
    color: #ffffff;
    box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.3);
  }
  
  @media (max-width: 768px) {
    .timeline-container {
      padding: 1rem;
    }
  
    .timeline-item {
      padding-left: 50px;
    }
  
    .timeline-icon {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }
  }
  </style>