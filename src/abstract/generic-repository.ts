import mongoose, { Model, FilterQuery, QueryOptions, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createData: unknown): Promise<any> {
    const createdEntity = new this.model(createData);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<T> {
    return this.model.findById(id, option);
  }

  async findByCondition(
    filter: FilterQuery<T>,
    field?: any | null,
    option?: any | null,
  ): Promise<T> {
    return this.model.findOne(filter, field, option) as Promise<T>;
  }

  async getByCondition(
    filter: FilterQuery<T>,
    field?: any | null,
    option?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option) as Promise<T[]>;
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async aggregate(option: any) {
    return this.model.aggregate(option);
  }

  async populate(result: T[], option: any) {
    return await this.model.populate(result, option);
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>);
  }

  async deleteMany(id: string[]) {
    return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  }

  async deleteByCondition(filter?: FilterQuery<T>) {
    return this.model.deleteMany(filter);
  }

  async findByConditionAndUpdate(
    filter: FilterQuery<T>,
    updateData: Partial<T>,
  ) {
    return this.model.findOneAndUpdate(filter as FilterQuery<T>, updateData);
  }

  async updateMany(
    filter: FilterQuery<T>,
    updateData: Partial<T>,
    option?: any | null,
  ) {
    return this.model.updateMany(filter, updateData, option);
  }

  async findByIdAndUpdate(id: mongoose.ObjectId | any, updateData: Partial<T>) {
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }
}
