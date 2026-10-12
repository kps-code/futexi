import * as migration_20261007_113251_initial from './20261007_113251_initial'
import * as migration_20261007_175732_demos from './20261007_175732_demos'
import * as migration_20261007_182907_demo_enquiries from './20261007_182907_demo_enquiries'

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
]
