import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { compoundSlotsRule } from "./compound-slots.js";

const tester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

tester.run("compound-slots", compoundSlotsRule, {
  valid: [
    {
      code: `import { Section } from "@proteus-ui/core";
        <Section>
          <Section.Title>T</Section.Title>
          <Section.Body>B</Section.Body>
        </Section>`,
    },
    {
      code: `import { Section as S } from "@proteus-ui/core";
        <S><S.Title /><S.Body /></S>`,
    },
    {
      code: `import { Section, SectionTitle, SectionBody } from "@proteus-ui/core";
        <Section><SectionTitle /><SectionBody /></Section>`,
    },
    {
      code: `import { Section } from "@proteus-ui/core";
        <Section>{show && <Section.Title />}</Section>`,
    },
    {
      code: `import { CollapsibleSection } from "@proteus-ui/core";
        <CollapsibleSection>
          {item("a")}
          {items.map((x) => (
            <CollapsibleSection.Item id={x}>
              <CollapsibleSection.Title />
              <CollapsibleSection.Panel />
            </CollapsibleSection.Item>
          ))}
        </CollapsibleSection>`,
    },
    {
      code: `<Card><Card.Title /><Card.Body /></Card>`,
    },
  ],
  invalid: [
    {
      code: `<Section><div /></Section>`,
      errors: [{ messageId: "invalidChild" }],
    },
    {
      code: `<Section><Section.Title /><Section.Title /></Section>`,
      errors: [{ messageId: "duplicateSlot" }],
    },
    {
      code: `<Section><Card.Title /></Section>`,
      errors: [{ messageId: "invalidChild" }],
    },
    {
      code: `<Section>hello<Section.Body /></Section>`,
      errors: [{ messageId: "invalidChild" }],
    },
    {
      code: `<Section><></></Section>`,
      errors: [{ messageId: "invalidChild" }],
    },
  ],
});
