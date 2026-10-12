<script setup>
import animatedCat from './assets/siamese-cat-v9.png'
import stillCat from './assets/siamese-cat-still.png'
</script>

<template>
  <div class="sidebar-cat">
    <picture class="cat-companion">
      <source media="(prefers-reduced-motion: reduce)" :srcset="stillCat" />
      <img :src="animatedCat" width="314" height="314" alt="斜坐着摇尾巴、眨眼和舔爪挠头的像素暹罗猫" draggable="false" />
    </picture>
  </div>
</template>
