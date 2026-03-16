import AUTHENTICATION from './authentication';
import DATA_SYNC from './dataSync';
import CUSTOMER from './customer';
import VIEW from './view';
import PROSPECT from './prospect';
import GEOLOCATION from './geolocation';
import SEGMENT from './segment';
import PEN from './pen';
import SITE from './site';
import S3MEDIA from './s3Media';
import ANIMAL_CLASS from './animalClass';
import ENUM from './enum';
import USER_PREFERENCES from './userPreferences';
import NOTIFICATION from './notifications';
import VERSIONING from './versioning';
import ROF from './tools/rof';

let ACTION_CONSTANTS = {
  ...AUTHENTICATION,
  ...DATA_SYNC,
  ...CUSTOMER,
  ...VIEW,
  ...PROSPECT,
  ...GEOLOCATION,
  ...SEGMENT,
  ...PEN,
  ...ANIMAL_CLASS,
  ...ENUM,
  ...SITE,
  ...S3MEDIA,
  ...USER_PREFERENCES,
  ...NOTIFICATION,
  ...VERSIONING,
  ...ROF,
};

export default ACTION_CONSTANTS;
