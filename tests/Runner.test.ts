import { Runner } from "../src/Runner";

const op500Delay = (): Promise<number> => {
	return new Promise(resolve => {
		setTimeout(() => resolve(500), 500);
	});
};

const op50Delay = (): Promise<number> => {
	return new Promise(resolve => {
		setTimeout(() => resolve(500), 50);
	});
};

describe("Runner", () => {
	it("should run one operation", async () => {
		const runner = new Runner();

		const fn = async () => {
			const result = await op500Delay();
			return result * 2;
		};

		const result = await runner.run(fn);

		expect(result).toBe(1000);
	});

	it("should run two operation", async () => {
		const runner = new Runner();

		const fn = async () => {
			const result = await op500Delay();
			return result * 2;
		};

		const fn2 = async () => {
			const result = await op500Delay();
			return result * 3;
		};

		const result = await runner.run(fn);
		const result2 = await runner.run(fn2);

		expect(result).toBe(1000);
		expect(result2).toBe(1500);
	});

	it("should run an operation arguments", async () => {
		const runner = new Runner();

		const fn = async (powerValue: number) => {
			const result = await op500Delay();
			return result * powerValue;
		};

		const result = await runner.run(fn, 3);

		expect(result).toBe(1500);
	});

	it("should run an operation just once if result is recorded", async () => {
		const runner = new Runner();
		const fn = jest.fn().mockImplementation(async (powerValue: number) => {
			const result = await op500Delay();
			return result * powerValue;
		});
		const fn2 = jest.fn().mockImplementation(async (powerValue: number) => {
			const result = await op500Delay();
			return result * powerValue;
		});

		const result = await runner.run(fn, 3);
		const result2 = await runner.run(fn2, 3);

		expect(fn).toHaveBeenCalled();
		expect(fn2).not.toHaveBeenCalled();
		expect(result).toBe(1500);
		expect(result2).toBe(1500);
	});

	it("should enqueue incoming operations and check for stored results", async () => {
		const runner = new Runner();
		const fn = jest.fn().mockImplementation(async (powerValue: number) => {
			const result = await op500Delay();
			return result * powerValue;
		});
		const fn2 = jest.fn().mockImplementation(async (powerValue: number) => {
			const result = await op50Delay();
			return result * powerValue;
		});

		Promise.all([runner.run(fn, 3), runner.run(fn2, 3)]).then(([result, result2]) => {
			expect(fn).toHaveBeenCalled();
			expect(fn2).not.toHaveBeenCalled();
			expect(result).toBe(1500);
			expect(result2).toBe(1500);
		});
	});
});
