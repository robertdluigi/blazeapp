import { GenshinImpact, LanguageEnum } from 'node-hoyolab';

export class GenshinService {
  private static createGenshinInstance(ltokenV2: string, ltuidV2: string) {
    return new GenshinImpact({
      cookie: {
        ltokenV2,
        ltuidV2: parseInt(ltuidV2)
      },
      lang: LanguageEnum.ENGLISH,
    });
  }

  static async getCharacters(ltokenV2: string, ltuidV2: string) {
    const genshin = this.createGenshinInstance(ltokenV2, ltuidV2);
    return await genshin.record.characters();
  }

  static async getSpiralAbyss(ltokenV2: string, ltuidV2: string) {
    const genshin = this.createGenshinInstance(ltokenV2, ltuidV2);
    return await genshin.record.spiralAbyss();
  }

  static async getGameRecord(ltokenV2: string, ltuidV2: string) {
    const genshin = this.createGenshinInstance(ltokenV2, ltuidV2);
    return await genshin.record.records();
  }

  static async getDailyNote(ltokenV2: string, ltuidV2: string) {
    const genshin = this.createGenshinInstance(ltokenV2, ltuidV2);
    return await genshin.record.dailyNote();
  }
}
