import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/abstract/generic-repository';
import { Product, ProductDocument } from './product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel, ['category', 'variations']);
  }

  // async findAllWithVariationsSalePriceInRange(
  //   page: number,
  //   limit: number,
  //   filter?: FilterQuery<T>,
  //   sortBy?: string,
  //   order?: 'asc' | 'desc',
  //   minPrice?: number,
  //   maxPrice?: number,
  // ): Promise<{ data: T[]; totalPage: number; totalDocs: number }> {
  //   const skip = (page - 1) * limit;
  //   const sortOption: { [key: string]: 1 | -1 } = {};
  //   if (sortBy) {
  //     sortOption[sortBy] = order === 'asc' ? 1 : -1;
  //   }

  //   console.log(filter);
  //   const data = (await this.productModel
  //     .aggregate([
  //       {
  //         $match: filter ? filter : {}, // Áp dụng bộ lọc nếu có
  //       },
  //       {
  //         $lookup: {
  //           from: 'variations',
  //           localField: 'variations',
  //           foreignField: '_id',
  //           as: 'variations',
  //         },
  //       },
  //       {
  //         $addFields: {
  //           variationsWithSalePriceInRange: {
  //             $filter: {
  //               input: '$variations',
  //               as: 'variation',
  //               cond: {
  //                 $and: [
  //                   { $gte: ['$$variation.salePrice', minPrice] },
  //                   { $lte: ['$$variation.salePrice', maxPrice] },
  //                 ],
  //               },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $match: {
  //           variationsWithSalePriceInRange: { $ne: [] }, // Lọc ra các sản phẩm có biến thể có giá sale trong khoảng minPrice và maxPrice
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'categories', // Tên collection category
  //           localField: 'category',
  //           foreignField: '_id',
  //           as: 'category',
  //         },
  //       },
  //       {
  //         $addFields: {
  //           category: { $arrayElemAt: ['$category', 0] }, // Lấy phần tử đầu tiên của mảng category
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           name: 1,
  //           description: 1,
  //           isHot: 1,
  //           avatar: 1,
  //           images: 1,
  //           category: 1,
  //           isActive: 1,
  //           variations: '$variationsWithSalePriceInRange',
  //         },
  //       },
  //       {
  //         $sort: sortOption,
  //       },
  //       {
  //         $skip: skip,
  //       },
  //       {
  //         $limit: limit,
  //       },
  //     ])
  //     .exec()) as any;

  //   const totalDocs = await this.productModel.countDocuments(filter);
  //   const totalPage = Math.ceil(totalDocs / limit);
  //   return { data, totalPage, totalDocs };
  // }
}
