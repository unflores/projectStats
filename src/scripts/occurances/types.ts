import { AnalysisEnum } from "@/lib/analyses";
export interface Processor {
  buildOccurances(): Promise<{ occurredAt: string; id: string; type: string }[]>;
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
