import { Event, EventRequiredApproval } from 'Database/entities/event';
import { EntryStatus, GoingStatus, Guest, GuestStatus } from 'Database/entities/guest';
import { User } from 'Database/entities/user';
import { ic } from 'azle';
import { Response, Request } from 'express';

export default class GuestsController {
  static async register(request: Request, response: Response) {
    const { answers } = request.body;
    const { eventId } = request.params;

    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found!',
        });
      }

      const findEvent = await Event.findOneBy({
        id: eventId as unknown as number,
      });

      if (!findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found!',
        });
      }

      const checkUserEventExists = await Guest.findOneBy({
        user: findUser,
        event: findEvent,
      });

      if (checkUserEventExists) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Already registered!',
        });
      }

      await Guest.save({
        user: findUser,
        event: findEvent,
        answers,
        status:
          findEvent.required_approval === EventRequiredApproval.REQUIRED ? GuestStatus.PENDING : GuestStatus.APPROVED,
        going_status: GoingStatus.GOING,
        entry_status: EntryStatus.PENDING,
        created_at: Date.now(),
        updated_at: Date.now(),
      });

      return response.json({
        status: 1,
        message: 'Registration success!',
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async register_status(request: Request, response: Response) {
    const { eventId } = request.params;

    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found!',
        });
      }

      const findEvent = await Event.findOneBy({
        id: eventId as unknown as number,
      });

      if (!findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found!',
        });
      }

      const checkUserEventExists = await Guest.findOneBy({
        user: findUser,
        event: findEvent,
      });

      return response.json({
        status: 1,
        data: checkUserEventExists,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async guests_list(request: Request, response: Response) {
    const { eventId } = request.params;

    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found!',
        });
      }

      const findEvent = await Event.findOneBy({
        id: eventId as unknown as number,
        user: findUser,
      });

      if (!findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found!',
        });
      }

      const findGuestList = await Guest.find({
        where: {
          event: findEvent,
        },
        relations: {
          user: true,
        },
      });

      return response.json({
        status: 1,
        data: findGuestList,
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async guests_manage(request: Request, response: Response) {
    const { eventId, guestId } = request.params;
    const { status } = request.body;

    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found!',
        });
      }

      const findEvent = await Event.findOneBy({
        id: eventId as unknown as number,
        user: findUser,
      });

      if (!findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found!',
        });
      }

      const findGuest = await Guest.findOneBy({
        id: guestId as unknown as number,
        event: findEvent,
      });

      if (!findGuest) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Guests not found!',
        });
      }

      findGuest.status = status;
      findGuest.updated_at = Date.now();

      await findGuest.save();

      return response.json({
        status: 1,
        message: 'Guest status updated successfully!',
      });
    } catch (error: any) {
      response.status(400);
      return response.json({
        status: 0,
        message: error.message,
      });
    }
  }

  static async guests_checkedin(request: Request, response: Response) {
    const { eventId, guestId } = request.params;

    try {
      const findUser = await User.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found!',
        });
      }

      const findEvent = await Event.findOneBy({
        id: eventId as unknown as number,
        user: findUser,
      });

      if (!findEvent) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Event not found!',
        });
      }

      const findGuest = await Guest.findOneBy({
        id: guestId as unknown as number,
        event: findEvent,
      });

      if (!findGuest) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'Guests not found!',
        });
      }

      findGuest.entry_status = EntryStatus.CHECKEDIN;
      findGuest.entry_at = Date.now();
      findGuest.updated_at = Date.now();

      await findGuest.save();

      return response.json({
        status: 1,
        message: 'Guest checkedin successfully!',
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
