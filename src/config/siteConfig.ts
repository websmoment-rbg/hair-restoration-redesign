export const siteConfig = {
  clinicName: "[CLINIC_NAME]",
  clinicLogo: "[CLINIC_LOGO]",
  clinicAddress: "[CLINIC_ADDRESS]",
  clinicPhone: "[CLINIC_PHONE]",
  clinicEmail: "[CLINIC_EMAIL]",
  supportEmail: "[SUPPORT_EMAIL]",
  bookingEmail: "[BOOKING_EMAIL]",
  clinicWebsite: "[CLINIC_WEBSITE]",
  websiteUrl: "[WEBSITE_URL]",
  whatsappLink: "[WHATSAPP_DIRECT_LINK]",
  whatsappPrefilledMessage: "[WHATSAPP_PREFILLED_MESSAGE]",
  instagramUrl: "[INSTAGRAM_PROFILE_URL]",
  instagramCtaLink: "[INSTAGRAM_CTA_LINK]",
  assessmentUrl: "[HAIR_ASSESSMENT_URL]",
  reportUrl: "[REPORT_URL]",
  consultationUrl: "[CONSULTATION_URL]",
  bookingUrl: "[BOOKING_URL]",
  googleSheetUrl: "[GOOGLE_SHEET_URL]",
  googleSheetId: "[GOOGLE_SHEET_ID]",
  googleSheetTabName: "[GOOGLE_SHEET_TAB_NAME]",
  googleAppsScriptUrl: "[GOOGLE_APPS_SCRIPT_URL]",
  googleSheetsWebhookUrl: (import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL || "[GOOGLE_SHEETS_WEBHOOK_URL]",
  doctor: {
    name: "[DOCTOR_NAME]",
    designation: "[DOCTOR_DESIGNATION]",
    bio: "[DOCTOR_BIO]",
    credentials: "[DOCTOR_CREDENTIALS]",
    photo: "[DOCTOR_PHOTO]",
    video: "[DOCTOR_VIDEO_URL]",
  },
  testimonials: [
    "[TESTIMONIAL_VIDEO_01]",
    "[TESTIMONIAL_VIDEO_02]",
    "[TESTIMONIAL_VIDEO_03]",
    "[TESTIMONIAL_VIDEO_04]",
    "[TESTIMONIAL_VIDEO_05]",
  ],
  beforeAfter: [
    { before: "[BEFORE_AFTER_CASE_01_BEFORE]", after: "[BEFORE_AFTER_CASE_01_AFTER]" },
    { before: "[BEFORE_AFTER_CASE_02_BEFORE]", after: "[BEFORE_AFTER_CASE_02_AFTER]" },
    { before: "[BEFORE_AFTER_CASE_03_BEFORE]", after: "[BEFORE_AFTER_CASE_03_AFTER]" },
  ],
  procedureMedia: {
    fue: "[FUE_IMAGE_PLACEHOLDER]",
    fut: "[FUT_IMAGE_PLACEHOLDER]",
    bht: "[BHT_IMAGE_PLACEHOLDER]",
    combination: "[COMBINATION_IMAGE_PLACEHOLDER]",
    repair: "[REPAIR_IMAGE_PLACEHOLDER]",
  },
  patientDataRetentionPeriod: "[CONFIGURE]",
};

export const isPlaceholder = (val: string | null | undefined): boolean => {
  if (!val) return true;
  return typeof val === 'string' && val.startsWith('[') && val.endsWith(']');
};
