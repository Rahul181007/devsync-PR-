export interface UpdateCompanyLogoFromSettingsDTO {
  userId: string;
  file: {
    buffer: Buffer;
    mimetype: string;
  };
}