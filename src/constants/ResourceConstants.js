const TOOL_TYPE = {
  BODY_CONDITION_SCORE: 'BodyCondition',
  LOCOMOTION_SCORE: 'LocomotionScore',
  METABOLIC_INCIDENCE: 'MetabolicIncidence',
  MILK_SOLD_EVALUATION: 'MilkSoldEvaluation',
  ROBOTIC_MILK_EVALUATION: 'RoboticMilkEvaluation',
  RUMEN_HEALTH_CUD_CHEWING: 'RumenHealth',
  RUMEN_HEALTH_MANURE_SCORE: 'RumenHealthManureScore',
  PILE_AND_BUNKER: 'PileAndBunker',
  RUMEN_FILL: 'RumenFill',
  FORAGE_PENN_STATE: 'ForagePennState',
  FORAGE_AUDIT: 'ForageAuditScorecard',
  MANURE_SCREENER: 'ManureScreener',
  PEN_TIME_BUDGET: 'PenTimeBudget',
  HEAT_STRESS: 'HeatStress',
};

export const RESOURCES = {
  [TOOL_TYPE.BODY_CONDITION_SCORE]: {
    SCORING_GUIDE: 'Body_Condition_Scoring_Guide',
  },
  [TOOL_TYPE.LOCOMOTION_SCORE]: {
    SCORING_GUIDE: 'Locomotion_Scoring_Guide',
  },
  [TOOL_TYPE.METABOLIC_INCIDENCE]: {},
  [TOOL_TYPE.MILK_SOLD_EVALUATION]: {},
  [TOOL_TYPE.ROBOTIC_MILK_EVALUATION]: {},
  [TOOL_TYPE.RUMEN_HEALTH_CUD_CHEWING]: {},
  [TOOL_TYPE.RUMEN_HEALTH_MANURE_SCORE]: {
    SCORING_GUIDE: 'Manure_score_guide',
  },
  [TOOL_TYPE.PILE_AND_BUNKER]: {
    DENSITY_REFERENCE_GUIDE:
      'Pile_and_Bunker_Capacities_Density_Reference_guide',
  },
  [TOOL_TYPE.RUMEN_FILL]: {
    RUMEN_FILL_GUIDE: 'Rumen_Fill',
  },
  [TOOL_TYPE.PEN_TIME_BUDGET]: {},
  [TOOL_TYPE.HEAT_STRESS]: {},
  // as talked with hamza, there is no resources for forage penn state tool
  // [TOOL_TYPE.FORAGE_PENN_STATE]: { SCORING_GUIDE: '' },
  [TOOL_TYPE.FORAGE_AUDIT]: {
    FORAGE_AUDIT_GUIDE: 'Forage_Audit_AdjustingKP',
    FORAGE_AUDIT_BAGGED: 'Forage_Audit_BaggedSilage',
    FORAGE_AUDIT_BALEAGE: 'Forage_Audit_Baleage',
    FORAGE_AUDIT_CORN_SILAGE: 'Forage_Audit_CornSilage',
    FORAGE_AUDIT_CROP_CHARACTERISTICS: 'Forage_Audit_CropCharacteristics',
    FORAGE_AUDIT_CSPS: 'Forage_Audit_CSPSExplanation',
    FORAGE_AUDIT_DECIDING_SILAGE: 'Forage_Audit_DecidingOnASilageStorageType',
    FORAGE_AUDIT_DENSITY_LOSSES: 'Forage_Audit_DensityLosses',
    FORAGE_AUDIT_FAQINNOCULANTS: 'Forage_Audit_FAQInoculants',
    FORAGE_AUDIT_FEED_INVENTORY: 'Forage_Audit_FeedInventory',
    FORAGE_AUDIT_FEED_OUT_LOSS: 'Forage_Audit_FeedoutLossFOF',
    FORAGE_AUDIT_FEED_OUT_RATES: 'Forage_Audit_FeedOutRates',
    FORAGE_AUDIT_FEED_QUALITY: 'Forage_Audit_FeedQuality',
    FORAGE_AUDIT_FERMENTATION_ANALYSIS: 'Forage_Audit_FermentationAnalysis',
    FORAGE_AUDIT_FIELD_KERNEL: 'Forage_Audit_FieldKernel',
    FORAGE_AUDIT_GETTINGTHEMOSTOUTOFSILAGE: 'Forage_Audit_GettingTheMostOutOfSilage',
    FORAGE_AUDIT_KERNEL_PROCESSING: 'Forage_Audit_KernalProcessing',
    FORAGE_AUDIT_MANAGE_SILO_BAGS: 'Forage_Audit_ManageSiloBags',
    FORAGE_AUDIT_MANAGING_TOWER_SILOS: 'Forage_Audit_ManagingTowerSilos',
    FORAGE_AUDIT_MFA_INNOCULANT: 'Forage_Audit_MFAInoculant',
    FORAGE_AUDIT_PREVENT_SILAGE_STORAGE:
      'Forage_Audit_PreventSilageStorageLosses',
    FORAGE_AUDIT_PROCESSING_SCORE: 'Forage_Audit_ProcessingScore',
    FORAGE_AUDIT_SEPARATOR_GUIDELINES: 'Forage_Audit_SeparatorGuidelines',
    FORAGE_AUDIT_SILAGE_ODORS: 'Forage_Audit_SilageOdors',
    FORAGE_AUDIT_SILAGE_PRESERVATION: 'Forage_Audit_SilagePreservation',
    FORAGE_AUDIT_STORING_FORAGE: 'Forage_Audit_StoringForage',
  },
  [TOOL_TYPE.MANURE_SCREENER]: {
    MANURE_SCREENER_GUIDE: 'Manure_Screener',
  },
};
