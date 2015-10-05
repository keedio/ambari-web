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

/**
 * App.HttpClient perform an ajax request
 */
App.HttpClient = Em.Object.create({

  /**
   *
   * @param jqXHR
   * @param textStatus
   * @param errorThrown
   * @param url api that invoked this callback function
   */
  defaultErrorHandler: function (jqXHR, textStatus, errorThrown, url) {
    try {
      var json = $.parseJSON(jqXHR.responseText);
    } catch (err) { }
    App.ajax.defaultErrorHandler(jqXHR, url);
    if (json) {
      Em.assert("HttpClient:", json);
    }
    else {
      if (!$.mocho) { // don't use this assert on tests
        Em.assert("HttpClient:", errorThrown);
      }
    }
  },

  /**
   * @param {string} url
   * @param {Object} ajaxOptions
   * @param {App.ServerDataMapper} mapper - json processor
   * @param {callback} errorHandler
   */
  request: function (url, ajaxOptions, mapper, errorHandler) {

    if (!errorHandler) {
      errorHandler = this.defaultErrorHandler;
    }

    var xhr = new XMLHttpRequest();
    var curTime = App.dateTime();

    xhr.open('GET', url + (url.indexOf('?') >= 0 ? '&_=' : '?_=') + curTime, true);
    xhr.send(null);

    this.onReady(xhr, "", ajaxOptions, mapper, errorHandler, url);
  },

  /**
   * Do POST-request equal to GET-request but with some params put to body
   * @param {string} url
   * @param {{params: string, success: callback, error: callback}} ajaxOptions
   * @param {App.QuickDataMapper} mapper
   * @param errorHandler
   * @method getAsPostRequest
   */
  getAsPostRequest: function (url, ajaxOptions, mapper, errorHandler) {

    if (!errorHandler) {
      errorHandler = this.defaultErrorHandler;
    }

    var xhr = new XMLHttpRequest(),
      curTime = App.dateTime(),
      params = JSON.stringify({
        "RequestInfo": {"query" : ajaxOptions.params }
      });

    xhr.open('POST', url + (url.indexOf('?') >= 0 ? '&_=' : '?_=') + curTime, true);
    xhr.setRequestHeader("X-Http-Method-Override", "GET");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

    this.onReady(xhr, "", ajaxOptions, mapper, errorHandler, url);
  },

  /*
   This function checks if we get response from server
   Not using onreadystatechange cuz of possible closure
   */
  onReady: function (xhr, tm, tmp_val, mapper, errorHandler, url) {
    var self = this;
    clearTimeout(tm);
    var timeout = setTimeout(function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            App.store.commit();
          } catch (err) {
            console.warn('App.store.commit error:', err);
          }
          mapper.map($.parseJSON(xhr.responseText));
          tmp_val.complete.call(self);
          xhr.abort();
        } else {
          errorHandler(xhr, "error", xhr.statusText, url);
        }

        tmp_val = null;
        xhr = null;
        clearTimeout(timeout);
        timeout = null;
      }
      else {
        self.onReady(xhr, timeout, tmp_val, mapper, errorHandler, url);
      }
    }, 10);
  },

  /**
   * @param {string} url
   * @param {App.ServerDataMapper} mapper - json processor
   * @param {Object} data - ajax data property
   * @param {callback} errorHandler
   * @param {number} interval - frequency request
   */
  get: function (url, mapper, data, errorHandler, interval) {
    if (!errorHandler && data.error) {
      errorHandler = data.error;
    }
    var client = this,
      request = function () {
        if (data.doGetAsPost && !App.get('testMode')) {
          client.getAsPostRequest(url, data, mapper, errorHandler);
        }
        else {
          client.request(url, data, mapper, errorHandler);
        }
        url = null;
        data = null;
        mapper = null;
        errorHandler = null;
      };

    interval = "" + interval;
    if (interval.match(/\d+/)) {
      $.periodic({period: interval}, request);
    }
    else {
      request();
    }
  },

  /**
   * @param {string} url
   * @param {Object} data - ajax data property
   * @param {App.ServerDataMapper} mapper - json processor
   * @param {callback} errorHandler
   * @param {number} interval - frequecy request
   */
  post: function (url, data, mapper, errorHandler, interval) {
    this.get(url, data, mapper, errorHandler, interval);
  }
});
