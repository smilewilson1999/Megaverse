import axios from "axios";
import { Position, Soloon, Cometh } from "./types";
import { CONFIG } from "./config";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MegaverseAPI {
  private async makeRequest(
    method: "post" | "delete",
    endpoint: string,
    data: any
  ): Promise<void> {
    let retries = 0;

    while (retries < CONFIG.MAX_RETRIES) {
      try {
        if (method === "post") {
          await axios.post(`${CONFIG.API_BASE_URL}/${endpoint}`, {
            ...data,
            candidateId: CONFIG.CANDIDATE_ID,
          });
        } else {
          await axios.delete(`${CONFIG.API_BASE_URL}/${endpoint}`, {
            data: { ...data, candidateId: CONFIG.CANDIDATE_ID },
          });
        }
        return;
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          retries++;
          console.log(`Rate limit hit. Retrying in ${CONFIG.RETRY_DELAY}ms...`);
          await delay(CONFIG.RETRY_DELAY);
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries reached. Unable to complete request.");
  }

  async createPolyanet(position: Position): Promise<void> {
    await this.makeRequest("post", "polyanets", position);
    await delay(500);
  }

  async deletePolyanet(position: Position): Promise<void> {
    await this.makeRequest("delete", "polyanets", position);
    await delay(500);
  }

  async createSoloon(soloon: Soloon): Promise<void> {
    await this.makeRequest("post", "soloons", {
      ...soloon.position,
      color: soloon.color,
    });
    await delay(500);
  }

  async deleteSoloon(position: Position): Promise<void> {
    await this.makeRequest("delete", "soloons", position);
    await delay(500);
  }

  async createCometh(cometh: Cometh): Promise<void> {
    await this.makeRequest("post", "comeths", {
      ...cometh.position,
      direction: cometh.direction,
    });
    await delay(500);
  }

  async deleteCometh(position: Position): Promise<void> {
    await this.makeRequest("delete", "comeths", position);
    await delay(500);
  }

  async getGoalMap(): Promise<any> {
    const response = await axios.get(
      `${CONFIG.API_BASE_URL}/map/${CONFIG.CANDIDATE_ID}/goal`
    );
    return response.data;
  }

  async getCurrentMap(): Promise<any> {
    const response = await axios.get(
      `${CONFIG.API_BASE_URL}/map/${CONFIG.CANDIDATE_ID}`
    );
    return response.data;
  }
}
