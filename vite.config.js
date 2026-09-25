import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        amal: resolve(__dirname, 'equipe/amal-amazouz.html'),
        ayoub: resolve(__dirname, 'equipe/ayoub-es-samlali.html'),
        elhoussine: resolve(__dirname, 'equipe/elhoussine-essmami.html'),
        salah: resolve(__dirname, 'equipe/salah-eddine-mimouni.html'),
        tarik: resolve(__dirname, 'equipe/tarik-el-abbadi.html'),
        wafae: resolve(__dirname, 'equipe/wafae-lamsabni.html'),
        yassmine: resolve(__dirname, 'equipe/yassmine-boudial.html'),
        youssef: resolve(__dirname, 'equipe/youssef-amazouz.html'),
        zakaria: resolve(__dirname, 'equipe/zakaria-mouchtati.html')
      }
    }
  }
})
