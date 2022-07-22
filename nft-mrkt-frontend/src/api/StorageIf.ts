export interface StorageIf {
  uploadAsJsonPairs(keys: string[], values: string[]): Promise<string>

  uploadFile(file: File): Promise<string>
}
