interface Values {
	[key: string]: any;
}

export class Cache {
	private values: Values;
	constructor() {
		this.values = {};
	}

	public store<T>(key: string, value: T) {
		this.values[key] = value;
	}

	public used<T>(key: string): T | null {
		if (this.values[key] !== undefined) {
			return this.values[key];
		}
		return null;
	}

	public purge(key?: string) {
		if (key) {
			if (this.values[key]) {
				delete this.values[key];
			}
		} else {
			this.values = {};
		}
	}
}
