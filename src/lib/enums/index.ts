// src/lib/enums/index.ts
import { z, ZodTypeAny, ZodNativeEnum } from "zod";
import * as Enums from "@/types/chat/enums";

// ---- TYPES ----

type NativeEnum = Record<string, string | number>;
type EnumSchemasMap = Record<string, ZodNativeEnum<any>>;

// ---- INTERNAL: Lazy Enum Registry ----

const _registry: EnumSchemasMap = {};

function getEnumSchema(enumName: keyof typeof Enums): ZodNativeEnum<any> {
  if (!_registry[enumName]) {
    const enumDef = Enums[enumName];
    if (!enumDef) throw new Error(`Enum ${enumName} not found in @/types/chat/enums.ts`);
    _registry[enumName] = z.nativeEnum(enumDef);
  }
  return _registry[enumName];
}

// ---- API FUNCTIONS ----

export function validateEnumValue<T extends keyof typeof Enums>(
  enumName: T,
  value: unknown
): z.infer<ReturnType<typeof getEnumSchema>> {
  return getEnumSchema(enumName).parse(value);
}

export function safeParseEnumValue<T extends keyof typeof Enums>(
  enumName: T,
  value: unknown,
  fallback?: z.infer<ReturnType<typeof getEnumSchema>>
): z.infer<ReturnType<typeof getEnumSchema>> | undefined {
  const result = getEnumSchema(enumName).safeParse(value);
  return result.success ? result.data : fallback;
}

export function enumValues<T extends keyof typeof Enums>(enumName: T): string[] {
  const schema = getEnumSchema(enumName);
  return Object.values(schema.enum);
}

export function parseEnumFlexible<T extends keyof typeof Enums>(
  enumName: T,
  raw: unknown,
  fallback?: z.infer<ReturnType<typeof getEnumSchema>>
): z.infer<ReturnType<typeof getEnumSchema>> | undefined {
  if (typeof raw !== "string") return fallback;
  const normalized = raw.trim().toUpperCase();
  const candidates = enumValues(enumName);
  const match = candidates.find((v) => v.toUpperCase() === normalized);
  return match ?? fallback;
}

// ---- EXPORTS ----

export const EnumUtils = {
  validateEnumValue,
  safeParseEnumValue,
  enumValues,
  parseEnumFlexible,
};
