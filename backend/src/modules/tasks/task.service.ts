import { Task } from "./task.model";
import { User } from "../users/user.model";


export class TaskService {

  static async createTask(data: any) {
    return Task.create(data);
  }

  static async getTasks(query: any) {

    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority
    } = query;

    const filters: any = {};

    if (search) {
      filters.$text = {
        $search: search
      };
    }

    if (status) {
      filters.status = status;
    }

    if (priority) {
      filters.priority = priority;
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const tasks =
      await Task.find(filters)
        .populate(
          "assignedUser",
          "name email role"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(Number(limit));

    const total =
      await Task.countDocuments(
        filters
      );

    return {
      tasks,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(
        total / Number(limit)
      )
    };
  }

  static async getTask(id: string) {

    return Task.findById(id)
      .populate(
        "assignedUser",
        "name email role"
      )
      .populate(
        "createdBy",
        "name email"
      );
  }

  static async updateTask(
    id: string,
    data: any
  ) {

    return Task.findByIdAndUpdate(
      id,
      data,
      {
        new: true
      }
    )
      .populate(
        "assignedUser",
        "name email role"
      )
      .populate(
        "createdBy",
        "name email"
      );
  }

  static async deleteTask(
    id: string
  ) {

    return Task.findByIdAndDelete(
      id
    );
  }

  static async assignTask(
    taskId: string,
    userId: string
  ) {

    const user =
      await User.findById(userId);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }
    return Task.findByIdAndUpdate(
      taskId,
      {
        assignedUser: userId
      },
      {
        new: true
      }
    )
      .populate(
        "assignedUser",
        "name email role"
      );
  }

  static async updateStatus(
    taskId: string,
    status: string
  ) {

    return Task.findByIdAndUpdate(
      taskId,
      {
        status
      },
      {
        new: true
      }
    );
  }
}