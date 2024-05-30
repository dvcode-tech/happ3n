import CreateEventValidator from 'App/Validators/CreateEventValidator';
import UpdateEventValidator from 'App/Validators/UpdateEventValidator';
import { Event, EventRequiredApproval, EventStatus, EventType } from 'Database/entities/event';
import { Guest, GuestStatus } from 'Database/entities/guest';
import { User } from 'Database/entities/user';
import { ic } from 'azle';
import { Response, Request } from 'express';

export default class EventsController {
  static async create(request: Request, response: Response) {
    try {
      const { data, success, error } = CreateEventValidator.validate(request.body);

      if (!success) {
        response.status(400);
        const { path, message } = error.issues?.[0];

        return response.json({
          status: 0,
          message: `${path?.join('.')}: ${message}`,
        });
      }

      const findUser = await User.findOneBy({
        principal_id: ic.caller().toText(),
      });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const findEvent = await Event.findOneBy({ slug: data.slug });

      if (findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event slug already exists.',
        });
      }

      const eventData: Partial<Event> = {
        ...data,
        questions: data?.questions ? data.questions : '[{"question":"Name"},{"question":"Email"}]',
        user: findUser,
        status: EventStatus.SHOWN,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      await Event.save(eventData);

      return response.json({
        status: 1,
        message: 'Event created successfully!',
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async update(request: Request, response: Response) {
    try {
      const { eventId } = request.params;
      const { data, success, error } = UpdateEventValidator.validate(request.body);

      if (!success) {
        response.status(400);
        const { path, message } = error.issues?.[0];

        return response.json({
          status: 0,
          message: `${path?.join('.')}: ${message}`,
        });
      }

      const findUser = await User.findOneBy({
        principal_id: ic.caller().toText(),
      });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const {
        name,
        questions,
        start_at,
        end_at,
        location,
        required_approval,
        capacity,
        banner,
        type,
        parameter,
        description,
      } = data;

      const findEvent = await Event.findOneBy({
        id: eventId as unknown as number,
        user: findUser,
      });

      if (!findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found.',
        });
      }

      if (name) {
        findEvent.name = name;
      }

      if (start_at) {
        findEvent.start_at = start_at;
      }

      if (end_at) {
        findEvent.end_at = end_at;
      }

      if (location) {
        findEvent.location = location;
      }

      if (capacity) {
        findEvent.capacity = capacity;
      }

      if (banner) {
        findEvent.banner = banner;
      }

      if (parameter) {
        findEvent.parameter = parameter;
      }

      if (questions) {
        findEvent.questions = questions;
      }

      if (description) {
        findEvent.description = description;
      }

      if (required_approval || required_approval === EventRequiredApproval.NOT_REQUIRED) {
        findEvent.required_approval = required_approval;
      }

      if (type || type === EventType.PUBLIC) {
        findEvent.type = type;
      }

      findEvent.updated_at = Date.now();

      await findEvent.save();

      return response.json({
        status: 1,
        message: 'Event updated successfully!',
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async view_all_by_user(request: Request, response: Response) {
    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const findEvents = await Event.find({
        where: { user: findUser },
        relations: {
          user: true,
        },
      });

      return response.json({
        status: 1,
        data: findEvents,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async view_all_joined_by_user(request: Request, response: Response) {
    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const findGuestEvents = await Guest.find({
        where: { user: findUser },
        relations: {
          user: true,
          event: {
            user: true,
          },
        },
      });

      return response.json({
        status: 1,
        data: findGuestEvents,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async view_by_slug(request: Request, response: Response) {
    try {
      const { slug } = request.params;

      const findEvent = await Event.findOne({
        where: { slug, status: EventStatus.SHOWN },
        relations: {
          user: true,
        },
      });

      if (!findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found.',
        });
      }

      const findGuests = await Guest.findBy({ event: findEvent, status: GuestStatus.APPROVED });

      return response.json({
        status: 1,
        data: {
          ...findEvent,
          guests_count: findGuests.length,
          guests_list: findGuests.slice(0, 6),
        },
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async view_all_of_user_by_public(request: Request, response: Response) {
    try {
      const { username } = request.params;

      const findUser = await User.findOneBy({ username });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const findEvents = await Event.find({
        where: {
          user: findUser,
          status: EventStatus.SHOWN,
          type: EventType.PUBLIC,
        },
        relations: {
          user: true,
        },
      });

      return response.json({
        status: 1,
        data: findEvents,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }
}
