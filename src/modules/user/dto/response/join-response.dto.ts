export class JoinResponseDto {
  id: number;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}
