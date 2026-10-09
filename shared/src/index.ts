import { z } from 'zod';

// ============================================================================
// 1. Core Dimensions & Enums
// ============================================================================

export const GameModeSchema = z.enum([
  'social_simulator',
  'conflict_arena',
  'flirt_lab'
]);
export type GameMode = z.infer<typeof GameModeSchema>;

/**
 * 4 Core Dimensions:
 * - directness: stating feelings/intents directly vs indirect hinting
 * - conflict_engagement: leaning in to resolve vs taking time to cool down/reflect
 * - boundary_expression: clear self-advocacy vs over-accommodating
 * - perspective_taking: inquiring/attuning to other's state vs self-focused stance
 */
export const BehavioralDimensionSchema = z.enum([
  'directness',
  'conflict_engagement',
  'boundary_expression',
  'perspective_taking'
]);
export type BehavioralDimension = z.infer<typeof BehavioralDimensionSchema>;

export const DimensionScoreStatusSchema = z.enum([
  'insufficient_evidence',
  'context_dependent',
  'evaluated'
]);
export type DimensionScoreStatus = z.infer<typeof DimensionScoreStatusSchema>;

// ============================================================================
// 2. Choice & Scenario Definition Schemas
// ============================================================================

export const DimensionImpactSchema = z.object({
  dimension: BehavioralDimensionSchema,
  delta: z.number().int().min(-2).max(2),
  reason: z.string().min(1)
});
export type DimensionImpact = z.infer<typeof DimensionImpactSchema>;

export const ChoiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  text: z.string().min(1),
  impacts: z.array(DimensionImpactSchema)
});
export type ChoiceOption = z.infer<typeof ChoiceOptionSchema>;

export const CharacterMoodSchema = z.enum([
  'neutral',
  'warm',
  'annoyed',
  'amused',
  'hesitant',
  'guarded',
  'relieved'
]);
export type CharacterMood = z.infer<typeof CharacterMoodSchema>;

export const CharacterQuirksSchema = z.object({
  typingSpeedMs: z.number().int().positive().default(1200),
  emojiHabit: z.string().min(1),
  messageStyle: z.string().min(1),
  initialMood: CharacterMoodSchema.default('neutral'),
  initialMoodDesc: z.string().default('Assessing the conversational temperature')
});
export type CharacterQuirks = z.infer<typeof CharacterQuirksSchema>;

export const CharacterMetaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  avatarSeed: z.string().min(1),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  traits: z.array(z.string()).min(1),
  quirks: CharacterQuirksSchema.optional()
});
export type CharacterMeta = z.infer<typeof CharacterMetaSchema>;

export const ScenarioThemeIdSchema = z.enum([
  'midnight_group_chat',
  'fluorescent_hallway',
  'cafe_golden_hour',
  'rain_window',
  'art_mixer'
]);
export type ScenarioThemeId = z.infer<typeof ScenarioThemeIdSchema>;

export const ScenarioDefinitionSchema = z.object({
  id: z.string().min(1),
  mode: GameModeSchema,
  title: z.string().min(1),
  tagline: z.string().min(1),
  context: z.string().min(1),
  character: CharacterMetaSchema,
  openingMessage: z.string().min(1),
  initialChoices: z.array(ChoiceOptionSchema).min(3),
  maxTurns: z.number().int().min(2).max(6).default(3),
  themeId: ScenarioThemeIdSchema.optional()
});
export type ScenarioDefinition = z.infer<typeof ScenarioDefinitionSchema>;

// ============================================================================
// 3. Conversation & Turns Schemas
// ============================================================================

export const SpeakerSchema = z.enum(['user', 'character']);
export type Speaker = z.infer<typeof SpeakerSchema>;

export const TurnSchema = z.object({
  turnNumber: z.number().int().nonnegative(),
  speaker: SpeakerSchema,
  text: z.string().min(1).max(1200),
  choiceId: z.string().optional(),
  isCustom: z.boolean().optional(),
  timestamp: z.string().datetime()
});
export type Turn = z.infer<typeof TurnSchema>;

// ============================================================================
// 4. API Request / Response Schemas
// ============================================================================

export const TurnRequestSchema = z.object({
  scenarioId: z.string().min(1),
  userMessage: z.string().trim().min(1, 'User message cannot be empty').max(800),
  choiceId: z.string().optional(),
  isCustom: z.boolean().optional().default(false),
  history: z.array(TurnSchema).max(20).default([])
});
export type TurnRequest = z.infer<typeof TurnRequestSchema>;

export const TurnResponseSchema = z.object({
  characterReply: z.string().min(1),
  turnCount: z.number().int().nonnegative(),
  canContinue: z.boolean(),
  nextChoices: z.array(ChoiceOptionSchema).default([]),
  mockMode: z.boolean(),
  characterMood: CharacterMoodSchema.optional(),
  characterMoodDescription: z.string().optional()
});
export type TurnResponse = z.infer<typeof TurnResponseSchema>;

// ============================================================================
// 5. Scoring & Reflection Schemas
// ============================================================================

export const EvidenceReceiptSchema = z.object({
  id: z.string().min(1),
  turnNumber: z.number().int().positive(),
  quote: z.string().min(1),
  dimension: BehavioralDimensionSchema,
  observation: z.string().min(1)
});
export type EvidenceReceipt = z.infer<typeof EvidenceReceiptSchema>;

export const DimensionScoreResultSchema = z.object({
  dimension: BehavioralDimensionSchema,
  label: z.string(),
  score: z.number().int().min(0).max(100).nullable(),
  status: DimensionScoreStatusSchema,
  summary: z.string(),
  evidenceIds: z.array(z.string()),
  observationsCount: z.number().int().nonnegative().optional(),
  scenariosNeededToUnlock: z.number().int().nonnegative().optional(),
  partialScore: z.number().int().min(0).max(100).nullable().optional()
});
export type DimensionScoreResult = z.infer<typeof DimensionScoreResultSchema>;

export const ScoreResponseSchema = z.object({
  scores: z.record(BehavioralDimensionSchema, DimensionScoreResultSchema),
  receipts: z.array(EvidenceReceiptSchema)
});
export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;

export const ReportRequestSchema = z.object({
  scenarioId: z.string().min(1),
  history: z.array(TurnSchema).min(1, 'Need at least one turn to generate reflection')
});
export type ReportRequest = z.infer<typeof ReportRequestSchema>;

export const ReportResponseSchema = z.object({
  scenarioId: z.string(),
  scenarioTitle: z.string(),
  characterName: z.string(),
  scores: z.record(BehavioralDimensionSchema, DimensionScoreResultSchema),
  vibeSnapshot: z.string(),
  observedPatterns: z.array(z.string()),
  alternativeApproaches: z.array(z.string()),
  receipts: z.array(EvidenceReceiptSchema),
  whatWeCannotKnow: z.array(z.string()),
  mockMode: z.boolean(),
  archetype: z.string().optional(),
  archetypeTagline: z.string().optional(),
  howItLanded: z.string().optional()
});
export type ReportResponse = z.infer<typeof ReportResponseSchema>;

// ============================================================================
// 6. Health & Error Schemas
// ============================================================================

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  model: z.string(),
  mockMode: z.boolean(),
  version: z.string()
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const ApiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  })
});
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

// ============================================================================
// 7. Scenarios & Universal Simulation Engine Exports
// ============================================================================

export * from './scenarios.js';
export * from './simulation.js';

