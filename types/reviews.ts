export type Review = {
  comment: string;
  created_at: string;
  id: number;
  flagged: boolean;
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
  flagged: number;
  distribution: {
    [key: string]: number;
  };
};

export type NeedsAttention = {
  image_url: string;
  name: string;
  name_ar: string;
  name_en: string;
  product_id: number;
  rating_avg: string;
  rating_count: number;
  slug: string;
};
