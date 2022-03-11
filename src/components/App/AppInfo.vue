<script setup>
  const dialog = ref(false)
</script>

<template>
  <q-btn
    flat
    round
    icon="mdi-information-outline"
    @click="dialog = true"
  />

  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="row items-center no-wrap text-h6">
          <div class="col">
            <q-icon name="mdi-soccer" />
            MyFIFA Manager
          </div>
          <div class="col-auto">
            <q-btn
              href="https://github.com/avarixe/myfifa-vite"
              target="_blank"
              flat
              round
              icon="mdi-github"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-card-section>
      <q-list bordered>
        <q-item>
          <q-item-section>Version:</q-item-section>
          <q-item-section
            avatar
            class="text-info"
          >
            2.0.0
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Built with:</q-item-section>
          <q-item-section avatar>
            <div>
              <q-icon name="mdi-vuejs" />
              <q-icon name="mdi-language-ruby-on-rails" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>
