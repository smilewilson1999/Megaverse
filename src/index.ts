import { MegaverseCreator } from "./megaverse";

async function main() {
  const creator = new MegaverseCreator();
  try {
    await creator.updateMegaverse();
    console.log("Megaverse updated successfully!");
  } catch (error) {
    console.error("Error updating Megaverse:", error);
    process.exit(1);
  }
}

main();
