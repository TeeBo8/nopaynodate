import { UTApi } from "uploadthing/server";

// Supprime chez Uploadthing les fichiers correspondant à des adresses de photos.
// Une adresse a la forme https://utfs.io/f/<clé> ou https://<app>.ufs.sh/f/<clé>.
export async function deleteUploadedPhotos(urls: string[]): Promise<void> {
  const keys = urls
    .map((url) => {
      try {
        return new URL(url).pathname.split("/f/")[1] ?? null;
      } catch {
        return null;
      }
    })
    .filter((key): key is string => !!key);
  if (keys.length === 0) return;

  await new UTApi().deleteFiles(keys);
}
