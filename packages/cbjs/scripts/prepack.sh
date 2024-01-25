BINARY_PATH=src/couchbase-native.node

# The presence of the file is required for `tsup` to work properly
if [ ! -e $BINARY_PATH ]; then
  touch $BINARY_PATH
fi

tsup

# We don't want to include the binary into the package
rm $BINARY_PATH