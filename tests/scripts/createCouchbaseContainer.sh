docker pull couchbase:7.6.1
docker run \
  --name couchbase-7.6.1 \
  --detach \
  -p 8091:8091 \
  -p 8092:8092 \
  -p 8093:8093 \
  -p 8094:8094 \
  -p 8095:8095 \
  -p 8096:8096 \
  -p 8097:8097 \
  -p 9102:9102 \
  -p 18091:18091 \
  -p 18092:18092 \
  -p 18093:18093 \
  -p 18094:18094 \
  -p 18095:18095 \
  -p 18096:18096 \
  -p 18097:18097 \
  -p 19102:19102 \
  -p 9123:9123 \
  -p 11210:11210 \
  -p 11280:11280 \
  couchbase:7.6.1

sleep 5

source loadEnv.sh
pnpm dlx tsx ./initTestCluster.ts