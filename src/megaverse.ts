import { MegaverseAPI } from "./api";
import {
  MegaverseMap,
  AstralEntity,
  Position,
  Polyanet,
  Soloon,
  Cometh,
  AstralObject,
} from "./types";
import { CONFIG } from "./config";

export class MegaverseCreator {
  private api: MegaverseAPI;

  constructor() {
    this.api = new MegaverseAPI();
  }

  /**
   * Updates the Megaverse to match the goal state.
   */
  async updateMegaverse(): Promise<void> {
    const currentMap = await this.getCurrentMap();
    const goalMap = await this.getGoalMap();
    const { toCreate, toDelete } = this.compareMap(currentMap, goalMap);

    console.log(`Entities to create: ${toCreate.length}`);
    console.log(`Entities to delete: ${toDelete.length}`);

    await this.deleteEntities(toDelete);
    await this.createEntities(toCreate);
  }

  private async getCurrentMap(): Promise<MegaverseMap> {
    const rawMap = await this.api.getCurrentMap();
    return this.parseMap(rawMap);
  }

  private async getGoalMap(): Promise<MegaverseMap> {
    const rawMap = await this.api.getGoalMap();
    return this.parseMap(rawMap);
  }

  private parseMap(rawMap: any): MegaverseMap {
    if (rawMap?.map?.content) {
      return rawMap.map.content;
    } else if (rawMap?.goal) {
      return rawMap.goal;
    } else {
      console.error("Unexpected map format:", rawMap);
      throw new Error("Unexpected map format");
    }
  }

  private compareMap(
    current: MegaverseMap,
    goal: MegaverseMap
  ): { toCreate: AstralEntity[]; toDelete: AstralEntity[] } {
    const toCreate: AstralEntity[] = [];
    const toDelete: AstralEntity[] = [];

    for (let row = 0; row < goal.length; row++) {
      for (let column = 0; column < goal[row].length; column++) {
        const currentEntity = this.parseEntity(current[row]?.[column], {
          row,
          column,
        });
        const goalEntity = this.parseEntity(goal[row][column] as AstralObject, {
          row,
          column,
        });

        if (JSON.stringify(currentEntity) !== JSON.stringify(goalEntity)) {
          if (currentEntity) toDelete.push(currentEntity);
          if (goalEntity) toCreate.push(goalEntity);
        }
      }
    }

    return { toCreate, toDelete };
  }

  private parseEntity(
    cell: AstralObject | any,
    position: Position
  ): AstralEntity | null {
    if (!cell || cell === "SPACE") {
      return null;
    }

    if (typeof cell === "object" && cell.type === 0) {
      return { type: "POLYANET", position };
    }

    if (typeof cell === "string") {
      const [part1, part2] = cell.split("_");

      if (cell === "POLYANET") {
        return { type: "POLYANET", position };
      } else if (part2 === "SOLOON") {
        return {
          type: "SOLOON",
          position,
          color: part1.toLowerCase() as Soloon["color"],
        } as Soloon;
      } else if (part2 === "COMETH") {
        return {
          type: "COMETH",
          position,
          direction: part1.toLowerCase() as Cometh["direction"],
        } as Cometh;
      }
    }

    console.warn(
      `Unknown entity type at (${position.row}, ${position.column}):`,
      cell
    );
    return null;
  }

  private async createEntities(entities: AstralEntity[]): Promise<void> {
    for (const entity of entities) {
      await this.createEntity(entity);
    }
  }

  private async createEntity(entity: AstralEntity): Promise<void> {
    try {
      switch (entity.type) {
        case "POLYANET":
          await this.api.createPolyanet(entity.position);
          break;
        case "SOLOON":
          await this.api.createSoloon(entity as Soloon);
          break;
        case "COMETH":
          await this.api.createCometh(entity as Cometh);
          break;
      }
      console.log(
        `Created ${entity.type} at (${entity.position.row}, ${entity.position.column})`
      );
    } catch (error) {
      console.error(
        `Failed to create ${entity.type} at (${entity.position.row}, ${entity.position.column}):`,
        error
      );
    }
  }

  private async deleteEntities(entities: AstralEntity[]): Promise<void> {
    for (const entity of entities) {
      await this.deleteEntity(entity);
    }
  }

  private async deleteEntity(entity: AstralEntity): Promise<void> {
    if (!entity || !entity.position) {
      console.error("Invalid entity:", entity);
      return;
    }
    try {
      switch (entity.type) {
        case "POLYANET":
          await this.api.deletePolyanet(entity.position);
          break;
        case "SOLOON":
          await this.api.deleteSoloon(entity.position);
          break;
        case "COMETH":
          await this.api.deleteCometh(entity.position);
          break;
      }
      console.log(
        `Deleted ${entity.type} at (${entity.position.row}, ${entity.position.column})`
      );
    } catch (error) {
      console.error(
        `Failed to delete ${entity.type} at (${entity.position.row}, ${entity.position.column}):`,
        error
      );
    }
  }
}
