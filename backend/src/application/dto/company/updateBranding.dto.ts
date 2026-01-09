export interface UpdateCompanyBrandingInput {
  themeColor?: string;
  logoFile?: Buffer; // comes from multer, NOT from validator
  logoMimeType?: string;
}