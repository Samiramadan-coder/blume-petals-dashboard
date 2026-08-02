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

export type Summary = {
  total_reviews: number;
  average_rating: string;
  this_month: number;
  distribution: {
    [key: string]: number;
  };
};
