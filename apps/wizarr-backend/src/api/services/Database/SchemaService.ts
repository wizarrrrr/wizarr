import { Service } from "typedi";
import { DataSource, EntityMetadata } from "typeorm";

interface Column {
    column_name: string;
    data_type: string;
}

interface Relationship {
    source_table: string;
    source_column: string;
    target_table: string;
    target_column: string;
}

interface TableSchema {
    table_name: string;
    columns: Column[];
    relationships: Relationship[];
}

@Service()
export class SchemaService {
    constructor(private dataSource: DataSource) {}

    public async getSchema(): Promise<TableSchema[]> {
        return this.dataSource.entityMetadatas.map((entity: EntityMetadata) => {
            const columns: Column[] = entity.columns.map((col) => ({
                column_name: col.databaseName,
                data_type: col.type as string,
            }));

            // Extract relationships including many-to-many
            const relationships: Relationship[] = entity.relations.flatMap((relation) => {
                const rels: Relationship[] = [];

                // Handle many-to-many relationships
                if (relation.relationType === "many-to-many") {
                    const junctionMetadata = relation.junctionEntityMetadata;
                    if (junctionMetadata) {
                        junctionMetadata.foreignKeys.forEach((fk) => {
                            rels.push({
                                source_table: fk.entityMetadata.tableName,
                                source_column: fk.columns[0].databaseName,
                                target_table: fk.referencedEntityMetadata.tableName,
                                target_column: fk.referencedColumns[0].databaseName,
                            });
                        });
                    }
                }

                // Handle one-to-many/many-to-one relationships
                relation.foreignKeys?.forEach((fk) => {
                    rels.push({
                        source_table: fk.entityMetadata.tableName,
                        source_column: fk.columns[0].databaseName,
                        target_table: fk.referencedEntityMetadata.tableName,
                        target_column: fk.referencedColumns[0].databaseName,
                    });
                });

                return rels;
            });

            // Remove duplicate relationships
            const uniqueRelationships = Array.from(new Map(relationships.map((rel) => [JSON.stringify([rel.source_table, rel.target_table, rel.source_column]), rel])).values());

            return {
                table_name: entity.tableName,
                columns,
                relationships: uniqueRelationships,
            };
        });
    }
}
