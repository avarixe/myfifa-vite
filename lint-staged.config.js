export default {
  '**/*.{vue,ts}': () => 'vue-tsc -p tsconfig.json --noEmit',
  '**/*.{vue,js,ts}': ['eslint --fix', 'prettier --write']
}
