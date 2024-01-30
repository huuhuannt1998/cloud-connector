'use strict';

const db = require('./db')
const {SchemaConnector, DeviceErrorTypes} = require('st-schema')

/**
 * ST Schema connector
 */
const connector = new SchemaConnector()
    .enableEventLogging(2)
    .discoveryHandler((accessToken, response) => {
      let d = response.addDevice('external-device-1', 'Switch', '1806bba6-cf8d-42b1-a61f-2c0599498f3a')
      d.manufacturerName('Tutorial');
      d.modelName('Switch');
    })
    .stateRefreshHandler((accessToken, response) => {
      response.addDevice('external-device-1', [
        {
          component: 'main',
          capability: 'st.switch',
          attribute: 'switch',
          value: db.getState('external-device-1').main.switch
        }
      ])
    })
    .commandHandler((accessToken, response, devices) => {
      for (const device of devices) {
        const deviceResponse = response.addDevice(device.externalDeviceId);
        for (const cmd of device.commands) {
          const state = {
            component: cmd.component,
            capability: cmd.capability
          };
          if (cmd.capability === 'st.switch') {
            state.attribute = 'switch';
            state.value = cmd.command === 'on' ? 'on' : 'off';
            deviceResponse.addState(state);
            db.setAttribute(device.externalDeviceId, cmd.component, 'switch', state.value)

          } else {
            deviceResponse.setError(
                `Command '${cmd.command} of capability '${cmd.capability}' not supported`,
                DeviceErrorTypes.CAPABILITY_NOT_SUPPORTED)
          }
        }
      }
    })

module.exports = connector
