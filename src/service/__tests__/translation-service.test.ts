import { launch, translation } from "../translation-service";

(async () => {
  await launch();
  console.log("completed launch");
  const all = await Promise.all([
    translation("How should I address you?"),
    translation("How do you know Mr Smith?"),
    translation("May I introduce Mr Peel to you?"),
    translation("This is Sam, who is a friend of mine."),
    translation("I don’t think we’ve been properly introduced. I am Ken."),
    translation("What do you do for a living?"),
    translation("I work for the XYZ company."),
    translation("What do you do in your spare (free) time?"),
    translation("How are you doing?"),
    translation("Long time no see."),
    translation("Can you help me?"),
    translation("Would you do me a favor?"),
    translation("Could you please drop me at the station?"),
  ]);
  console.log(all);
})();
