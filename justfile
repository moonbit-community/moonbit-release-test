build-scripts: 
     esbuild --bundle --platform=node ./scripts/install-moonbit-toolchain.ts --outdir=scripts_node/

init-project: 
    git submodule update --init --recursive --depth 1

sync-repos:
    git submodule update --remote --recursive

repos-status: 
    git submodule status