export default {
  '**/*.{vue,ts}': [
    "eslint --fix",
    () => 'vue-tsc -p tsconfig.json --noEmit',
    "prettier --write"
  ]
}
