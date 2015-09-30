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
var uiEffects = require('utils/ui_effects');

App.HostComponentView = Em.View.extend({

  templateName: require('templates/main/host/details/host_component'),

  /**
   * @type {App.HostComponent}
   */
  content: null,

  /**
   * @type {App.HostComponent}
   */
  hostComponent: function () {
    var hostComponent = null;
    var serviceComponent = this.get('content');
    var host = App.router.get('mainHostDetailsController.content');
    if (host) {
      hostComponent = host.get('hostComponents').findProperty('componentName', serviceComponent.get('componentName'));
    }
    return hostComponent;
  }.property('content', 'App.router.mainHostDetailsController.content'),
  /**
   * @type {String}
   */
  workStatus: function () {
    var workStatus = this.get('content.workStatus');
    var hostComponent = this.get('hostComponent');
    if (hostComponent) {
      workStatus = hostComponent.get('workStatus');
    }
    return workStatus;
  }.property('content.workStatus', 'hostComponent.workStatus'),

  /**
   * Return host component text status
   * @type {String}
   */
  componentTextStatus: function () {
    var componentTextStatus = this.get('content.componentTextStatus');
    var hostComponent = this.get('hostComponent');
    if (hostComponent) {
      componentTextStatus = hostComponent.get('componentTextStatus');
    }
    return componentTextStatus;
  }.property('content.passiveState','workStatus'),

  /**
   * CSS-class for host component status
   * @type {String}
   */
  statusClass: function () {
    //Class when install failed
    if (this.get('workStatus') === App.HostComponentStatus.install_failed) {
      return 'health-status-color-red icon-cog';
    }

    //Class when installing
    if (this.get('workStatus') === App.HostComponentStatus.installing) {
      return 'health-status-color-blue icon-cog';
    }

    //For all other cases
    return 'health-status-' + App.HostComponentStatus.getKeyName(this.get('workStatus'));

  }.property('workStatus'),

  /**
   * CSS-icon-class for host component status
   * @type {String}
   */
  statusIconClass: function () {
    return Em.getWithDefault({
      'health-status-started': App.healthIconClassGreen,
      'health-status-starting': App.healthIconClassGreen,
      'health-status-installed': App.healthIconClassRed,
      'health-status-stopping': App.healthIconClassRed,
      'health-status-unknown': App.healthIconClassYellow,
      'health-status-DEAD-ORANGE': App.healthIconClassOrange
    }, this.get('statusClass'), '');
  }.property('statusClass'),

  /**
   * CSS-class for disabling drop-down menu with list of host component actions
   * Disabled if host's <code>healthClass</code> is health-status-DEAD-YELLOW (lost heartbeat)
   * @type {String}
   */
  disabled: function () {
    return (this.get('parentView.content.healthClass') === "health-status-DEAD-YELLOW") ? 'disabled' : '';
  }.property('parentView.content.healthClass'),

  /**
   * For Upgrade failed state
   * @type {bool}
   */
  isUpgradeFailed: function () {
    return App.HostComponentStatus.getKeyName(this.get('workStatus')) === "upgrade_failed";
  }.property("workStatus"),

  /**
   * For Install failed state
   * @type {bool}
   */
  isInstallFailed: function () {
    return App.HostComponentStatus.getKeyName(this.get('workStatus')) === "install_failed";
  }.property("workStatus"),

  /**
   * For Started and Starting states
   * @type {bool}
   */
  isStart: function () {
    return [App.HostComponentStatus.started, App.HostComponentStatus.starting].contains(this.get('workStatus'));
  }.property('workStatus'),

  /**
   * For Installed state
   * @type {bool}
   */
  isStop: function () {
    return (this.get('workStatus') == App.HostComponentStatus.stopped);
  }.property('workStatus'),

  /**
   * For Installing state
   * @type {bool}
   */
  isInstalling: function () {
    return (this.get('workStatus') == App.HostComponentStatus.installing);
  }.property('workStatus'),

  /**
   * For Init state
   * @type {bool}
   */
  isInit: function() {
    return this.get('workStatus') == App.HostComponentStatus.init;
  }.property('workStatus'),

  /**
   * No action available while component is starting/stopping/unknown
   * @type {String}
   */
  noActionAvailable: function () {
    var workStatus = this.get('workStatus');
    return [App.HostComponentStatus.starting, App.HostComponentStatus.stopping,
      App.HostComponentStatus.unknown, App.HostComponentStatus.disabled].contains(workStatus) ? "hidden" : '';
  }.property('workStatus'),

  /**
   * For Stopping or Starting states
   * @type {bool}
   */
  isInProgress: function () {
    return (this.get('workStatus') === App.HostComponentStatus.stopping ||
      this.get('workStatus') === App.HostComponentStatus.starting);
  }.property('workStatus'),

  /**
   * For OFF <code>passiveState</code> of host component
   * @type {bool}
   */
  isActive: function () {
    return (this.get('content.passiveState') == "OFF");
  }.property('content.passiveState'),

  /**
   * Shows whether we need to show Delete button
   * @type {bool}
   */
  isDeletableComponent: function () {
    return App.get('components.deletable').contains(this.get('content.componentName'));
  }.property('content'),

  /**
   * Host component with some <code>workStatus</code> can't be deleted (so, disable such action in the dropdown list)
   * @type {bool}
   */
  isDeleteComponentDisabled: function () {
    return ![App.HostComponentStatus.stopped, App.HostComponentStatus.unknown, App.HostComponentStatus.install_failed, App.HostComponentStatus.upgrade_failed, App.HostComponentStatus.init].contains(this.get('workStatus'));
  }.property('workStatus'),

  /**
   * Check if component may be reassinged to another host
   * @type {bool}
   */
  isReassignable: function () {
    return App.supports.reassignMaster && App.get('components.reassignable').contains(this.get('content.componentName')) && App.router.get('mainHostController.hostsCountMap')['TOTAL'] > 1;
  }.property('content.componentName'),

  /**
   * Check if component is restartable
   * @type {bool}
   */
  isRestartableComponent: function() {
    return App.get('components.restartable').contains(this.get('content.componentName'));
  }.property('content'),

  /**
   * Host component with some <code>workStatus</code> can't be restarted (so, disable such action in the dropdown list)
   * @type {bool}
   */
  isRestartComponentDisabled: function() {
    return ![App.HostComponentStatus.started].contains(this.get('workStatus'));
  }.property('workStatus'),

  /**
   * Check if component configs can be refreshed
   * @type {bool}
   */
  isRefreshConfigsAllowed: function() {
    return App.get('components.refreshConfigsAllowed').contains(this.get('content.componentName'));
  }.property('content'),

  didInsertElement: function () {
    App.tooltip($('[rel=componentHealthTooltip]'));
    App.tooltip($('[rel=passiveTooltip]'));
    if (this.get('isInProgress')) {
      this.doBlinking();
    }
  },

  /**
   * Do blinking for 1 minute
   */
  doBlinking: function () {
    var workStatus = this.get('workStatus');
    var self = this;
    var pulsate = [ App.HostComponentStatus.starting, App.HostComponentStatus.stopping, App.HostComponentStatus.installing].contains(workStatus);
    if (pulsate && !self.get('isBlinking')) {
      self.set('isBlinking', true);
      uiEffects.pulsate(self.$('.components-health'), 1000, function () {
        self.set('isBlinking', false);
        self.doBlinking();
      });
    }
  },

  /**
   * Start blinking when host component is starting/stopping
   */
  startBlinking: function () {
    this.$('.components-health').stop(true, true);
    this.$('.components-health').css({opacity: 1.0});
    this.doBlinking();
  }.observes('workStatus'),

  /**
   * Get custom commands for slave components
   */
  customCommands: function() {
    var hostComponent = this.get('content');
    var component = App.StackServiceComponent.find(hostComponent.get('componentName'));
    var customCommands = [];
    var commands;

    if (component.get('isSlave')) {
      commands = component.get('customCommands');
      commands.forEach(function(command) {
        customCommands.push({
          label: Em.I18n.t('services.service.actions.run.executeCustomCommand.menu').format(command),
          service: component.get('serviceName'),
          hosts: hostComponent.get('hostName'),
          component: component.get('componentName'),
          command: command
        });
      });
    }

    return customCommands;
  }.property('content')

});
