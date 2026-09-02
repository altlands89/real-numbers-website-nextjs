import * as migration_20260902_030342_initial from './20260902_030342_initial';
import * as migration_20260902_034013_content_collections from './20260902_034013_content_collections';
import * as migration_20260902_034435_why_real_numbers_photo from './20260902_034435_why_real_numbers_photo';
import * as migration_20260902_041825_design_tokens from './20260902_041825_design_tokens';
import * as migration_20260902_050727_multi_photo_slideshows from './20260902_050727_multi_photo_slideshows';

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
    name: '20260902_050727_multi_photo_slideshows'
  },
];
