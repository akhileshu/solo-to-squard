import { videoSchema } from '../schemas';
import { __ERROR_properCase } from '../models';
import type { 
  __ERROR_properCase, 
  __ERROR_properCaseCreateInput,
  __ERROR_properCaseUpdateInput 
} from '../types';

export class VideoserviceService {
  static async create(input: __ERROR_properCaseCreateInput): Promise<__ERROR_properCase> {
    const validated = videoSchema.parse(input);
    const item = new __ERROR_properCase(validated);
    await item.save();
    return item.toJSON();
  }

  static async getById(id: string): Promise<__ERROR_properCase | null> {
    return await __ERROR_properCase.findById(id).lean();
  }

  static async update(
    id: string, 
    updates: __ERROR_properCaseUpdateInput
  ): Promise<__ERROR_properCase | null> {
    const validated = videoSchema.partial().parse(updates);
    return await __ERROR_properCase.findByIdAndUpdate(
      id, 
      { $set: validated, $inc: { __v: 1 } },
      { new: true }
    ).lean();
  }

  static async delete(id: string): Promise<boolean> {
    const result = await __ERROR_properCase.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  static async search(params: {
    query?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<__ERROR_properCase[]> {
    const { query, status, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query) {
      filter.$text = { $search: query };
    }
    if (status) {
      filter.status = status;
    }

    return await __ERROR_properCase
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }
}