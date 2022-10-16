import { BaseListTypeInfo, FieldTypeFunc } from '@keystone-6/core/types';

export interface Product {
  name: string;
  description: string;
  status: string;
  price: number;
  stock: number;
  photo: Image;
  createdById: string;
  updatedAt: string;
  createdAt: string;
}

export interface Image {
  id: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  encoding: string;
  _meta: {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: FieldTypeFunc<BaseListTypeInfo> | string;
    // created_at: FieldTypeFunc<BaseListTypeInfo>;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: false;
    url: string;
    secure_url: string;
    original_filename: string;
  };
}
