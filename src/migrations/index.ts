import * as migration_20261007_113251_initial from './20261007_113251_initial'

export const migrations = [
  {
    up: migration_20261007_113251_initial.up,
    down: migration_20261007_113251_initial.down,
    name: '20261007_113251_initial',
  },
]
