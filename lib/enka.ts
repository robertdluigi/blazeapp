import { EnkaClient } from 'enka-network-api';

import path from 'path';

const cacheDir = path.join(process.cwd(), 'cache', 'enka');

const enka = new EnkaClient({ defaultLanguage: "en"});
enka.cachedAssetsManager.cacheDirectoryPath = "./cache";
enka.cachedAssetsManager.cacheDirectorySetup();
enka.cachedAssetsManager.fetchAllContents(); // returns promise

export default enka;