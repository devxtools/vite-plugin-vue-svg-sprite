<script setup lang="ts">
// 引入插件提供的虚拟模块
import Svgs from 'virtual:svgs'
import SvgIcon from 'virtual:svg-icon'
</script>
<template>
    <div>
        <div style="height: 1300px; background-color: azure;"></div>
        <div>
            <SvgIcon name="logo1" />
            <SvgIcon name="logo2" />
            <SvgIcon name="logo3" />
            <SvgIcon name="logo4" />
            <SvgIcon name="add" color="blue" />
            <SvgIcon name="404" style="color: #f00;" />
            <SvgIcon name="download" />
            <SvgIcon name="en" />
            <SvgIcon name="f" />
            <SvgIcon name="facebook" />
            <SvgIcon name="ins" />
            <SvgIcon name="menu" />
            <SvgIcon name="pentagram" />
            <SvgIcon name="rightArrow" />
            <SvgIcon name="safety" />
            <SvgIcon name="score" />
            <SvgIcon name="tg" />
            <SvgIcon name="tip" />
            <SvgIcon name="x" />
        </div>
        <main>
            <router-view />
        </main>
        <Svgs />
    </div>
</template>