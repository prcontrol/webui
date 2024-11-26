<template>
<!--Status Anzeigen hardcodet zum Veranschaulichen: später Werte von Backend abrufen-->
  <header class="status-header">
    <div class="status-item">
        <span class="status-label">PHOTO-BOX:</span>
        <span class="status-green">Connected</span> <!--nur zum anschauen: remove later-->
    </div>
    <div class="status-item">
        <span class="status-label">STROM-BOX:</span>
        <span class="status-green">Connected</span>
    </div>
    <div class="status-item">
        <span class="status-label">TEMPERATUR: 22°C</span>
    </div>
    <div class="status-item">
        <span class="status-label">UV-INDEX: 2</span>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StatusHeader',

});
</script>

<style scoped>
.status-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    color: black;
    border-bottom: 1.5px solid #adadad;
}
.status-item{
    display: flex;
    text-decoration-color:black;
    align-items: center;
    margin-right: 10px;
}
.status-label {
    margin-right: 5px;
}
.status-green{
    color: green;
}
</style>
