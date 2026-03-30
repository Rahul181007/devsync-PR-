export interface GetProfileResponseDTO {
    name: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    companyLogo?: string | null;
}