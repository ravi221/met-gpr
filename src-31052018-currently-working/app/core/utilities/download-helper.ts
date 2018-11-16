/**
 * Class used to help with file download related tasks
 */
export class DownloadHelper {
  /**
   * Downloads a file or trigger browser file download given the blob response and the file name.
   */
  public static downloadFile(content: Blob, fileName: string): void {
    if (content != null && window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(content, fileName);
    } else {
      const url = window.URL.createObjectURL(content);
      let downloadLink = document.createElement('a');
      downloadLink.setAttribute('style', 'display: none');
      downloadLink.setAttribute('href', url);
      downloadLink.setAttribute('download', fileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      window.URL.revokeObjectURL(url);
      downloadLink.remove();
    }
  }
}
