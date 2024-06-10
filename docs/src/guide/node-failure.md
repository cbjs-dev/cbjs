# Node Failure

In a Couchbase cluster, every node participates to the workload. No node is idle.  

To learn how to deal with node failure when reading or writing data, see the `kv durability` section.

## Data node

By default, Couchbase divides each bucket in 1024 fragments, also known as _shards_ or _vBucket_.
The shards are distributed amongst all the data nodes.   

A bucket configured with `replicas: 1` will see each shards on two nodes instead of one.  
One node will be considered the _active node_ for some shard, and the _replica node_ for other shards.

## Failover

If the unavailable node cannot be put back online, a _failover_ will remove the node from the cluster and one of the data node available will become the active node for shards previously held by the node that has been removed.  

Because now one node hold twice the amount of active shards that the other nodes, a rebalance should be performed.
