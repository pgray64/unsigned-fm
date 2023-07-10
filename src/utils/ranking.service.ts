import { Injectable } from '@nestjs/common';

const millisecondsInDay = 8.64e7;
const weeklyHotRankingDecayRate = (Math.LN2 * 1) / millisecondsInDay;
@Injectable()
export class RankingService {
  getHotScore(currentScore: number): number {
    const nowMs = Date.now();
    const u = Math.max(currentScore, weeklyHotRankingDecayRate * nowMs);
    const v = Math.min(currentScore, weeklyHotRankingDecayRate * nowMs);
    return u + Math.log1p(Math.exp(v - u));
  }
}
