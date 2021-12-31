<template>
    <div class="x-modal x-inform-modal">
    <div class="x-modal-dialog">
      <div class="x-modal-content">
        <div class="x-modal-header">
          <div class="x-modal-title">Thông báo</div>
          <button class="xi xi-close" @click="$emit('close')"></button>
        </div>
        <div class="x-modal-body">
          <div class="x-col x-col-12 m-auto">
            <div class="x-row justify-content-center">
              <div class="x-col x-col-12">
                {{message}}
              </div>
            </div>
          </div>
        </div>
        <div class="x-modal-footer">
          <button class="x-btn x-btn-primary" @click="$emit('close')">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "BaseInformPopup",
    props: ['message']
}
</script>