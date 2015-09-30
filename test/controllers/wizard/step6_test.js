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

var Ember = require('ember');
var App = require('app');
var validationUtils = require('utils/validator');
require('utils/helper');
require('controllers/wizard/step6_controller');
var controller,
  services = [
    Em.Object.create({
      serviceName: 'YARN',
      isSelected: true
    }),
    Em.Object.create({
      serviceName: 'HBASE',
      isSelected: true
    }),
    Em.Object.create({
      serviceName: 'HDFS',
      isSelected: true
    }),
    Em.Object.create({
      serviceName: 'STORM',
      isSelected: true
    }),
    Em.Object.create({
      serviceName: 'FLUME',
      isSelected: true
    })
  ];
describe('App.WizardStep6Controller', function () {

  beforeEach(function () {
    sinon.stub(console, 'error', Em.K);
    controller = App.WizardStep6Controller.create();
    controller.set('content', Em.Object.create({
      hosts: {},
      masterComponentHosts: {},
      services: services
    }));

    var h = {}, m = [];
    Em.A(['host0', 'host1', 'host2', 'host3']).forEach(function (hostName) {
      var obj = Em.Object.create({
        name: hostName,
        hostName: hostName,
        bootStatus: 'REGISTERED'
      });
      h[hostName] = obj;
      m.push(obj);
    });

    controller.set('content.hosts', h);
    controller.set('content.masterComponentHosts', m);
    controller.set('isMasters', false);

  });

  afterEach(function () {
    console.error.restore();
  });

  describe('#isAddHostWizard', function () {
    it('true if content.controllerName is addHostController', function () {
      controller.set('content.controllerName', 'addHostController');
      expect(controller.get('isAddHostWizard')).to.equal(true);
    });
    it('false if content.controllerName is not addHostController', function () {
      controller.set('content.controllerName', 'mainController');
      expect(controller.get('isAddHostWizard')).to.equal(false);
    });
  });

  describe('#installedServiceNames', function () {
    it(' should filter content.services by isInstalled property', function () {
      var services = Em.A([]);
      services.pushObjects(Em.A([{isInstalled: true, serviceName: "service1"},
                           {isInstalled: false, serviceName: "service2"},
                           {isInstalled: true, serviceName: "service3"},
                           {isInstalled: false, serviceName: "service4"},
                           {isInstalled: true, serviceName: "service5"}]));
      controller.set('content.services', services);
      expect(controller.get('installedServiceNames')).to.eql(["service1", "service3", "service5"]);
    });
  });

  describe('#showValidationIssuesAcceptBox', function () {
    it('should return true if success callback', function () {
      var deffer = jQuery.Deferred();
      function callback() {
        deffer.resolve(true);
      }
      controller.showValidationIssuesAcceptBox(callback);
      jQuery.when(deffer.promise()).then(function(data) {
        expect(data).to.equal(true);    
      }); 
    });
  });

  describe('#selectAllNodes', function () {
    it('should make checkbox checked', function () {
      var hostsObj = Em.A([Em.Object.create({
        hasMaster: false,
        isInstalled: false,
        checkboxes: Em.A([
          Em.Object.create({
            title: 'l1',
            component: 'name',
            isInstalled: false,
            checked: false
          })
        ])
      })]);
      var obj = Em.Object.create({
        context: {
          name: "name"
        }
      });
      var clientComponents = Em.A([{component_name: "name1"}]);
      controller.set('hosts', hostsObj);
      controller.set('content.clients', clientComponents);
      controller.selectAllNodes(obj);
      expect(controller.get('hosts')).to.eql(Em.A([Em.Object.create({
        hasMaster: false,
        isInstalled: false,
        checkboxes: Em.A([
          Em.Object.create({
            title: 'l1',
            component: 'name',
            isInstalled: false,
            checked: true
          })
        ])
      })]));
    });
  });

  describe('#deselectAllNodes', function () {
    it('should uncheck checkbox', function () {
      var hostsObj = Em.A([Em.Object.create({
        hasMaster: false,
        isInstalled: false,
        checkboxes: Em.A([
          Em.Object.create({
            title: 'l1',
            component: 'name',
            isInstalled: false,
            checked: true
          })
        ])
      })]);
      var obj = Em.Object.create({
        context: {
          name: "name"
        }
      });
      var clientComponents = Em.A([{component_name: "name1"}]);
      controller.set('hosts', hostsObj);
      controller.set('content.clients', clientComponents);
      controller.deselectAllNodes(obj);
      expect(controller.get('hosts')).to.eql(Em.A([Em.Object.create({
        hasMaster: false,
        isInstalled: false,
        checkboxes: Em.A([
          Em.Object.create({
            title: 'l1',
            component: 'name',
            isInstalled: false,
            checked: false
          })
        ])
      })]));
    });
  });

  describe('#renderSlaves', function () {
    it('should change false checkboxes state to true', function () {
      var hostsObj = Em.A([Em.Object.create({
        hasMaster: false,
        isInstalled: false,
        checkboxes: Em.A([
          Em.Object.create({
            title: 'l1',
            component: 'c1',
            isInstalled: false,
            checked: false
          })
        ])
      })]);
      var slaveComponentHosts = Em.A([{componentName: "c1", hosts: hostsObj,isInstalled: false}]);
      controller.set('content.slaveComponentHosts', slaveComponentHosts);
      var headers = Em.A([
        Em.Object.create({name: "c1", label: 'l1', isDisabled: true}),
        Em.Object.create({name: "c2", label: 'l2', isDisabled: false})
      ]);
      controller.set('headers', headers);
      controller.renderSlaves(hostsObj);
      expect(slaveComponentHosts[0].hosts[0].checkboxes[0].checked).to.equal(true);
    });
  });

  describe('#anyGeneralErrors', function () {
    beforeEach(function () {
      controller.set('errorMessage', undefined);
    });
    it('should return errorMessage', function () {
      controller.set('errorMessage', "error 404");
      expect(controller.get('anyGeneralErrors')).to.equal("error 404");
    });
    it('true if generalErrorMessages is non empty array and errorMessage is undefined', function () {
      controller.set('generalErrorMessages', ["error1", "error2"]);
      expect(controller.get('anyGeneralErrors')).to.equal(true);
    });
    it('false if generalErrorMessages is empty array and errorMessage is undefined', function () {
      controller.set('generalErrorMessages', []);
      expect(controller.get('anyGeneralErrors')).to.equal(false);
    });
    it('undefined if generalErrorMessages is undefined and errorMessage is undefined', function () {
      controller.set('generalErrorMessages', undefined);
      expect(controller.get('anyGeneralErrors')).to.equal(undefined);
    });
  });

  describe('#render', function () {
    it('true if loaded', function () {
      var hosts = {
          h1: {bootStatus: 'REGISTERED', name: 'h1'},
          h2: {bootStatus: 'REGISTERED', name: 'h2'},
          h3: {bootStatus: 'REGISTERED', name: 'h3'}
      };
      var headers = Em.A([
        Em.Object.create({name: "c1", label: 'l1', isDisabled: true}),
        Em.Object.create({name: "c2", label: 'l2', isDisabled: false})
      ]);
      var masterComponentHosts = Em.A([
        {hostName: 'h1', component: 'c1'}
      ]);
      var recommendations = {
        blueprint: {
          host_groups: [
            {
              components: [
                {
                  name: 'c6'
                }
              ],
              name: 'host-group-1'
            },
            {
              components: [
                {
                  name: 'c8'
                }
              ],
              name: 'host-group-2'
            }
          ]
        },
        blueprint_cluster_binding: {
          host_groups: [
            {
              hosts: [
                {
                  fqdn: 'h0'
                }
              ],
              name: 'host-group-1'
            },
            {
              hosts: [
                {
                  fqdn: 'h1'
                }
              ],
              name: 'host-group-2'
            }]
        }
      };
      controller.set('content.hosts', hosts);
      controller.set('content.masterComponentHosts', masterComponentHosts);
      controller.set('content.recommendations', recommendations);
      controller.set('headers', headers);
      controller.render();
      expect(controller.get('isLoaded')).to.equal(true);
    });
  });

  describe('#anyGeneralWarnings', function () {
    it('true if generalWarningMessages is non empty array and warningMessage is undefined', function () {
      controller.set('generalWarningMessages', ["warning1", "warning2"]);
      expect(controller.get('anyGeneralWarnings')).to.equal(true);
    });
    it('false if generalWarningMessages is empty array', function () {
      controller.set('generalWarningMessages', []);
      expect(controller.get('anyGeneralWarnings')).to.equal(false);
    });
    it('undefined if generalWarningMessages is undefined', function () {
      controller.set('generalWarningMessages', undefined);
      expect(controller.get('anyGeneralWarnings')).to.equal(undefined);
    });
  });

  describe('#anyGeneralIssues', function () {
    it('should return error message if errorMessage', function () {
      controller.set('errorMessage', "error 404");
      expect(controller.get('anyGeneralIssues')).to.equal("error 404");
    });
    it('should return true if we have several errors', function () {
      controller.set('generalErrorMessages', ["error 404", "error"]);
      expect(controller.get('anyGeneralIssues')).to.equal(true);
    });
    it('should return true if we have several warnings', function () {
      controller.set('generalWarningMessages', ["error 404", "error"]);
      expect(controller.get('anyGeneralIssues')).to.equal(true);
    });
  });

  describe('#anyErrors', function () {
    it('true if generalErrorMessages is non empty', function () {
      controller.set('generalErrorMessages', ["error 404", "error"]);
      expect(controller.get('anyErrors')).to.equal(true);
    });
    it('false if generalErrorMessages is empty', function () {
      controller.set('generalErrorMessages', []);
      expect(controller.get('anyErrors')).to.equal(false);
    });
  });

  describe('#anyWarnings', function () {
    it('true if generalWarningMessages is non empty', function () {
      controller.set('generalWarningMessages', ["error 404", "error"]);
      expect(controller.get('anyWarnings')).to.equal(true);
    });
    it('false if generalWarningMessages is empty', function () {
      controller.set('generalWarningMessages', []);
      expect(controller.get('anyWarnings')).to.equal(false);
    });
  });

  describe('#isInstallerWizard', function () {
    it('true if content.controllerName is addHostController', function () {
      controller.set('content.controllerName', 'installerController');
      expect(controller.get('isInstallerWizard')).to.equal(true);
    });
    it('false if content.controllerName is not addHostController', function () {
      controller.set('content.controllerName', 'mainController');
      expect(controller.get('isInstallerWizard')).to.equal(false);
    });
  });

  describe('#isAddServiceWizard', function () {
    it('true if content.controllerName is addServiceController', function () {
      controller.set('content.controllerName', 'addServiceController');
      expect(controller.get('isAddServiceWizard')).to.equal(true);
    });
    it('false if content.controllerName is not addServiceController', function () {
      controller.set('content.controllerName', 'mainController');
      expect(controller.get('isAddServiceWizard')).to.equal(false);
    });
  });

  describe('#selectClientHost', function () {
    it('true if isClientsSet false', function () {
      var hostsObj = Em.A([Em.Object.create({
        hasMaster: false,
        checkboxes: Em.A([
          Em.Object.create({
            component: 'c1',
            isInstalled: false,
            checked: true
          })
        ])
      })]);
      controller.set('isClientsSet', false);
      controller.selectClientHost(hostsObj);
      expect(controller.get('isClientsSet')).to.equal(true);
    });
  });

  describe('#updateValidationsSuccessCallback', function () {
    beforeEach(function () {
      sinon.stub(validationUtils, 'filterNotInstalledComponents', function () {
        return  Em.A([Em.Object.create({
              componentName: 'c0',
              isSlave: true,
              type: 'host-component',
              level: 'ERROR'
            }),
            Em.Object.create({
              componentName: 'c1',
              isSlave: true,
              type: 'host-component',
              level: 'WARN',
              isShownOnInstallerSlaveClientPage: true
          })]);
      });
      sinon.stub(App.StackServiceComponent, 'find', function () {
          return [
            Em.Object.create({
              componentName: 'c0',
              isSlave: true
            }),
            Em.Object.create({
              componentName: 'c1',
              isSlave: true,
              isShownOnInstallerSlaveClientPage: true
            }),
            Em.Object.create({
              componentName: 'c2',
              isSlave: true,
              isShownOnInstallerSlaveClientPage: false
            }),
            Em.Object.create({
              componentName: 'c3',
              isClient: true
            }),
            Em.Object.create({
              componentName: 'c4',
              isClient: true,
              isRequiredOnAllHosts: false
            }),
            Em.Object.create({
              componentName: 'c5',
              isClient: true,
              isRequiredOnAllHosts: true
            }),
            Em.Object.create({
              componentName: 'c6',
              isMaster: true,
              isShownOnInstallerAssignMasterPage: true
            }),
            Em.Object.create({
              componentName: 'c7',
              isMaster: true,
              isShownOnInstallerAssignMasterPage: false
            }),
            Em.Object.create({
              componentName: 'HDFS_CLIENT',
              isMaster: true,
              isShownOnAddServiceAssignMasterPage: true
            }),
            Em.Object.create({
              componentName: 'c9',
              isMaster: true,
              isShownOnAddServiceAssignMasterPage: false
            })
          ];
        });
    });
    afterEach(function () {
      App.StackServiceComponent.find.restore();
      validationUtils.filterNotInstalledComponents.restore();
    });
    it('should return modified hosts', function () {
      var hosts = Em.A([Em.Object.create({
        warnMessages: "warn",
        errorMessages: "error",
        anyMessage: true,
        checkboxes: Em.A([Em.Object.create({
          hasWarnMessage: true,
          hasErrorMessage: true
        })])
      })]);
      controller.set('hosts', hosts);
      var validationData = Em.Object.create({
          resources: Em.A([
            Em.Object.create({
              items: Em.A([
                Em.Object.create({
                  "component-name": 'HDFS_CLIENT',
                  host: "1",
                  isMaster: true
                })
              ])
            })
          ])
      });
      controller.updateValidationsSuccessCallback(validationData);
      expect(controller.get('generalErrorMessages').length).to.equal(0);
      expect(controller.get('generalWarningMessages').length).to.equal(0);
      expect(JSON.parse(JSON.stringify(controller.get('hosts')))).to.eql(JSON.parse(JSON.stringify(Em.A([Em.Object.create({
        warnMessages: [null],
        errorMessages: [null],
        anyMessage: true,
        checkboxes: Em.A([Em.Object.create({
          hasWarnMessage: true,
          hasErrorMessage: true
        })])
      })]))));
    });
  });

  describe('#clearError', function () {
    it('true if is one of checkboxes checked false', function () {
      var hosts = Em.A([
        Em.Object.create({
          checkboxes: Em.A([
            Em.Object.create({
              component: 'c1',
              isInstalled: false,
              checked: true
            }),
            Em.Object.create({
              component: 'c2',
              isInstalled: false,
              checked: true
            })])
        })
      ]);
      var headers = Em.A([
        Em.Object.create({name: "c1"}),
        Em.Object.create({name: "c2"})]);
      controller.set('errorMessage', 'error');
      controller.set('hosts', hosts);
      controller.set('headers', headers);
      controller.clearError();
      expect(controller.get('errorMessage')).to.equal('');
    });
    it('true if is one of checkboxes checked false', function () {
      var hosts = Em.A([
        Em.Object.create({
          checkboxes: Em.A([
            Em.Object.create({
              title: "t1",
              component: 'c1',
              isInstalled: false,
              checked: false
            }),
            Em.Object.create({
              title: "t2",
              component: 'c2',
              isInstalled: false,
              checked: true
            })])
        })
      ]);
      var headers = Em.A([
        Em.Object.create({name: "c1", label: 't1'}),
        Em.Object.create({name: "c2", label: 't2'})]);
      controller.set('errorMessage', 'error');
      controller.set('hosts', hosts);
      controller.set('headers', headers);
      controller.set('isAddHostWizard', true);
      controller.clearError();
      expect(controller.get('errorMessage')).to.equal('error');
    });
  });

  describe('#clearStep', function () {
    beforeEach(function () {
      sinon.stub(controller, 'clearError', Em.K);
    });
    afterEach(function () {
      controller.clearError.restore();
    });
    it('should call clearError', function () {
      controller.clearStep();
      expect(controller.clearError.calledOnce).to.equal(true);
    });
    it('should clear hosts', function () {
      controller.set('hosts', [
        {},
        {}
      ]);
      controller.clearStep();
      expect(controller.get('hosts')).to.eql([]);
    });
    it('should clear headers', function () {
      controller.set('headers', [
        {},
        {}
      ]);
      controller.clearStep();
      expect(controller.get('headers')).to.eql([]);
    });
    it('should set isLoaded to false', function () {
      controller.set('isLoaded', true);
      controller.clearStep();
      expect(controller.get('isLoaded')).to.equal(false);
    });
  });

  describe('#checkCallback', function () {
    beforeEach(function () {
      sinon.stub(controller, 'clearError', Em.K);
    });
    afterEach(function () {
      controller.clearError.restore();
    });
    it('should call clearError', function () {
      controller.checkCallback('');
      expect(controller.clearError.calledOnce).to.equal(true);
    });
    Em.A([
        {
          m: 'all checked, isInstalled false',
          headers: Em.A([
            Em.Object.create({name: 'c1'})
          ]),
          hosts: Em.A([
            Em.Object.create({
              checkboxes: Em.A([
                Em.Object.create({
                  component: 'c1',
                  isInstalled: false,
                  checked: true
                })
              ])
            })
          ]),
          component: 'c1',
          e: {
            allChecked: true,
            noChecked: false
          }
        },
        {
          m: 'all checked, isInstalled true',
          headers: Em.A([
            Em.Object.create({name: 'c1'})
          ]),
          hosts: Em.A([
            Em.Object.create({
              checkboxes: Em.A([
                Em.Object.create({
                  component: 'c1',
                  isInstalled: true,
                  checked: true
                })
              ])
            })
          ]),
          component: 'c1',
          e: {
            allChecked: true,
            noChecked: true
          }
        },
        {
          m: 'no one checked',
          headers: Em.A([
            Em.Object.create({name: 'c1'})
          ]),
          hosts: Em.A([
            Em.Object.create({
              checkboxes: Em.A([
                Em.Object.create({
                  component: 'c1',
                  isInstalled: false,
                  checked: false
                })
              ])
            })
          ]),
          component: 'c1',
          e: {
            allChecked: false,
            noChecked: true
          }
        },
        {
          m: 'some checked',
          headers: Em.A([
            Em.Object.create({name: 'c1'})
          ]),
          hosts: Em.A([
            Em.Object.create({
              checkboxes: Em.A([
                Em.Object.create({
                  component: 'c1',
                  isInstalled: false,
                  checked: true
                }),
                Em.Object.create({
                  component: 'c1',
                  isInstalled: false,
                  checked: false
                })
              ])
            })
          ]),
          component: 'c1',
          e: {
            allChecked: false,
            noChecked: false
          }
        },
        {
          m: 'some checked, some isInstalled true',
          headers: Em.A([
            Em.Object.create({name: 'c1'})
          ]),
          hosts: Em.A([
            Em.Object.create({
              checkboxes: Em.A([
                Em.Object.create({
                  component: 'c1',
                  isInstalled: true,
                  checked: true
                }),
                Em.Object.create({
                  component: 'c1',
                  isInstalled: true,
                  checked: true
                })
              ])
            })
          ]),
          component: 'c1',
          e: {
            allChecked: true,
            noChecked: true
          }
        },
        {
          m: 'some checked, some isInstalled true (2)',
          headers: Em.A([
            Em.Object.create({name: 'c1'})
          ]),
          hosts: Em.A([
            Em.Object.create({
              checkboxes: Em.A([
                Em.Object.create({
                  component: 'c1',
                  isInstalled: false,
                  checked: false
                }),
                Em.Object.create({
                  component: 'c1',
                  isInstalled: true,
                  checked: true
                })
              ])
            })
          ]),
          component: 'c1',
          e: {
            allChecked: false,
            noChecked: true
          }
        }
      ]).forEach(function (test) {
        it(test.m, function () {
          controller.clearStep();
          controller.set('headers', test.headers);
          controller.set('hosts', test.hosts);
          controller.checkCallback(test.component);
          var header = controller.get('headers').findProperty('name', test.component);
          expect(header.get('allChecked')).to.equal(test.e.allChecked);
          expect(header.get('noChecked')).to.equal(test.e.noChecked);
        });
      });
  });

  describe('#getHostNames', function () {
    var tests = Em.A([
      {
        hosts: {
          h1: {bootStatus: 'REGISTERED', name: 'h1'},
          h2: {bootStatus: 'REGISTERED', name: 'h2'},
          h3: {bootStatus: 'REGISTERED', name: 'h3'}
        },
        m: 'All REGISTERED',
        e: ['h1', 'h2', 'h3']
      },
      {
        hosts: {
          h1: {bootStatus: 'REGISTERED', name: 'h1'},
          h2: {bootStatus: 'FAILED', name: 'h2'},
          h3: {bootStatus: 'REGISTERED', name: 'h3'}
        },
        m: 'Some REGISTERED',
        e: ['h1', 'h3']
      },
      {
        hosts: {
          h1: {bootStatus: 'FAILED', name: 'h1'},
          h2: {bootStatus: 'FAILED', name: 'h2'},
          h3: {bootStatus: 'FAILED', name: 'h3'}
        },
        m: 'No one REGISTERED',
        e: []
      },
      {
        hosts: {},
        m: 'Empty hosts',
        e: []
      }
    ]);
    tests.forEach(function (test) {
      it(test.m, function () {
        controller.set('content.hosts', test.hosts);
        var r = controller.getHostNames();
        expect(r).to.eql(test.e);
      });
    });
  });

  describe('#getMasterComponentsForHost', function () {
    var tests = Em.A([
      {
        masterComponentHosts: Em.A([
          {hostName: 'h1', component: 'c1'}
        ]),
        hostName: 'h1',
        m: 'host exists',
        e: ['c1']
      },
      {
        masterComponentHosts: Em.A([
          {hostName: 'h1', component: 'c1'}
        ]),
        hostName: 'h2',
        m: 'host donesn\'t exists',
        e: []
      }
    ]);
    tests.forEach(function (test) {
      it(test.m, function () {
        controller.set('content.masterComponentHosts', test.masterComponentHosts);
        var r = controller.getMasterComponentsForHost(test.hostName);
        expect(r).to.eql(test.e);
      });
    });
  });

  describe('#selectMasterComponents', function () {
    var tests = Em.A([
      {
        masterComponentHosts: Em.A([
          {
            hostName: 'h1',
            component: 'c1'
          }
        ]),
        hostsObj: [
          Em.Object.create({
            hostName: 'h1',
            checkboxes: [
              Em.Object.create({
                component: 'c1',
                checked: false
              })
            ]
          })
        ],
        e: true,
        m: 'host and component exist'
      },
      {
        masterComponentHosts: Em.A([
          {
            hostName: 'h1',
            component: 'c2'
          }
        ]),
        hostsObj: [
          Em.Object.create({
            hostName: 'h1',
            checkboxes: [
              Em.Object.create({
                component: 'c1',
                checked: false
              })
            ]
          })
        ],
        e: false,
        m: 'host exists'
      },
      {
        masterComponentHosts: Em.A([
          {
            hostName: 'h2',
            component: 'c2'
          }
        ]),
        hostsObj: [
          Em.Object.create({
            hostName: 'h1',
            checkboxes: [
              Em.Object.create({
                component: 'c1',
                checked: false
              })
            ]
          })
        ],
        e: false,
        m: 'host and component don\'t exist'
      }
    ]);
    tests.forEach(function (test) {
      it(test.m, function () {
        controller.set('content.masterComponentHosts', test.masterComponentHosts);
        var r = controller.selectMasterComponents(test.hostsObj);
        expect(r.findProperty('hostName', 'h1').get('checkboxes').findProperty('component', 'c1').get('checked')).to.equal(test.e);
      });
    });
  });

  describe('#getCurrentMastersBlueprint', function () {
    var tests = Em.A([
      {
        masterComponentHosts: Em.A([
          {hostName: 'h1', component: 'c1'}
        ]),
        hosts: {'h1': {}},
        m: 'one host and one component',
        e:{
          blueprint: {
            host_groups: [
              {
                name: 'host-group-1',
                components: [
                  { name: 'c1' }
                ]
              }
            ]
          },
          blueprint_cluster_binding: {
            host_groups: [
              {
                name: 'host-group-1',
                hosts: [
                  { fqdn: 'h1' }
                ]
              }
            ]
          }
        }
      },
      {
        masterComponentHosts: Em.A([
          {hostName: 'h1', component: 'c1'},
          {hostName: 'h2', component: 'c2'},
          {hostName: 'h2', component: 'c3'}
        ]),
        hosts: {'h1': {}, 'h2': {}, 'h3': {}},
        m: 'multiple hosts and multiple components',
        e: {
          blueprint: {
            host_groups: [
              {
                name: 'host-group-1',
                components: [
                  { name: 'c1' }
                ]
              },
              {
                name: 'host-group-2',
                components: [
                  { name: 'c2' },
                  { name: 'c3' }
                ]
              },
              {
                name: 'host-group-3',
                components: []
              }
            ]
          },
          blueprint_cluster_binding: {
            host_groups: [
              {
                name: 'host-group-1',
                hosts: [
                  { fqdn: 'h1' }
                ]
              },
              {
                name: 'host-group-2',
                hosts: [
                  { fqdn: 'h2' }
                ]
              },
              {
                name: 'host-group-3',
                hosts: [
                  { fqdn: 'h3' }
                ]
              }
            ]
          }
        }
      }
    ]);
    tests.forEach(function (test) {
      it(test.m, function () {
        controller.set('content.masterComponentHosts', test.masterComponentHosts);
        controller.set('content.hosts', test.hosts);
        var r = controller.getCurrentMastersBlueprint();
        expect(r).to.eql(test.e);
      });
    });
  });

describe('#getCurrentBlueprint', function () {
    var tests = Em.A([
      {
        clientComponents: Em.A([{component_name: "name1"}]),
        hosts: Em.A([
          Em.Object.create({
            checkboxes: Em.A([
              Em.Object.create({
                component: 'c1',
                checked: true
              }),
              Em.Object.create({
                component: 'CLIENT',
                checked: true
              })
            ])
          })
        ]),
        m: 'one host and one component',
        e:{
          blueprint: {
            host_groups: [
              {
                name: 'host-group-1',
                components: [
                  { name: 'c1' },
                  { name: 'name1' }
                ]
              }
            ]
          },
          blueprint_cluster_binding: {
            host_groups: [
              {
                name: 'host-group-1',
                hosts: [
                  {}
                ]
              }
            ]
          }
        }
      }
    ]);
    tests.forEach(function (test) {
      it(test.m, function () {
        controller.set('content.clients', test.clientComponents);
        controller.set('hosts', test.hosts);
        var r = controller.getCurrentBlueprint();
        expect(JSON.parse(JSON.stringify(r))).to.eql(JSON.parse(JSON.stringify(test.e)));
      });
    });
  });

  describe('#callServerSideValidation', function () {

    var cases = [
        {
          controllerName: 'installerController',
          hosts: [
            {
              hostName: 'h0'
            },
            {
              hostName: 'h1'
            }
          ],
          expected: [
            ['c0', 'c6'],
            ['c1', 'c3', 'c8']
          ]
        },
        {
          controllerName: 'addServiceController',
          hosts: [
            {
              hostName: 'h0'
            },
            {
              hostName: 'h1'
            }
          ],
          expected: [
            ['c0', 'c6'],
            ['c1', 'c3', 'c8']
          ]
        },
        {
          controllerName: 'addHostController',
          hosts: [
            {
              hostName: 'h0'
            }
          ],
          expected: [
            ['c0', 'c2', 'c5', 'c6'],
            ['c1', 'c2', 'c3', 'c5', 'c8']
          ]
        }
      ],
      expectedHostGroups = [
        {
          name: 'host-group-1',
          fqdn: 'h0'
        },
        {
          name: 'host-group-2',
          fqdn: 'h1'
        }
      ];

    beforeEach(function () {
      controller.get('content').setProperties({
        recommendations: {
          blueprint: {
            host_groups: [
              {
                components: [
                  {
                    name: 'c6'
                  }
                ],
                name: 'host-group-1'
              },
              {
                components: [
                  {
                    name: 'c8'
                  }
                ],
                name: 'host-group-2'
              }
            ]
          },
          blueprint_cluster_binding: {
            host_groups: [
              {
                hosts: [
                  {
                    fqdn: 'h0'
                  }
                ],
                name: 'host-group-1'
              },
              {
                hosts: [
                  {
                    fqdn: 'h1'
                  }
                ],
                name: 'host-group-2'
              }]
          }
        },
        clients: [
          {
            component_name: 'c3'
          }
        ]
      });
      sinon.stub(App.StackService, 'find', function () {
        return [
          Em.Object.create({
            serviceName: 's0',
            isSelected: true
          }),
          Em.Object.create({
            serviceName: 's1',
            isInstalled: true,
            isSelected: true
          })
        ];
      });
      sinon.stub(App.StackServiceComponent, 'find', function () {
        return [
          Em.Object.create({
            componentName: 'c0',
            isSlave: true
          }),
          Em.Object.create({
            componentName: 'c1',
            isSlave: true,
            isShownOnInstallerSlaveClientPage: true
          }),
          Em.Object.create({
            componentName: 'c2',
            isSlave: true,
            isShownOnInstallerSlaveClientPage: false
          }),
          Em.Object.create({
            componentName: 'c3',
            isClient: true
          }),
          Em.Object.create({
            componentName: 'c4',
            isClient: true,
            isRequiredOnAllHosts: false
          }),
          Em.Object.create({
            componentName: 'c5',
            isClient: true,
            isRequiredOnAllHosts: true
          }),
          Em.Object.create({
            componentName: 'c6',
            isMaster: true,
            isShownOnInstallerAssignMasterPage: true
          }),
          Em.Object.create({
            componentName: 'c7',
            isMaster: true,
            isShownOnInstallerAssignMasterPage: false
          }),
          Em.Object.create({
            componentName: 'c8',
            isMaster: true,
            isShownOnAddServiceAssignMasterPage: true
          }),
          Em.Object.create({
            componentName: 'c9',
            isMaster: true,
            isShownOnAddServiceAssignMasterPage: false
          })
        ];
      });
      sinon.stub(controller, 'getCurrentBlueprint', function () {
        return {
          blueprint: {
            host_groups: [
              {
                components: [
                  {
                    name: 'c0'
                  }
                ],
                name: 'host-group-1'
              },
              {
                components: [
                  {
                    name: 'c1'
                  },
                  {
                    name: 'c3'
                  }
                ],
                name: 'host-group-2'
              }
            ]
          },
          blueprint_cluster_binding: {
            host_groups: [
              {
                hosts: [
                  {
                    fqdn: 'h0'
                  }
                ],
                name: 'host-group-1'
              },
              {
                hosts: [
                  {
                    fqdn: 'h1'
                  }
                ],
                name: 'host-group-2'
              }]
          }
        };
      });
      sinon.stub(controller, 'getCurrentMastersBlueprint', function () {
        return {
          blueprint: {
            host_groups: [
              {
                components: [
                  {
                    name: 'c6'
                  }
                ],
                name: 'host-group-1'
              },
              {
                components: [
                  {
                    name: 'c8'
                  }
                ],
                name: 'host-group-2'
              }
            ]
          },
          blueprint_cluster_binding: {
            host_groups: [
              {
                hosts: [
                  {
                    fqdn: 'h0'
                  }
                ],
                name: 'host-group-1'
              },
              {
                hosts: [
                  {
                    fqdn: 'h1'
                  }
                ],
                name: 'host-group-2'
              }]
          }
        };
      });
      sinon.stub(App, 'get').withArgs('components.clients').returns(['c3', 'c4']);
      sinon.stub(controller, 'getCurrentMasterSlaveBlueprint', function () {
        return {
          blueprint: {
            host_groups: [
              {
                components: [
                  {
                    name: 'c6'
                  }
                ],
                name: 'host-group-1'
              },
              {
                components: [
                  {
                    name: 'c8'
                  }
                ],
                name: 'host-group-2'
              }
            ]
          },
          blueprint_cluster_binding: {
            host_groups: [
              {
                hosts: [
                  {
                    fqdn: 'h0'
                  }
                ],
                name: 'host-group-1'
              },
              {
                hosts: [
                  {
                    fqdn: 'h1'
                  }
                ],
                name: 'host-group-2'
              }]
          }
        };
      });
      sinon.stub(App.Host, 'find', function () {
        return [
          {
            hostName: 'h1'
          }
        ];
      });
      sinon.stub(App.ajax, 'send', function () {
        return {
          then: Em.K
        };
      });
    });

    afterEach(function () {
      App.StackService.find.restore();
      App.StackServiceComponent.find.restore();
      controller.getCurrentBlueprint.restore();
      controller.getCurrentMastersBlueprint.restore();
      App.get.restore();
      controller.getCurrentMasterSlaveBlueprint.restore();
      App.Host.find.restore();
      App.ajax.send.restore();
    });

    cases.forEach(function (item) {
      it(item.controllerName, function () {
        controller.set('hosts', item.hosts);
        controller.set('content.controllerName', item.controllerName);
        controller.callServerSideValidation();
        expect(controller.get('content.recommendationsHostGroups.blueprint.host_groups.length')).to.equal(expectedHostGroups.length);
        expect(controller.get('content.recommendationsHostGroups.blueprint_cluster_binding.host_groups.length')).to.equal(expectedHostGroups.length);
        controller.get('content.recommendationsHostGroups.blueprint.host_groups').forEach(function (group, index) {
          expect(group.components.mapProperty('name').sort()).to.eql(item.expected[index]);
        });
        expectedHostGroups.forEach(function (group) {
          var bpGroup = controller.get('content.recommendationsHostGroups.blueprint_cluster_binding.host_groups').findProperty('name', group.name);
          expect(bpGroup.hosts).to.have.length(1);
          expect(bpGroup.hosts[0].fqdn).to.equal(group.fqdn);
        });
      });
    });

  });

});
