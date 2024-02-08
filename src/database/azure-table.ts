import type { ListTableEntitiesOptions, TableClient } from '@azure/data-tables';
import { TableTransaction, type TableEntityResult, type TableEntityResultPage } from '@azure/data-tables';
import type { PagedAsyncIterableIterator, PageSettings } from '@azure/core-paging';

export interface AzureTableEntityBase {
  partitionKey: string;
  rowKey: string;
}

/**
 * Generic Azure Table class
 */
export class AzureTable<TEntity extends AzureTableEntityBase> {
  constructor(public readonly client: TableClient) {}

  async createTable() {
    return this.client.createTable();
  }

  /**
   * Query entities
   * TODO: may fix type safety later
   *
   * select prop type may incorrect
   */
  list(
    queryOptions?: ListTableEntitiesOptions['queryOptions'],
    listTableEntitiesOptions?: Omit<ListTableEntitiesOptions, 'queryOptions'>
  ): PagedAsyncIterableIterator<TableEntityResult<TEntity>, TableEntityResultPage<TEntity>, PageSettings> {
    return this.client.listEntities<TEntity>({
      ...listTableEntitiesOptions,
      queryOptions,
    });
  }

  async insert(entity: TEntity) {
    return this.client.createEntity<TEntity>(entity);
  }

  /**
   * All operations in a transaction must target the same partitionKey
   */

  async insertBatch(rawEntities: TEntity[]) {
    const groupByPartitionKey = this.groupPartitionKey(rawEntities);
    for (const entities of Object.values(groupByPartitionKey)) {
      const transaction = new TableTransaction();
      entities.forEach(entity => transaction.createEntity(entity));
      await this.client.submitTransaction(transaction.actions);
    }
  }

  /**
   * Group entities by partitionKey
   * Becasue all operations in a transaction must target the same partitionKey
   *
   * @param entities
   * @returns
   */
  groupPartitionKey(entities: TEntity[]) {
    return entities.reduce(
      (acc, cur) => {
        if (!acc[cur.partitionKey]) {
          acc[cur.partitionKey] = [];
        }
        if(cur.partitionKey === undefined){
          return acc;
        }
        acc[cur.partitionKey]?.push(cur);
        return acc;
      },
      {} as Record<string, TEntity[]>
    );
  }
}
