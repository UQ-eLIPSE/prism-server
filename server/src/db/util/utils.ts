import * as fs from "fs/promises";
import * as path from "path";

// This Section is config log files
const parentDir = path.dirname(__dirname);
const linksTestingLogs = `${parentDir}/urlData/links-testing-logs`;
const resourcesLinksLogs = `${linksTestingLogs}/resources_links_logs.csv`;
const headers = "brokenLink,errorMessage,errorCode\n";
// Utility function to write headers to CSV
async function writeCsvHeaders(
  filePath: string,
  headers: string,
): Promise<void> {
  await fs.writeFile(filePath, headers);
}
// LogError
async function logError(errorLog: string, message: string): Promise<void> {
  await fs.appendFile(errorLog, message + "\n");
}

// Maximum Connection Time for Request
const timeOutMillis = 120 * 1000;
async function fetchWithTimeout(input: string): Promise<Response> {
  return (await Promise.race([
    fetch(input, { method: "HEAD" }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out.")), timeOutMillis),
    ),
  ])) as Response;
}

// ValidateURL
export const validateURLResponse = async (input: string) => {
  try {
    const response = await fetchWithTimeout(input);
    const status = response.status;
    const unacceptableErrors = [404];

    if (unacceptableErrors.includes(status)) {
      const errorMessage = `Invalid url - Unexpected status code: "${input}",Status code:${status}`;
      console.error("Invalid url - Unexpected response: ", input);
      await writeCsvHeaders(resourcesLinksLogs, headers);
      await logError(resourcesLinksLogs, errorMessage);
      return false;
    }
    return true;
  } catch (error) {
    const unacceptableErrors = ["ENOTFOUND", "UNABLE_TO_VERIFY_LEAF_SIGNATURE"];
    const isUnacceptableError =
      unacceptableErrors.includes(error.code) ||
      error.message.includes("timed out");
    if (isUnacceptableError) {
      const errorMessage = `Invalid url - Unexpected response: "${input}", Error: ${error.message}`;
      console.error(errorMessage);
      await writeCsvHeaders(resourcesLinksLogs, headers);
      await logError(resourcesLinksLogs, errorMessage);
      return false;
    }
    return true;
  }
};
