import { name as kitName, version as kitVersion } from '../../../../packages/kit/package.json';
import { name as stylesName, version as stylesVersion } from '../../../../packages/styles/package.json';
import { name as inkstoneName, version as inkstoneVersion } from '../../../../packages/inkstone/package.json';

export const documentedPackages = [
  { section: '(kit)', name: kitName, version: kitVersion },
  { section: 'css', name: stylesName, version: stylesVersion },
  { section: 'design', name: inkstoneName, version: inkstoneVersion },
];

export function getDocumentedPackage(path: string) {
  const [section] = path.split('/', 1);
  return documentedPackages.find((pkg) => pkg.section === section);
}
