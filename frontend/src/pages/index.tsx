import Header from '@components/header';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useAuth, useRestActor } from '@bundly/ares-react';

export default function IcConnectPage(): JSX.Element {
  const backend = useRestActor('backend');
  const { isAuthenticated, identity } = useAuth();
  const [apiStatus, setApiStatus] = useState<string>('pending');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [events, setEvents] = useState<any>(null);

  useEffect(() => {
    healthCheck();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [isAuthenticated]);

  async function healthCheck() {
    try {
      await backend.get('/health');
      setApiStatus('Ok');
    } catch (error) {
      console.error({ error });
      setApiStatus('Error');
    }
  }

  async function getUserInfo() {
    try {
      const userInfo = await backend.get('/user/me');
      setUserInfo(JSON.stringify(userInfo, null, 2));
      console.log('userInfo', userInfo);
    } catch (error) {
      console.error({ error });
    }
  }

  return (
    <>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl text-center">Build Fullstack dApps with Azle and Ares</h1>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">User Info</h2>
              <p className="mt-4 text-sm text-gray-500">
                <strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </p>
              <p className="text-gray-700">
                <strong>Principal ID:</strong> {identity.getPrincipal().toString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">REST API Info</h2>
              <p className="mt-4 text-sm text-gray-500">
                <strong>Status:</strong> {apiStatus}
              </p>
              <h2 className="text-xl font-bold mb-2">User Info</h2>
              <p className="mt-4 text-sm text-gray-500">
                <strong>UserInfo:</strong> {userInfo}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-center">Send multiple data types x</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">JSON Data</h2>
              <ContactForm />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={async () => {
                  try {
                    const response = await backend.post<CreateContactsResponse>(
                      '/event/create',
                      {
                        name: 'Developer Summit 2024: Innovate, Code, Create',
                        start_at: new Date('2024-05-20').getTime(),
                        end_at: new Date('2024-05-26').getTime(),
                        location: JSON.stringify({ type: 'VIRTUAL', location: 'https://meet.google.com/sys-qrfs-ivm' }),
                        required_approval: 1,
                        capacity: 100,
                        banner: 'https://img.pikbest.com/origin/06/13/64/688pIkbEsTCDu.jpg!w700wp',
                        type: 0,
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
                      },
                      {
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      },
                    );

                    console.log(response.data);
                  } catch (error) {
                    console.error({ error });
                  }
                }}
              >
                Create
              </button>
              <button
                onClick={async () => {
                  try {
                    const data = (await backend.get('/event/view_all_by_user')).data;
                    console.log(data);
                    setEvents(JSON.stringify(data));
                  } catch (error) {
                    console.error({ error });
                    setEvents('Error');
                  }
                }}
              >
                get All events
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await backend.post<CreateContactsResponse>(
                      '/user/update',
                      {
                        name: 'Ariz Dagunan Edited',
                        bio: 'DvCode Technologies developer',
                        tiktok: 'www.tiktok.com/xendev',
                        facebook: 'www.facebook.com/xendevph',
                      },
                      {
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      },
                    );

                    console.log(response.data);
                  } catch (error) {
                    console.error({ error });
                  }
                }}
              >
                Update User info
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

type CreateContactsResponse = {
  name: string;
  email: string;
  username: string;
};

function ContactForm(): JSX.Element {
  const backend = useRestActor('backend');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Username:', username);

    try {
      const response = await backend.post<CreateContactsResponse>(
        '/user/register',
        {
          name,
          email,
          username,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response.data);
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name:
        </label>
        <input
          id="name"
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email:
        </label>
        <input
          id="email"
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
          Username:
        </label>
        <input
          id="username"
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
}
