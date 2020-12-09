import PlatformStorage from "@common/PlatformStorage";

class QutebrowserStorage implements PlatformStorage {
  address: string;

  constructor(address: string) {
    this.address = address;
  }

  async set(key: string, val: string, duration?: number): Promise<void> {
    await fetch(`${this.address}/storage/set`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ key: key, value: val, duration: duration }),
    });
  }

  async get(key: string): Promise<string | undefined> {
    const res = await fetch(`${this.address}/storage/get/${key}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data["value"];
  }
}

export default QutebrowserStorage;
