export interface Position {
  row: number;
  column: number;
}

export type AstralObject =
  | "SPACE"
  | "POLYANET"
  | "BLUE_SOLOON"
  | "RED_SOLOON"
  | "PURPLE_SOLOON"
  | "WHITE_SOLOON"
  | "UP_COMETH"
  | "DOWN_COMETH"
  | "RIGHT_COMETH"
  | "LEFT_COMETH";

export interface AstralEntity {
  type: "POLYANET" | "SOLOON" | "COMETH";
  position: Position;
}

export interface Polyanet extends AstralEntity {
  type: "POLYANET";
}

export interface Soloon extends AstralEntity {
  type: "SOLOON";
  color: "blue" | "red" | "purple" | "white";
}

export interface Cometh extends AstralEntity {
  type: "COMETH";
  direction: "up" | "down" | "right" | "left";
}

export type MegaverseMap = AstralObject[][];
