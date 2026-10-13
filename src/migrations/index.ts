import * as migration_20261007_113251_initial from './20261007_113251_initial'
import * as migration_20261007_175732_demos from './20261007_175732_demos'
import * as migration_20261007_182907_demo_enquiries from './20261007_182907_demo_enquiries'
import * as migration_20261008_051300_demo_settings from './20261008_051300_demo_settings'
import * as migration_20261012_110214_phase7_content from './20261012_110214_phase7_content'
import * as migration_20261013_061105_roles from './20261013_061105_roles'

export const migrations = [
  {
    up: migration_20261007_113251_initial.up,
    down: migration_20261007_113251_initial.down,
    name: '20261007_113251_initial',
  },
  {
    up: migration_20261007_175732_demos.up,
    down: migration_20261007_175732_demos.down,
    name: '20261007_175732_demos',
  },
  {
    up: migration_20261007_182907_demo_enquiries.up,
    down: migration_20261007_182907_demo_enquiries.down,
    name: '20261007_182907_demo_enquiries',
  },
  {
    up: migration_20261008_051300_demo_settings.up,
    down: migration_20261008_051300_demo_settings.down,
    name: '20261008_051300_demo_settings',
  },
  {
    up: migration_20261012_110214_phase7_content.up,
    down: migration_20261012_110214_phase7_content.down,
    name: '20261012_110214_phase7_content',
  },
  {
    up: migration_20261013_061105_roles.up,
    down: migration_20261013_061105_roles.down,
    name: '20261013_061105_roles',
  },
]
