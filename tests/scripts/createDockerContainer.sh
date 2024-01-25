docker pull couchbase
docker run \
  --detach \
  --name couchbase-ci \
  -p 8091:8091 \
  -p 8092:8092 \
  -p 8093:8093 \
  -p 8094:8094 \
  -p 8095:8095 \
  -p 8096:8096 \
  -p 8097:8097 \
  -p 9123:9123 \
  -p 11210:11210 \
  -p 11280:11280 \
  couchbase
