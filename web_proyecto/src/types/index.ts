export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  faculty: string;
  image: string;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: 'maqueta' | 'simulacion' | 'colaboracion';
}