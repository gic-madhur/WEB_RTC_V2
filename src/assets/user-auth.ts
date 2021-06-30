import { Unity4Claim } from './unity4-claim.enum';

export interface UserAuth {
  userId: number;
  first: string;
  last: string;
  sessionId: string;
  claims: Unity4Claim[];
}
