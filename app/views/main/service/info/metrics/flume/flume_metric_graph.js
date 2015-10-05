/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var App = require('app');

/**
 * @class
 *
 * This is a view for showing individual graphs of Flume.
 *
 * @extends App.ChartLinearTimeView
 * @extends Ember.Object
 * @extends Ember.View
 */
App.ChartServiceFlumeMetricGraph = App.ChartLinearTimeView.extend({
  /**
   * One of 'SOURCE', 'SINK' or 'CHANNEL'.
   */
  metricType: null,
  metricName: null,
  hostName: null,
  metricItems: null,

  id: function(){
    return "service-metrics-flume-metric-graph-" + this.get('metricType') + '-' + this.get('metricName');
  }.property('metricType', 'metricName'),

  title: function(){
    return this.get('metricName');
  }.property('metricName'),

  ajaxIndex: 'host.host_component.flume.metrics.timeseries',

  getDataForAjaxRequest: function() {
    var data = this._super();

    var urlFields = '';
    this.get('metricItems').forEach(function (metricItem, index) {
      urlFields += index === 0 ? '' : ',';
      urlFields += 'metrics/flume/flume/' + this.get('metricType') + '/' + metricItem + '/' + this.get('metricName') +
          '[' + data.fromSeconds + ',' + data.toSeconds + ',' + data.stepSeconds + ']'
    }, this);

    data.url = App.get('apiPrefix') + '/clusters/' + App.get('clusterName') + '/hosts/' + this.get('hostName') + '/host_components/FLUME_HANDLER?fields=' + urlFields;
    return data;
  },

  transformToSeries: function (jsonData) {
    var seriesArray = [];
    var self = this;
    if (jsonData && jsonData.metrics && jsonData.metrics.flume && jsonData.metrics.flume.flume &&
        jsonData.metrics.flume.flume[this.get('metricType')]) {
      var metricTypeData = jsonData.metrics.flume.flume[this.get('metricType')];
      for ( var componentName in metricTypeData) {
        var seriesName = componentName;
        var seriesData = metricTypeData[componentName][this.get('metricName')];
        if (seriesData) {
          seriesArray.push(self.transformData(seriesData, seriesName));
        }
      }
    }
    return seriesArray;
  }
});
