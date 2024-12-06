import { User } from 'src/users/entities/users.entity';

export const generateID = (prefix: string) => {
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return prefix + randomPart;
};

export const calculateNumber = (value: number): number => {
  return parseFloat((Math.round(value * 100) / 100).toFixed(2));
};

export const handleFormatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  let period = 'AM';
  let hour = parseInt(hours, 10);

  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  } else if (hour === 0) {
    hour = 12;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes} ${period}`;
};

export const getAllRequestOfUser = async (user: User): Promise<any> => {
  return user.support_tickets.map((supportTicket) => {
    const { id, request, createdAt, status, response } = supportTicket;

    return {
      id,
      request,
      date: (createdAt as Date).toISOString().split('T')[0],
      status,
      response,
    };
  });
};

export const customizedResponseUsers = async (
  users: User[],
): Promise<User[]> => {
  const response = [];

  for (const user of users) {
    console.log(user);
    const roles = user.roles.map((role) => role.name);

    const requests = await getAllRequestOfUser(user);

    response.push({
      ...user,
      ...roles,
      ...(requests.length !== 0 ? { requests } : {}),
    });
  }

  return response as User[];
};

export const generateRandomValue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
