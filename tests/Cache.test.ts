import { Cache } from "../src/Cache";

describe("cache", () => {
	it("should tell me when a value is used", () => {
		const cache = new Cache();

		cache.store("a", 1);
		cache.store("b", 3);

		expect(cache.used("a")).toBe(1);
		expect(cache.used("b")).toBe(3);
		expect(cache.used("test")).toBe(null);
	});

	it("should purge one item", () => {
		const cache = new Cache();

		cache.store("a", 1);
		cache.store("b", 3);

		cache.purge("a");

		expect(cache.used("a")).toBe(null);
		expect(cache.used("b")).toBe(3);
	});

	it("should purge all items", () => {
		const cache = new Cache();

		cache.store("a", 1);
		cache.store("b", 3);

		cache.purge();

		expect(cache.used("a")).toBe(null);
		expect(cache.used("b")).toBe(null);
	});
});
