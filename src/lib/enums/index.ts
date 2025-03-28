
import { z, ZodNativeEnum } from "zod";
import * as Enums from "@/types/chat/enums";

// --- Types ---
type NativeEnum = Record<string, string | number>;
type EnumName = keyof typeof Enums;
type EnumSchemasMap = Record<EnumName, ZodNativeEnum<any>>;
type EnumValue<T extends EnumName> = z.infer<ReturnType<typeof getEnumSchema<T>>>;

// --- Internal: Lazy Registry ---
const _enumSchemaCache: EnumSchemasMap = {};

function getEnumSchema<T extends EnumName>(enumName: T): ZodNativeEnum<any> {
  if (!_enumSchemaCache[enumName]) {
    const enumDef = Enums[enumName];
    if (!enumDef) throw new Error(`Enum "${enumName}" not found in "@/types/chat/enums.ts"`);
    _enumSchemaCache[enumName] = z.nativeEnum(enumDef);
  }
  return _enumSchemaCache[enumName];
}

// --- Core Validators ---
function validateEnumValue<T extends EnumName>(
  enumName: T,
  value: unknown
): EnumValue<T> {
  return getEnumSchema(enumName).parse(value);
}

function safeParseEnumValue<T extends EnumName>(
  enumName: T,
  value: unknown,
  fallback?: EnumValue<T>
): EnumValue<T> | undefined {
  const result = getEnumSchema(enumName).safeParse(value);
  return result.success ? result.data : fallback;
}

// --- Dropdown / UI Helpers ---
function enumValues<T extends EnumName>(enumName: T): EnumValue<T>[] {
  return Object.values(getEnumSchema(enumName).enum);
}

// --- Flexible Input (e.g. AI/user-friendly) ---
function parseEnumFlexible<T extends EnumName>(
  enumName: T,
  raw: unknown,
  fallback?: EnumValue<T>
): EnumValue<T> | undefined {
  if (typeof raw !== "string") return fallback;

  const normalized = raw.trim().toLowerCase();
  const values = enumValues(enumName).map((v) => v.toString());

  const matched = values.find((v) => v.toLowerCase() === normalized);
  return matched as EnumValue<T> ?? fallback;
}

// --- Bonus: Enum Metadata Builder (for UI docs / introspection) ---
function enumMeta<T extends EnumName>(enumName: T): { value: EnumValue<T>; label: string }[] {
  const values = enumValues(enumName);
  return values.map((v) => ({
    value: v,
    label: v.toString().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  }));
}

// --- Type conversion utilities (migrated from enums-mapper.ts) ---
function messageTypeToString(type: Enums.MessageType): string {
  return type.toString();
}

function stringToMessageType(type: string): Enums.MessageType {
  return safeParseEnumValue('MessageType', type, Enums.MessageType.Text);
}

function chatModeToString(mode: Enums.ChatMode): string {
  return mode.toString();
}

function stringToChatMode(mode: string): Enums.ChatMode {
  return safeParseEnumValue('ChatMode', mode, Enums.ChatMode.Chat);
}

function chatModeForDatabase(mode: Enums.ChatMode | string): string {
  if (typeof mode === 'string') {
    return mode;
  }
  return chatModeToString(mode);
}

function databaseToChatMode(mode: string): Enums.ChatMode {
  return stringToChatMode(mode);
}

function messageStatusToString(status: Enums.MessageStatus): string {
  return status.toString();
}

function stringToMessageStatus(status: string): Enums.MessageStatus {
  return safeParseEnumValue('MessageStatus', status, Enums.MessageStatus.Sent);
}

function tokenEnforcementModeToString(mode: Enums.TokenEnforcementMode): string {
  return mode.toString();
}

function stringToTokenEnforcementMode(mode: string): Enums.TokenEnforcementMode {
  return safeParseEnumValue('TokenEnforcementMode', mode, Enums.TokenEnforcementMode.Never);
}

function tokenToUIEnforcementMode(mode: Enums.TokenEnforcementMode): string {
  switch (mode) {
    case Enums.TokenEnforcementMode.Always:
      return 'Always On';
    case Enums.TokenEnforcementMode.Never:
      return 'Always Off';
    case Enums.TokenEnforcementMode.RoleBased:
      return 'Role Based';
    case Enums.TokenEnforcementMode.ModeBased:
      return 'Mode Based';
    case Enums.TokenEnforcementMode.Warn:
      return 'Warn Only';
    case Enums.TokenEnforcementMode.Strict:
      return 'Strict';
    default:
      return 'Not Set';
  }
}

// --- Unified Export Object ---
export const EnumUtils = {
  getSchema: getEnumSchema,
  validate: validateEnumValue,
  safeParse: safeParseEnumValue,
  values: enumValues,
  flexibleParse: parseEnumFlexible,
  meta: enumMeta,
  messageTypeToString,
  stringToMessageType,
  chatModeToString,
  stringToChatMode,
  chatModeForDatabase,
  databaseToChatMode,
  messageStatusToString,
  stringToMessageStatus,
  tokenEnforcementModeToString,
  stringToTokenEnforcementMode,
  tokenToUIEnforcementMode
};
