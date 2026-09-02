import * as migration_20260902_030342_initial from './20260902_030342_initial';
import * as migration_20260902_034013_content_collections from './20260902_034013_content_collections';
import * as migration_20260902_034435_why_real_numbers_photo from './20260902_034435_why_real_numbers_photo';
import * as migration_20260902_041825_design_tokens from './20260902_041825_design_tokens';
import * as migration_20260902_050727_multi_photo_slideshows from './20260902_050727_multi_photo_slideshows';
import * as migration_20260902_061627_site_design from './20260902_061627_site_design';
import * as migration_20260902_071500_rename_wmd_arrays from './20260902_071500_rename_wmd_arrays';
import * as migration_20260902_081439_add_trash_support from './20260902_081439_add_trash_support';
import * as migration_20260902_081519_add_drafts from './20260902_081519_add_drafts';

export const migrations = [
  {
    up: migration_20260902_030342_initial.up,
    down: migration_20260902_030342_initial.down,
    name: '20260902_030342_initial',
  },
  {
    up: migration_20260902_034013_content_collections.up,
    down: migration_20260902_034013_content_collections.down,
    name: '20260902_034013_content_collections',
  },
  {
    up: migration_20260902_034435_why_real_numbers_photo.up,
    down: migration_20260902_034435_why_real_numbers_photo.down,
    name: '20260902_034435_why_real_numbers_photo',
  },
  {
    up: migration_20260902_041825_design_tokens.up,
    down: migration_20260902_041825_design_tokens.down,
    name: '20260902_041825_design_tokens',
  },
  {
    up: migration_20260902_050727_multi_photo_slideshows.up,
    down: migration_20260902_050727_multi_photo_slideshows.down,
    name: '20260902_050727_multi_photo_slideshows',
  },
  {
    up: migration_20260902_061627_site_design.up,
    down: migration_20260902_061627_site_design.down,
    name: '20260902_061627_site_design',
  },
  {
    up: migration_20260902_071500_rename_wmd_arrays.up,
    down: migration_20260902_071500_rename_wmd_arrays.down,
    name: '20260902_071500_rename_wmd_arrays',
  },
  {
    up: migration_20260902_081439_add_trash_support.up,
    down: migration_20260902_081439_add_trash_support.down,
    name: '20260902_081439_add_trash_support',
  },
  {
    up: migration_20260902_081519_add_drafts.up,
    down: migration_20260902_081519_add_drafts.down,
    name: '20260902_081519_add_drafts'
  },
];
