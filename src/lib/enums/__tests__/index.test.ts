
// src/lib/enums/__tests__/index.test.ts
import { EnumUtils } from "../index";

describe("EnumUtils", () => {
  it("validates enum", () => {
    expect(EnumUtils.validate("ChatMode", "dev")).toBe("dev");
  });

  it("safe parses with fallback", () => {
    expect(EnumUtils.safeParse("UserRole", "superstar", "guest")).toBe("guest");
  });

  it("flexibly parses sloppy input", () => {
    expect(EnumUtils.flexibleParse("ChatMode", "  Dev ")).toBe("dev");
  });

  it("lists all values", () => {
    const roles = EnumUtils.values("UserRole");
    expect(roles).toContain("admin");
  });

  it("generates meta with labels", () => {
    const metadata = EnumUtils.meta("ChatTier");
    expect(metadata[0]).toHaveProperty("value");
    expect(metadata[0]).toHaveProperty("label");
  });
});
