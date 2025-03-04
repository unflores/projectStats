import { AnalysisEnum } from "@/lib/analyses";
export interface Processor {
  /** Build the occurances from some event in the history in the project */
  buildOccurances(): Promise<{ occurredAt: string; amount: number; id: string; type: string }[]>;
  /** Clean up the state of the project */
  cleanup?(): Promise<void>;
  /** The analyses that the processor supports */
  analyses(): AvailableAnalysisEnum[];
}

// Processors supported from command-line
export enum AvailableProcessorEnum {
  ReleaseCandidates = AnalysisEnum.ReleaseCandidates,
  LOCChanged = AnalysisEnum.LOCChanged,
  LOCLanguage = AnalysisEnum.LOCLanguage,
}

export enum AvailableAnalysisEnum {
  ReleaseCandidates = AnalysisEnum.ReleaseCandidates,
  LOCChanged = AnalysisEnum.LOCChanged,
  LOCAdded = AnalysisEnum.LOCAdded,
  LOCRemoved = AnalysisEnum.LOCRemoved,
  LOCLanguage = AnalysisEnum.LOCLanguage,
}

export const iso8601Format = "ddd MMM DD HH:mm:ss YYYY Z";
