docker build \
  -f docker/Dockerfile \
  --tag microlc/micro-lc:latest \
  --build-arg COMMIT_SHA='1' \
  --build-arg DESCRIPTION='test' \
  --build-arg VERSION='0.1.0' \
  .