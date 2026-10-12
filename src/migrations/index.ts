import * as migration_20261007_113251_initial from './20261007_113251_initial'
import * as migration_20261007_175732_demos from './20261007_175732_demos'

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
]
