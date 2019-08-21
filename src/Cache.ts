interface Values {
	[key: string]: unknown;
}

export class Cache {
	private values: Values;
	constructor() {
		this.values = {};
	}

	public store<T>(key: string, value: T): void {
		this.values[key] = value;
	}

	public used<T>(key: string): T | null {
		if (this.values[key] !== undefined) {
			return this.values[key] as T;
		}
		return null;
	}

	public purge(key?: string): void {
		if (key) {
			if (this.values[key]) {
				delete this.values[key];
			}
		} else {
			this.values = {};
		}
	}
}
