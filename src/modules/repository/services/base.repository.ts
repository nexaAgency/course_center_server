import { DataSource, DeepPartial, EntityTarget, Repository } from 'typeorm';

export abstract class BaseRepository<Entity> extends Repository<Entity> {
  protected constructor(entity: EntityTarget<Entity>, dataSource: DataSource) {
    super(entity, dataSource.manager);
  }

  async findOneById(id: number): Promise<Entity | null> {
    return await this.findOne({ where: { id } } as any);
  }

  async createAndSave(data: DeepPartial<Entity>): Promise<Entity> {
    return await this.save(this.create(data));
  }
}
