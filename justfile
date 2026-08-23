test-cicd:
    act

dev:
    bun run dev

# generate static site
generate:
    bun run generate

build:
    bun run build

# `bun test` is it native bun runner, not vitest
test:
    bun run test
