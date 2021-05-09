import { launch, translation } from "../translation-service";

(async () => {
  await launch();
  await translation();
})();
