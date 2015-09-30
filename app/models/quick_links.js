/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');
var portRegex = '\\w*:(\\d+)';

App.QuickLinks = DS.Model.extend({
  label: DS.attr('string'),
  url: DS.attr('string'),
  service_id: DS.attr('string'),
  template: DS.attr('string'),
  http_config: DS.attr('string'),
  https_config: DS.attr('string'),
  site: DS.attr('string'),
  regex: DS.attr('string'),
  default_http_port: DS.attr('number'),
  default_https_port: DS.attr('number')
});


App.QuickLinks.FIXTURES = [
  {
    id:1,
    label:'NameNode UI',
    url:'%@://%@:%@',
    service_id: 'HDFS',
    template:'%@://%@:%@',
    http_config: 'dfs.namenode.http-address',
    https_config: 'dfs.namenode.https-address',
    site: 'hdfs-site',
    regex: portRegex,
    default_http_port: 50070,
    default_https_port: 50470
  },
  {
    id:2,
    label:'NameNode logs',
    url:'%@://%@:%@/logs',
    service_id: 'HDFS',
    template:'%@://%@:%@/logs',
    http_config: 'dfs.namenode.http-address',
    https_config: 'dfs.namenode.https-address',
    site: 'hdfs-site',
    regex: portRegex,
    default_http_port: 50070,
    default_https_port: 50470
  },
  {
    id:3,
    label:'NameNode JMX',
    url:'%@://%@:%@/jmx',
    service_id: 'HDFS',
    template:'%@://%@:%@/jmx',
    http_config: 'dfs.namenode.http-address',
    https_config: 'dfs.namenode.https-address',
    site: 'hdfs-site',
    regex: portRegex,
    default_http_port: 50070,
    default_https_port: 50470
  },
  {
    id:4,
    label:'Thread Stacks',
    url:'%@://%@:%@/stacks',
    service_id: 'HDFS',
    template:'%@://%@:%@/stacks',
    http_config: 'dfs.namenode.http-address',
    https_config: 'dfs.namenode.https-address',
    site: 'hdfs-site',
    regex: portRegex,
    default_http_port: 50070,
    default_https_port: 50470
  },
  {
    id:13,
    label:'HBase Master UI',
    url:'%@://%@:%@/master-status',
    service_id: 'HBASE',
    template:'%@://%@:%@/master-status',
    http_config: 'hbase.master.info.port',
    site: 'hbase-site',
    regex: '^(\\d+)$',
    default_http_port: 60010
  },
  {
    id:14,
    label:'HBase Logs',
    url:'%@://%@:60010/logs',
    service_id: 'HBASE',
    template:'%@://%@:%@/logs',
    http_config: 'hbase.master.info.port',
    site: 'hbase-site',
    regex: '^(\\d+)$',
    default_http_port: 60010
  },
  {
    id:15,
    label:'Zookeeper Info',
    url:'%@://%@:60010/zk.jsp',
    service_id: 'HBASE',
    template:'%@://%@:%@/zk.jsp',
    http_config: 'hbase.master.info.port',
    site: 'hbase-site',
    regex: '^(\\d+)$',
    default_http_port: 60010
  },
  {
    id:16,
    label:'HBase Master JMX',
    url:'%@://%@:60010/jmx',
    service_id: 'HBASE',
    template:'%@://%@:%@/jmx',
    http_config: 'hbase.master.info.port',
    site: 'hbase-site',
    regex: '^(\\d+)$',
    default_http_port: 60010
  },
  {
    id:17,
    label:'Debug Dump',
    url:'%@://%@:%@/dump',
    service_id: 'HBASE',
    template:'%@://%@:%@/dump',
    http_config: 'hbase.master.info.port',
    site: 'hbase-site',
    regex: '^(\\d+)$',
    default_http_port: 60010
  },
  {
    id:18,
    label:'Thread Stacks',
    url:'%@://%@:%@/stacks',
    service_id: 'HBASE',
    template:'%@://%@:%@/stacks',
    http_config: 'hbase.master.info.port',
    site: 'hbase-site',
    regex: '^(\\d+)$',
    default_http_port: 60010
  },
  {
    id:19,
    label:'Oozie Web UI',
    url:'%@://%@:%@/oozie?user.name=%@',
    service_id: 'OOZIE',
    template:'%@://%@:%@/oozie?user.name=%@',
    http_config: 'oozie.base.url',
    site: 'oozie-site',
    regex: portRegex,
    default_http_port: 11000
  },
  {
    id:20,
    label:'Ganglia Web UI',
    url:'%@://%@/ganglia',
    service_id: 'GANGLIA',
    template:'%@://%@/ganglia'

  },
  {
    id:23,
    label:'ResourceManager UI',
    url:'%@://%@:%@',
    service_id: 'YARN',
    template:'%@://%@:%@',
    http_config: 'yarn.resourcemanager.webapp.address',
    https_config: 'yarn.resourcemanager.webapp.https.address',
    site: 'yarn-site',
    regex: portRegex,
    default_http_port: 8088,
    default_https_port: 8090

  },
  {
    id:24,
    label:'ResourceManager logs',
    url:'%@://%@:%@/logs',
    service_id: 'YARN',
    template:'%@://%@:%@/logs',
    http_config: 'yarn.resourcemanager.webapp.address',
    https_config: 'yarn.resourcemanager.webapp.https.address',
    site: 'yarn-site',
    regex: portRegex,
    default_http_port: 8088,
    default_https_port: 8090
  },
  {
    id:25,
    label:'ResourceManager JMX',
    url:'%@://%@:%@/jmx',
    service_id: 'YARN',
    template:'%@://%@:%@/jmx',
    http_config: 'yarn.resourcemanager.webapp.address',
    https_config: 'yarn.resourcemanager.webapp.https.address',
    site: 'yarn-site',
    regex: portRegex,
    default_http_port: 8088,
    default_https_port: 8090
  },
  {
    id:26,
    label:'Thread Stacks',
    url:'%@://%@:%@/stacks',
    service_id: 'YARN',
    template:'%@://%@:%@/stacks',
    http_config: 'yarn.resourcemanager.webapp.address',
    https_config: 'yarn.resourcemanager.webapp.https.address',
    site: 'yarn-site',
    regex: portRegex,
    default_http_port: 8088,
    default_https_port: 8090
  },
  {
    id:27,
    label:'JobHistory UI',
    url:'%@://%@:%@',
    service_id: 'MAPREDUCE2',
    template:'%@://%@:%@',
    http_config: 'mapreduce.jobhistory.webapp.address',
    https_config: 'mapreduce.jobhistory.webapp.https.address',
    site: 'mapred-site',
    regex: portRegex,
    default_http_port: 19888
  },
  {
    id:28,
    label:'JobHistory logs',
    url:'%@://%@:%@/logs',
    service_id: 'MAPREDUCE2',
    template:'%@://%@:%@/logs',
    http_config: 'mapreduce.jobhistory.webapp.address',
    https_config: 'mapreduce.jobhistory.webapp.https.address',
    site: 'mapred-site',
    regex: portRegex,
    default_http_port: 19888
  },
  {
    id:29,
    label:'JobHistory JMX',
    url:'%@://%@:%@/jmx',
    service_id: 'MAPREDUCE2',
    template:'%@://%@:%@/jmx',
    http_config: 'mapreduce.jobhistory.webapp.address',
    https_config: 'mapreduce.jobhistory.webapp.https.address',
    site: 'mapred-site',
    regex: portRegex,
    default_http_port: 19888
  },
  {
    id:30,
    label:'Thread Stacks',
    url:'%@://%@:%@/stacks',
    service_id: 'MAPREDUCE2',
    template:'%@://%@:%@/stacks',
    http_config: 'mapreduce.jobhistory.webapp.address',
    https_config: 'mapreduce.jobhistory.webapp.https.address',
    site: 'mapred-site',
    regex: portRegex,
    default_http_port: 19888
  },
  {
    id:31,
    label:'Storm UI',
    url:'%@://%@:%@/',
    service_id: 'STORM',
    template:'%@://%@:%@/',
    http_config: 'ui.port',
    site: 'storm-site',
    regex: '^(\\d+)$',
    default_http_port: 8744
  },
  {
    id:32,
    label:'Falcon Web UI',
    url:'%@://%@:%@/index.html?user.name=%@',
    service_id: 'FALCON',
    template:'%@://%@:%@/index.html?user.name=%@',
    http_config: 'falcon_port',
    site: 'falcon-env',
    regex: '^(\\d+)$',
    default_http_port: 15000
  },
  {
    id: 33,
    label:'Ranger Admin UI',
    url:'%@://%@:%@/',
    service_id: 'RANGER',
    template:'%@://%@:%@/',
    http_config: 'http.service.port',
    https_config: 'https.service.port',
    regex: '(\\d*)+',
    site: 'ranger-site',
    default_http_port: 6080,
    default_https_port: 6182
  },
  {
    id: 34,
    label:'Spark History Server UI',
    url:'%@://%@:%@/',
    service_id: 'SPARK',
    template:'%@://%@:%@/',
    http_config: 'spark.history.ui.port',
    site: 'spark-defaults',
    regex: '^(\\d+)$',
    default_http_port: 18080
  },
  {
    id:35,
    label:'Accumulo Monitor UI',
    url:'%@://%@:%@/',
    service_id: 'ACCUMULO',
    template:'%@://%@:%@/',
    http_config: 'monitor.port.client',
    https_config: 'monitor.port.client',
    site: 'accumulo-site',
    regex: '^(\\d+)$',
    default_http_port: 50095,
    default_https_port: 50095
  },
  {
    id:36,
    label:'Atlas Dashboard',
    url:'%@://%@:%@/#!/search?user.name=%@',
    service_id: 'ATLAS',
    template:'%@://%@:%@/#!/search?user.name=%@',
    http_config: 'atlas.server.http.port',
    https_config: 'atlas.server.https.port',
    site: 'application-properties',
    regex: '^(\\d+)$',
    default_http_port: 21000,
    default_https_port: 21443
  }

];
