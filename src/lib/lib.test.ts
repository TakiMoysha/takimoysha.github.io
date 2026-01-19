import { expect, test, describe } from "bun:test";
import { parseDate } from "./content.ts";

describe("document parsing", () => {
	test("should parse string to date", () => {
		let res = parseDate("20230101");
	});

	test("should parse number to date", () => {
		let res = parseDate(20230101);
	});
});
