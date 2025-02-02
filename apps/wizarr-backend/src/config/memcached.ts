import Memcached from "memcached";

export const memcached = new Memcached(`${env("MEMCACHED_HOST", "localhost")}:${env("MEMCACHED_PORT", 11211)}`, {
    retries: 1,
    retry: 1000,
});
