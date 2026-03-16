import { ACCOUNT_TYPE } from '../constants/AppConstants';
import { PROSPECT_FIELDS } from '../constants/FormConstants';

import i18n from '../localization/i18n';

import { stringIsEmpty } from './alphaNumericHelper';

export const getDefaultFormValues = (update, segmentList) => {
  return {
    [PROSPECT_FIELDS.BUSINESS_NAME]: '',
    [PROSPECT_FIELDS.CUSTOMER_CODE]: '',
    [PROSPECT_FIELDS.TYPE]: i18n.t('farmProducer'),
    [PROSPECT_FIELDS.COUNTRY]: '',
    [PROSPECT_FIELDS.COUNTRY_NAME]: '',
    [PROSPECT_FIELDS.COUNTRY_CODE]: '',
    [PROSPECT_FIELDS.SEGMENT]:
      !update && segmentList && segmentList.length > 0
        ? getDefaultSegment(segmentList)
        : '',
    [PROSPECT_FIELDS.SEGMENT_ID]:
      !update && segmentList && segmentList.length > 0
        ? getDefaultSegment(segmentList)
        : '',
    [PROSPECT_FIELDS.ADDRESS]: '',
    [PROSPECT_FIELDS.CITY]: '',
    /**
     * @description
     * changing state to be null because of lift integration
     * @todo
     * needs to verify is form is not working correctly
     */
    [PROSPECT_FIELDS.STATE]: null,
    [PROSPECT_FIELDS.STATE_ID]: null,
    [PROSPECT_FIELDS.POSTAL]: '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_FIRST_NAME]: '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_LAST_NAME]: '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_EMAIL]: '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_PHONE]: '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_ID]: '',
  };
};

export const createAddProspectObject = (values, userImage, currentAuthUser) => {
  return {
    accountType: ACCOUNT_TYPE.PROSPECT,
    businessName: values[PROSPECT_FIELDS.BUSINESS_NAME],
    contacts: JSON.stringify([
      {
        firstName: values[PROSPECT_FIELDS.PRIMARY_CONTACT_FIRST_NAME],
        lastName: values[PROSPECT_FIELDS.PRIMARY_CONTACT_LAST_NAME],
        email: values[PROSPECT_FIELDS.PRIMARY_CONTACT_EMAIL],
        phoneNumber: values[PROSPECT_FIELDS.PRIMARY_CONTACT_PHONE],
      },
    ]),
    country: values[PROSPECT_FIELDS.COUNTRY_NAME],
    customerCode: values[PROSPECT_FIELDS.CUSTOMER_CODE],
    favourite: false,
    imageToUploadBase64: userImage ? userImage.data : null,
    photoId: null,
    city: values[PROSPECT_FIELDS.CITY],
    postalCode: values[PROSPECT_FIELDS.POSTAL],
    // state: values[PROSPECT_FIELDS.STATE],
    state: !stringIsEmpty(values[PROSPECT_FIELDS.STATE])
      ? values[PROSPECT_FIELDS.STATE]
      : null,
    street: values[PROSPECT_FIELDS.ADDRESS],
    segmentId: values[PROSPECT_FIELDS.SEGMENT_ID] || '',
    type: ACCOUNT_TYPE.PROSPECT_TYPE_FARM_PRODUCER,
    accessIdentifier: currentAuthUser?.email || null,
  };
};

export const createUpdateProspectCustomerObject = (
  values,
  userImage,
  currentAuthUser,
) => {
  return {
    businessName: values[PROSPECT_FIELDS.BUSINESS_NAME],
    contacts: JSON.stringify([
      {
        firstName: values[PROSPECT_FIELDS.PRIMARY_CONTACT_FIRST_NAME],
        lastName: values[PROSPECT_FIELDS.PRIMARY_CONTACT_LAST_NAME],
        email: values[PROSPECT_FIELDS.PRIMARY_CONTACT_EMAIL],
        phoneNumber: values[PROSPECT_FIELDS.PRIMARY_CONTACT_PHONE],
        contactId: values[PROSPECT_FIELDS.PRIMARY_CONTACT_ID],
      },
    ]),
    country: values[PROSPECT_FIELDS.COUNTRY_NAME],
    customerCode: values[PROSPECT_FIELDS.CUSTOMER_CODE],
    imageToUploadBase64: userImage ? userImage.data : null,
    city: values[PROSPECT_FIELDS.CITY],
    postalCode: values[PROSPECT_FIELDS.POSTAL],
    // state: values[PROSPECT_FIELDS.STATE],
    state: !stringIsEmpty(values[PROSPECT_FIELDS.STATE])
      ? values[PROSPECT_FIELDS.STATE]
      : null,
    street: values[PROSPECT_FIELDS.ADDRESS],
    segmentId: values[PROSPECT_FIELDS.SEGMENT_ID] || '',
    type: ACCOUNT_TYPE.PROSPECT_TYPE_FARM_PRODUCER,
    updated: true,
    accessIdentifier: currentAuthUser?.email || null,
  };
};

const getCountryIdByName = (countryName, countryList) => {
  const filteredCountries = countryList.filter(
    country => country.name === countryName,
  );
  if (filteredCountries && filteredCountries.length > 0) {
    return filteredCountries[0].id;
  }
};

const getStateIdByName = (stateName, stateList) => {
  const filteredStates = stateList.filter(
    stateObj => stateObj.stateKey === stateName,
  );

  if (filteredStates && filteredStates.length > 0) {
    return filteredStates[0].id;
  }
};

const getSegmentNameById = (segmentId, segmentList) => {
  const filteredSegments = segmentList.filter(
    // segment => segment.sv_id == segmentId,
    segment => segment.name == segmentId,
  );
  if (filteredSegments && filteredSegments.length > 0) {
    // return filteredSegments[0].id;
    return filteredSegments[0].name;
  }
};

export const createInitialCustomerProspectFormValues = (
  data,
  countryList,
  segmentList,
  stateList,
) => {
  let primaryContact = {};
  if (!stringIsEmpty(data.contacts)) {
    const primaryContactsArray = JSON.parse(data.contacts);
    if (
      primaryContactsArray &&
      Array.isArray(primaryContactsArray) &&
      primaryContactsArray.length > 0
    ) {
      primaryContact = primaryContactsArray[0];
    }
  }

  let selectedCountry = null;
  if (!stringIsEmpty(data?.country)) {
    selectedCountry = countryList?.find(
      item => item?.countryKey === data?.country,
    );
  }

  const defaultSegment = getDefaultSegment(segmentList);

  const obj = {
    [PROSPECT_FIELDS.BUSINESS_NAME]: data.businessName,
    [PROSPECT_FIELDS.CUSTOMER_CODE]: data.customerCode,
    [PROSPECT_FIELDS.TYPE]: i18n.t('farmProducer'),
    [PROSPECT_FIELDS.COUNTRY]: selectedCountry?.id || '',
    [PROSPECT_FIELDS.COUNTRY_NAME]: data.country,
    [PROSPECT_FIELDS.SEGMENT]: !!data.segmentId
      ? getSegmentNameById(data.segmentId, segmentList)
      : defaultSegment,
    [PROSPECT_FIELDS.SEGMENT_ID]: data.segmentId,
    [PROSPECT_FIELDS.ADDRESS]: data.street,
    [PROSPECT_FIELDS.CITY]: data.city,
    [PROSPECT_FIELDS.STATE]: data.state,
    [PROSPECT_FIELDS.STATE_ID]: getStateIdByName(data.state, stateList) || null,
    [PROSPECT_FIELDS.POSTAL]: data.postalCode,
    [PROSPECT_FIELDS.PRIMARY_CONTACT_FIRST_NAME]:
      primaryContact?.firstName || '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_LAST_NAME]: primaryContact?.lastName || '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_EMAIL]: primaryContact?.email || '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_PHONE]: primaryContact?.phoneNumber || '',
    [PROSPECT_FIELDS.PRIMARY_CONTACT_ID]: primaryContact?.contactId || '',
    [PROSPECT_FIELDS.COUNTRY_CODE]: selectedCountry?.countryCode || '',
  };
  return obj;
};

const getDefaultSegment = segmentList => {
  const filteredSegmentList = segmentList.filter(
    segment => segment.defaultValue,
  );
  if (filteredSegmentList && filteredSegmentList.length > 0) {
    // return filteredSegmentList[0].sv_id;
    return filteredSegmentList[0].name;
  }
  return '';
};
