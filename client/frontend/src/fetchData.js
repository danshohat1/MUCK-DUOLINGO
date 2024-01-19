import axios from "axios";

let retryCount = 0;
const maxRetries = 10;

async function fetchData() {
  try {
    const response = await axios.post(`http://localhost:8003/languages`, JSON.stringify({
      username: sessionStorage.getItem("username")
    }));
    return response;
  } catch (error) {
    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retry ${retryCount}...`);
      return new Promise((resolve) => {
        setTimeout(() => resolve(fetchData()), 4000); // Wait for 4 seconds before retrying
      });
    } else {
      console.error("Max retries reached. Failed to fetch languages:", error);
      throw error; // Rethrow or handle the error as needed
    }
  }
}

export default fetchData;
