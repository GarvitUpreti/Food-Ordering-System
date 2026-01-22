import { SetMetadata } from '@nestjs/common';

export const COUNTRY_ACCESS_KEY = 'countryAccess';
export const RequireCountryAccess = () => SetMetadata(COUNTRY_ACCESS_KEY, true);