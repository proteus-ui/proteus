/** @typedef {{ keys: string[]; memberRoot: string; members: string[]; identifiers: string[]; unique: boolean }} CompoundSpec */

/** @type {CompoundSpec[]} */
export const COMPOUNDS = [
  {
    keys: ["Section"],
    memberRoot: "Section",
    members: ["Title", "Body"],
    identifiers: ["SectionTitle", "SectionBody"],
    unique: true,
  },
  {
    keys: ["Card"],
    memberRoot: "Card",
    members: ["Title", "Body", "Footer"],
    identifiers: ["CardTitle", "CardBody", "CardFooter"],
    unique: true,
  },
  {
    keys: ["LinkCard"],
    memberRoot: "LinkCard",
    members: ["Title", "Body"],
    identifiers: ["LinkCardTitle", "LinkCardBody"],
    unique: true,
  },
  {
    keys: ["PageFrame"],
    memberRoot: "PageFrame",
    members: ["Header", "Main", "Footer"],
    identifiers: ["PageFrameHeader", "PageFrameMain", "PageFrameFooter"],
    unique: true,
  },
  {
    keys: ["Dialog"],
    memberRoot: "Dialog",
    members: ["Title", "Body", "Actions"],
    identifiers: ["DialogTitle", "DialogBody", "DialogActions"],
    unique: true,
  },
  {
    keys: ["Tooltip"],
    memberRoot: "Tooltip",
    members: ["Trigger", "Content"],
    identifiers: ["TooltipTrigger", "TooltipContent"],
    unique: true,
  },
  {
    keys: ["CollapsibleSection"],
    memberRoot: "CollapsibleSection",
    members: ["Item"],
    identifiers: ["CollapsibleItem"],
    unique: false,
  },
  {
    keys: ["CollapsibleSection.Item", "CollapsibleItem"],
    memberRoot: "CollapsibleSection",
    members: ["Title", "Panel"],
    identifiers: ["CollapsibleTitle", "CollapsiblePanel"],
    unique: true,
  },
];

/** @type {Map<string, CompoundSpec>} */
export const COMPOUND_BY_KEY = new Map(COMPOUNDS.flatMap((spec) => spec.keys.map((key) => [key, spec])));
