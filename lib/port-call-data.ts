export const timelineEventTypes = [
  "Pilot on Board",
  "Tugs Connected",
  "First Line",
  "All Fast",
  "Gangway Down",
  "Cargo Operations Started",
  "Cargo Operations Completed",
  "Vessel Ready to Sail",
  "Last Line",
  "Pilot Off",
  "Port Clear",
] as const;

export const shiftingEventTypes = ["Shifting Started", "Shifting Completed"] as const;
export const anchorageEventTypes = ["Anchor Dropped", "Anchor Aweigh"] as const;
export const reportEventTypes = [...anchorageEventTypes, ...timelineEventTypes.slice(0, 8), ...shiftingEventTypes, ...timelineEventTypes.slice(8)] as const;

export const visibleTimeBases = ["actual", "estimated", "planned"] as const;
export const reservedTimeBases = [...visibleTimeBases, "requested"] as const;
export type VisibleTimeBasis = (typeof visibleTimeBases)[number];
export type ReportEventType = (typeof reportEventTypes)[number];

export type DataVisibility = "public" | "restricted" | "internal";

export const dataClassification = {
  public: "Operational milestone, time basis, vessel IMO, port UN/LOCODE and optional operational location context.",
  restricted: "Contributor identity, professional profile, organisational representation and future organisation- or port-limited operational data.",
  internal: "Administrative notes, audit records, review evidence, security information and moderation history.",
} as const;

export const timeBasisDefinitions = [
  { code: "estimated", label: "Estimated", abbreviation: "EST", definition: "A current professional expectation that has not yet occurred.", imoPattern: "Estimated time (E)" },
  { code: "planned", label: "Planned", abbreviation: "PLN", definition: "A time adopted in the current operational plan or schedule.", imoPattern: "Planned time (P)" },
  { code: "actual", label: "Actual", abbreviation: "ACT", definition: "A time observed after the event occurred.", imoPattern: "Actual time (A)" },
  { code: "requested", label: "Requested", abbreviation: "REQ", definition: "A time requested by one operational party and awaiting planning confirmation.", imoPattern: "Requested time (R)", reserved: true },
] as const;

export const standardAbbreviations = [
  { abbreviation: "ATA", term: "Actual Time of Arrival", family: "Arrival" },
  { abbreviation: "ETA", term: "Estimated Time of Arrival", family: "Arrival" },
  { abbreviation: "PTA", term: "Planned Time of Arrival", family: "Arrival" },
  { abbreviation: "RTA", term: "Requested Time of Arrival", family: "Arrival" },
  { abbreviation: "ATS", term: "Actual Time of Start", family: "Service start" },
  { abbreviation: "ETS", term: "Estimated Time of Start", family: "Service start" },
  { abbreviation: "PTS", term: "Planned Time of Start", family: "Service start" },
  { abbreviation: "RTS", term: "Requested Time of Start", family: "Service start" },
  { abbreviation: "ATC", term: "Actual Time of Completion", family: "Service completion" },
  { abbreviation: "ETC", term: "Estimated Time of Completion", family: "Service completion" },
  { abbreviation: "PTC", term: "Planned Time of Completion", family: "Service completion" },
  { abbreviation: "RTC", term: "Requested Time of Completion", family: "Service completion" },
  { abbreviation: "ATD", term: "Actual Time of Departure", family: "Departure" },
  { abbreviation: "ETD", term: "Estimated Time of Departure", family: "Departure" },
  { abbreviation: "PTD", term: "Planned Time of Departure", family: "Departure" },
  { abbreviation: "RTD", term: "Requested Time of Departure", family: "Departure" },
  { abbreviation: "PBP", term: "Pilot Boarding Place", family: "Location" },
  { abbreviation: "VTS", term: "Vessel Traffic Services", family: "Port service" },
  { abbreviation: "MSW", term: "Maritime Single Window", family: "Digital exchange" },
  { abbreviation: "PCS", term: "Port Community System", family: "Digital exchange" },
] as const;

export const eventDefinitions = [
  { event: "Pilot on Board", code: "pilot_on_board", phase: "Inbound", definition: "Pilot physically embarked for the relevant pilotage movement.", location: "Pilot boarding place or reported position", standard: "No single standard abbreviation", standardNote: "ATA PBP refers to the ship's arrival at the Pilot Boarding Place, not to the boarding event itself." },
  { event: "Tugs Connected", code: "tugs_connected", phase: "Inbound / Shifting / Outbound", definition: "Required tug assistance connected and ready for the movement.", location: "Reported operational position", standard: "ATS Tug service", standardNote: "Standards-family mapping: actual start of a nautical service at a stated location." },
  { event: "First Line", code: "first_line", phase: "Berth arrival", definition: "First mooring line secured ashore at the berth.", location: "Berth / berth position", standard: "ATA Berth", standardNote: "The PCO Guide defines Actual Time of Arrival Berth by the first line secured." },
  { event: "All Fast", code: "all_fast", phase: "Alongside", definition: "Vessel secured in the agreed berthing position.", location: "Berth / berth position", standard: "No single standard abbreviation", standardNote: "A distinct operational milestone; it should not be substituted for ATA Berth without a local definition." },
  { event: "Gangway Down", code: "gangway_down", phase: "Alongside", definition: "Gangway positioned for operational access.", location: "Berth", standard: "No single standard abbreviation", standardNote: "A locally useful milestone, but not a general IMO timestamp abbreviation." },
  { event: "Cargo Operations Started", code: "cargo_operations_started", phase: "Alongside", definition: "Cargo handling operations commenced.", location: "Terminal / berth", standard: "ATS Cargo service", standardNote: "Actual Time of Start of the cargo or terminal service." },
  { event: "Cargo Operations Completed", code: "cargo_operations_completed", phase: "Alongside", definition: "Cargo handling operations completed.", location: "Terminal / berth", standard: "ATC Cargo service", standardNote: "Actual Time of Completion of the cargo or terminal service." },
  { event: "Vessel Ready to Sail", code: "vessel_ready_to_sail", phase: "Departure planning", definition: "Vessel operationally ready to begin the departure sequence.", location: "Berth", standard: "No single standard abbreviation", standardNote: "Readiness and departure time are separate concepts." },
  { event: "Shifting Started", code: "shifting_started", phase: "Shifting", definition: "Vessel commenced an internal movement between positions within the same port call.", location: "Origin berth / position", standard: "No single standard abbreviation", standardNote: "VHF14 retains this as an in-port movement within the same port call." },
  { event: "Shifting Completed", code: "shifting_completed", phase: "Alongside", definition: "Vessel secured at the new position after an internal shift.", location: "Destination berth / position", standard: "No single standard abbreviation", standardNote: "The destination berth or position must accompany the event when known." },
  { event: "Last Line", code: "last_line", phase: "Berth departure", definition: "Last mooring line released from the berth.", location: "Berth / berth position", standard: "ATD Berth", standardNote: "Actual Time of Departure Berth may be operationally defined by the last line released." },
  { event: "Pilot Off", code: "pilot_off", phase: "Outbound", definition: "Pilot disembarked or the relevant pilotage service was completed.", location: "Pilot disembarkation place or reported position", standard: "ATC Pilotage", standardNote: "Standards-family mapping: actual completion of the pilotage service at a stated location." },
  { event: "Port Clear", code: "port_clear", phase: "Outbound", definition: "Vessel reported clear of the port-call operational area used by VHF14.", location: "Port operational boundary", standard: "No single standard abbreviation", standardNote: "The applicable boundary must be defined by the port or reporting context." },
  { event: "Anchor Dropped", code: "anchor_dropped", phase: "Anchorage context", definition: "Vessel anchored during the port call.", location: "Anchorage or reported position", standard: "No single standard abbreviation", standardNote: "Contextual event; anchorage identity or position should be included when known.", contextual: true },
  { event: "Anchor Aweigh", code: "anchor_aweigh", phase: "Anchorage context", definition: "Vessel commenced departure from anchorage.", location: "Anchorage or reported position", standard: "No single standard abbreviation", standardNote: "Contextual event; it does not create a new port call.", contextual: true },
] as const;

export const referenceFramework = {
  status: "designed_with_reference",
  sources: ["IMO FAL.5/Circ.52", "IMO Compendium on Facilitation and Electronic Business", "IHO port-information standards"],
  note: "VHF14 is not an official VTS, Port Community System, Maritime Single Window or navigational service.",
} as const;
