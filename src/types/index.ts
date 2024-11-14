export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Car {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  tags: {
    carType: string;
    company: string;
    dealer: string;
  };
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  logout: () => void;
}