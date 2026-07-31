export type Review = {
  comment: string;
  created_at: string;
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
  };
  rating: number;
  user: {
    email: string;
    id: number;
    name: string;
  };
};
