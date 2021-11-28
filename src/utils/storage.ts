import { Storage } from "@ionic/storage";
import { Auth } from "../context/auth";

export default class StorageService {
	private static instance: StorageService;

	constructor(private storage: Storage) {
		this.init();
	}

	static getInstance() {
		if (typeof StorageService.instance === "undefined") {
			StorageService.instance = new StorageService(new Storage());
		}
		return StorageService.instance;
	}

	async init() {
		const storage = await this.storage.create();
		this.storage = storage;
	}

	public set(key: string, value: string) {
		this.storage.set(key, value);
	}

	public async get(key: string): Promise<string> {
		return this.storage.get(key);
	}

	public async remove(key: string): Promise<string> {
		return this.storage.remove(key);
	}

	public async clear(): Promise<void> {
		return this.storage.clear();
	}
}

export const getAuth = async (): Promise<Auth | undefined> => {
	const result = await StorageService.getInstance().get("auth");
	return result ? (JSON.parse(result) as Auth) : undefined;
};

export const setAuth = async (auth: Auth): Promise<void> => {
	await StorageService.getInstance().set("auth", JSON.stringify(auth));
};
