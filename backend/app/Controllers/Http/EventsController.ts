import { EventEntity, EventRequiredApproval, EventStatus, EventType } from 'Database/entities/event';
import { UserEntity } from 'Database/entities/user';
import { Database } from 'Database/index';
import { ic } from 'azle';
import { Response, Request } from 'express';

export default class EventsController {
  static async create(request: Request, response: Response) {
    try {
      const dataSource = await (request.app.locals.database as Database).getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const findUser = await userRepository.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const eventData: Partial<EventEntity> = {
        user: findUser,
        name: 'Developer Summit 2024: Innovate, Code, Create',
        start_at: new Date('2024-05-20').getTime(),
        end_at: new Date('2024-05-26').getTime(),
        location: JSON.stringify({ type: 'VIRTUAL', location: 'https://meet.google.com/sys-qrfs-ivm' }),
        required_approval: EventRequiredApproval.REQUIRED,
        capacity: 100,
        banner: 'https://img.pikbest.com/origin/06/13/64/688pIkbEsTCDu.jpg!w700wp',
        type: EventType.PUBLIC,
        status: EventStatus.SHOWN,
        parameter: JSON.stringify({}),
        description: `<h1>Developer Summit 2024: Innovate, Code, Create</h1>

          <p><strong>Date:</strong> July 15-17, 2024<br>
          <strong>Location:</strong> TechHub Conference Center, San Francisco, CA</p>
      
          <h2>Event Description:</h2>
          <p>Join us for the annual Developer Summit 2024, where innovation meets implementation! This three-day event is dedicated to software developers, engineers, and tech enthusiasts eager to stay at the forefront of technology and industry trends. Whether you’re a seasoned developer or just starting your journey, this summit offers something for everyone.</p>
      
          <h3>Key Features:</h3>
          <ul>
              <li><strong>Keynote Speakers:</strong> Hear from industry leaders, including CTOs of top tech companies, and influential figures in software development who will share insights on the latest trends and future directions.</li>
              <li><strong>Technical Workshops:</strong> Participate in hands-on workshops that cover a range of topics from AI and machine learning, cloud computing, cybersecurity, blockchain technology, to DevOps practices. Learn new skills and deepen your technical expertise.</li>
              <li><strong>Coding Challenges:</strong> Engage in friendly competition through hackathons and coding challenges designed to test your skills and creativity. Prizes include cash rewards, tech gadgets, and exclusive networking opportunities.</li>
              <li><strong>Panel Discussions:</strong> Join thought-provoking discussions on the challenges and opportunities in modern software development. Topics will include open-source contributions, ethical coding, and the impact of emerging technologies on society.</li>
              <li><strong>Networking Opportunities:</strong> Connect with fellow developers, engineers, and tech professionals from around the world. Exchange ideas, collaborate on projects, and build your professional network in a vibrant, interactive environment.</li>
              <li><strong>Expo and Demos:</strong> Explore the latest tools, platforms, and services from leading tech companies in our expo hall. Watch live demos and get hands-on experience with cutting-edge technologies.</li>
          </ul>
      
          <h3>Why Attend?</h3>
          <ul>
              <li><strong>Stay Updated:</strong> Keep abreast of the latest developments in technology and gain insights into future trends that will shape the industry.</li>
              <li><strong>Enhance Skills:</strong> Participate in workshops and training sessions to enhance your coding skills and technical knowledge.</li>
              <li><strong>Networking:</strong> Meet and connect with peers, mentors, and industry leaders to expand your professional network.</li>
              <li><strong>Innovate:</strong> Get inspired by new ideas, tools, and methodologies that you can bring back to your projects and teams.</li>
          </ul>
      
          <h3>Registration:</h3>
          <p>Early bird tickets are available until May 31, 2024. Register now to secure your spot and take advantage of discounted rates.</p>
      
          <p>For more information and to register, visit <a href="http://developersummit2024.com" target="_blank">developersummit2024.com</a>.</p>
      
          <a href="http://developersummit2024.com" target="_blank" class="button">Register Now</a>
      `,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      const createEvent = await dataSource.getRepository(EventEntity).save(eventData);

      return response.json({
        status: 1,
        message: 'Event created successfully!',
        data: createEvent,
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
      const dataSource = await (request.app.locals.database as Database).getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const findUser = await userRepository.findOneBy({ principal_id: ic.caller().toText() });

      if (!findUser) {
        response.status(400);
        return response.json({
          status: 0,
          message: 'User not found.',
        });
      }

      const findEvents = await dataSource.getRepository(EventEntity).find({
        where: { user: findUser },
        relations: ['user'],
        select: {
          user: {
            name: true,
            username: true,
          },
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
