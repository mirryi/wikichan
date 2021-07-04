import { assert } from "chai";

import { MemoryStorage } from "./memory";

describe("MemoryStorage", function () {
    describe("#set", function () {
        it("set a value", async function () {
            const [storage, inner] = createStorage();

            await storage.set({ a: 0 });

            assert.equal(inner.get("a"), 0);
        });

        it("set multiple values", async function () {
            const [storage, inner] = createStorage();

            await storage.set({ a: 0, b: 1 });

            assert.equal(inner.get("a"), 0);
            assert.equal(inner.get("b"), 1);
        });

        it("set multiple values separately", async function () {
            const [storage, inner] = createStorage();

            await storage.set({ a: 0 });
            await storage.set({ b: 1 });

            assert.equal(inner.get("a"), 0);
            assert.equal(inner.get("b"), 1);
        });
    });

    describe("#get", function () {
        it("get a value", async function () {
            const [storage, inner] = createStorage();
            inner.set("a", 0);

            assert.deepEqual(await storage.get(["a"]), { a: 0 });
        });

        it("get multiple values", async function () {
            const [storage, inner] = createStorage();
            inner.set("a", 0);
            inner.set("b", 1);

            assert.deepEqual(await storage.get(["a", "b"]), { a: 0, b: 1 });
        });

        it("get multiple values separately", async function () {
            const [storage, inner] = createStorage();
            inner.set("a", 0);
            inner.set("b", 1);

            assert.deepEqual(await storage.get(["a"]), { a: 0 });
            assert.deepEqual(await storage.get(["b"]), { b: 1 });
        });
    });

    describe("#del", function () {
        it("delete a value", async function () {
            const [storage, inner] = createStorage();

            inner.set("a", 0);
            await storage.del(["a"]);

            assert.equal(inner.get("a"), undefined);
        });

        it("delete multiple values", async function () {
            const [storage, inner] = createStorage();

            inner.set("a", 0);
            inner.set("b", 1);
            await storage.del(["a", "b"]);

            assert.equal(inner.get("a"), undefined);
            assert.equal(inner.get("b"), undefined);
        });

        it("delete multiple values separately", async function () {
            const [storage, inner] = createStorage();

            inner.set("a", 0);
            inner.set("b", 1);
            await storage.del(["a"]);
            await storage.del(["b"]);

            assert.equal(inner.get("a"), undefined);
            assert.equal(inner.get("b"), undefined);
        });
    });
});

function createStorage(): [MemoryStorage<number>, Map<string, number>] {
    const storage = new MemoryStorage<number>();
    return [storage, storage.inner()];
}
