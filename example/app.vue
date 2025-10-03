<script setup lang="ts">
// 引入插件提供的虚拟模块
import svgsSprite from 'virtual:svgs-sprite'
import SvgIcon from 'virtual:svg-icon'
</script>
<template>
    <div>
        <div style="height: 1300px; background-color: azure;"></div>
        <div>22
            <SvgIcon name="add" color="blue" />
            <SvgIcon name="404" />
            <SvgIcon name="add" />
            <SvgIcon name="add" />
            <SvgIcon name="add" />
        </div>
        <main>
            <router-view />
        </main>
        <svgsSprite />
    </div>
</template>