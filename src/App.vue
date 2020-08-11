<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
    .container {
        width: 80vw;
        margin: 0 auto;
    }

    .middle {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    #app {
        height: 100vh;
        overflow-y: scroll;
    }

    .common_table_header-fixed {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
        background: #fff;
    }

    .table-header-fixed {
        position: fixed;
        top: 80px;
        width: 100%;
        z-index: 1000;
    }
</style>
