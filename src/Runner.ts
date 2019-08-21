import { Cache } from "./Cache";

interface Queue {
	op: any;
	args: any[];

	resolve: (value?: any) => void;
	reject: (value?: any) => void;
}

type Operation<R> = (...args: any[]) => Promise<R>;

/**
 * A class to schedule multiple async operations and cache their responses.
 * It creates a small and it delays the operations for about 100ms.
 *
 * The idea is that every operation is a promise. Before executing the real operation,
 * a Promise is created and it gets stored together with the queue.
 *
 * When the delay ticks, the queue gets scanned and the operation is executed.
 * Once the operation is done, the promise is resolved and the original operation is freed
 *
 * Op ===> run operation <==== Op
 *                |
 *                |
 * Promise  <====   ====> Promise
 *                |
 *                | 100ms
 * 			Scan the queue
 * 			Operations are sync now
 * 			And in serial
 *                |
 *                |
 * 	Resolved <===
 *                |
 *                | (cached value)
 * 					===> Resolved
 *
 *
 * The cache is really dump and it's basically the payload stringified against the real value.
 * If an operation doesn't have any arguments (payload), it's not cached ad it's impossible to determine
 * @export
 * @class Runner
 */
export class Runner {
	private cache: Cache;

	private queue: Queue[];

	private isBusy: boolean;

	constructor() {
		this.cache = new Cache();
		this.queue = [];
		this.isBusy = false;
	}

	public async run<R>(operation: Operation<R>, ...args: any[]): Promise<R> {
		const used = this.isUsed<R>(args);

		if (used) return Promise.resolve(used);

		return this.executeQueue<R>(operation, args);
	}

	/**
	 * It checks if a value with the same key has already been stored
	 *
	 * @private
	 * @template R
	 * @param {any[]} args
	 * @returns
	 * @memberof Runner
	 */
	private isUsed<R>(args: any[]) {
		const payloadAsString = JSON.stringify(args);

		return this.cache.used<R>(payloadAsString);
	}

	/**
	 * It puts an operation inside the queue
	 *
	 * @private
	 * @template R
	 * @param {Operation<R>} op
	 * @param {any[]} args
	 * @param {*} resolve
	 * @memberof Runner
	 */
	private enqueue<R>(op: Operation<R>, args: any[], resolve: any, reject: any) {
		this.queue.push({
			args,
			op,
			resolve,
			reject
		});
	}

	private async executeQueue<R>(op: Operation<R>, args: any[]) {
		return new Promise<R>((resolve, reject) => {
			this.enqueue(op, args, resolve, reject);
			this.executeOperations();
		});
	}

	/**
	 * It loops through the queue until there are items in it.
	 * It gets the first element and it check if it's cached. If the element is cached,
	 * it removes the first element from the queue and it resolve the cached result.
	 *
	 * If it's not cached, it execute the operation and once it's finished it resolves the result, caches it and
	 * remove the item from the queue
	 *
	 * @private
	 * @template R
	 * @returns
	 * @memberof Runner
	 */
	private async executeOperations<R>() {
		if (this.isBusy) {
			return;
		}

		while (this.queue.length) {
			const operation = this.queue.shift();
			if (operation) {
				this.isBusy = true;

				const { args, op, resolve } = operation;
				const used = this.isUsed<R>(args);

				if (used !== null) {
					this.isBusy = false;
					resolve(used);
				} else {
					try {
						const result = await op.apply(op, args);
						if (args.length > 0) {
							this.cache.store(JSON.stringify(args), result);
						}
						this.isBusy = false;
						resolve(result);
					} catch (err) {
						if (args.length > 0) {
							this.cache.store(JSON.stringify(args), false);
						}
						this.isBusy = false;
						resolve(true);
					}
				}
			} else {
				return;
			}
		}
	}
}
