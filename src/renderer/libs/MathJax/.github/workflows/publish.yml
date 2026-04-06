name: Release

on:
  release:
    types: [published]

permissions:
  contents: read
  id-token: write

jobs:
  setup:
    runs-on: ubuntu-latest
    name: Build and publish MathJax
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          version: 10
          run_install: false
        
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          registry-url: 'https://registry.npmjs.org'

      - name: Publish to npmjs
        run: pnpm publish --provenance --no-git-checks
