type F = string | Blob | File;

export async function readAsDataURL(file: F): Promise<string>;
export async function readAsDataURL(file: F | undefined): Promise<F | undefined>;
export async function readAsDataURL(file: F | undefined): Promise<F | undefined> {
  if (file instanceof Blob) {
    return new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.addEventListener('error', reject);
      fr.addEventListener('load', () => {
        resolve(fr.result as string);
      });
      fr.readAsDataURL(file);
    });
  }
  return file;
}
