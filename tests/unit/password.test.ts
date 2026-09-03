import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/modules/auth/password";

describe("password hashing", () => {
  it("hashes a password and verifies the correct password against it", async () => {
    const hash = await hashPassword("CorrectHorseBatteryStaple1!");
    expect(await verifyPassword("CorrectHorseBatteryStaple1!", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("CorrectHorseBatteryStaple1!");
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });

  it("produces a different hash each time (salted)", async () => {
    const hash1 = await hashPassword("SamePassword1!");
    const hash2 = await hashPassword("SamePassword1!");
    expect(hash1).not.toBe(hash2);
  });
});
