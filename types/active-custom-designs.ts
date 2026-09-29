export type SavedDesign = {
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  bouquet: {
    image_url: string;
    product_id: number;
    variant_id: number;
    sku: string;
    name: string;
    size: string;
  };
  flowers: {
    variant_id: number;
    name: string;
    color: string | null;
    qty: number;
  }[];
  id: number;
  saved_at: string;
  image_url: string;
  total_stems: number;
  price: string;
  available: boolean;
};

export type Design = SavedDesign & {
  cart: {
    qty: number;
    gift: {
      ribbon: {
        id: number;
        kind: string;
        name: string;
        description: string | null;
        color_hex: string | null;
        image_url: string | null;
        price: string;
      };
      card_style: {
        id: number;
        kind: string;
        name: string;
        description: string | null;
        color_hex: string | null;
        image_url: string;
        price: string;
      };
      extra: string;
    };
    message_text: string;
  };
};
