import { EnumUtils } from "@/lib/enums";

describe("EnumUtils", () => {
  it("parses valid values", () => {
    expect(EnumUtils.validateEnumValue("ChatMode", "dev")).toBe("dev");
  });

  it("falls back on invalid values", () => {
    expect(EnumUtils.safeParseEnumValue("UserRole", "not_a_role", "guest")).toBe("guest");
  });

  it("flexibly parses strings", () => {
    expect(EnumUtils.parseEnumFlexible("ChatMode", "   Dev ")).toBe("dev");
  });

  it("lists all values", () => {
    const roles = EnumUtils.enumValues("UserRole");
    expect(Array.isArray(roles)).toBe(true);
  });
});
