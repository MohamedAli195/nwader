export interface IProdct {
  image: string | FileList;
  name: string;
  category_id: number;
  brand_id: number;
  unit_id: number;
  purchase_price: number;
  wholesale_price: number;
  retail_price: number;
  min_retail_price: number;
  country_of_manufacture: string | null;
  manufacturer_barcode: string;
  product_number: number;
  quantity: number;
  request_limit: number;
  // model_year: string | null;
  color: {
    id: number;
    name: string;
    hex_code: string;
  };
  size: {
    id: number;
    label: string;
  };
}

export interface errorType {
  data: {
    errors: {
      name: string[];
      label?: string[];
      message: string;
    };
  };
  status: number;
}

export interface SizeColorEntry {
  size_id?: number;
  color_id?: number;
  quantity?: number;
}

export interface ProductFormMerged {
  // From ProductFormValues
  id?: number;
  name?: string;
  category_id?: number;
  unit_id?: number;
  size_id?: number;
  brand_id?: number;
  store_id?: number;
  purchase_price?: number;
  wholesale_price?: number;
  retail_price?: number;
  min_retail_price?: number;
  manufacturer_barcode?: string;
  country_of_manufacture?: string;
  product_number?: number;
  request_limit?: number;
  image?: string | FileList;
  // model_year?: string;
  variants?: SizeColorEntry[];
  color_id?: number;
  category?: { name?: string; id?: number };
  brand?: { name?: string; id?: number };
  unit?: { name?: string; id?: number };
  store?: { name?: string; id?: number };
  color?: { name?: string; hex_code?: string; id?: number };
  size?: { label?: string; id?: number };
  quantity?: number;
  Newpurchase_price?: number;
  Newquantity?: number;
  totalPriceforOneProd?: number;
  totalRetailPrice?: number;
  product_id?: number;
  from_store_id?: number | null | undefined;

  to_store_id?: number | null | undefined;
  transfer_cost?: string;
  notes?: string;
  qty?: number;
  model_year_id?: number;
  disc_product?: number;
}
