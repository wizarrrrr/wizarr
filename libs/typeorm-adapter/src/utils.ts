import type { DataSource } from "typeorm";

function entitiesChanged(prevEntities: unknown[] | undefined, newEntities: unknown[]): boolean {
    if (prevEntities?.length !== newEntities?.length) return true;

    for (let i = 0; i < prevEntities?.length; i++) {
        if (prevEntities[i] !== newEntities[i]) return true;
    }

    return false;
}

export async function updateConnectionEntities(dataSource: DataSource, entities: unknown[]) {
    if (!entitiesChanged(dataSource.entityMetadatas, entities)) return;

    // @ts-expect-error - TypeORM doesn't have a type for this property
    dataSource.entityMetadatas = entities;

    // @ts-expect-error - TypeORM doesn't have a type for this property
    await dataSource.buildMetadatas();

    if (dataSource.options.synchronize !== false) {
        console.warn("[next-auth][warn][adapter_typeorm_updating_entities]", "\nhttps://authjs.dev/reference/warnings#adapter_typeorm_updating_entities");
        await dataSource.synchronize();
    }
}
