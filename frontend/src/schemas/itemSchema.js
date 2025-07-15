import { z } from 'zod'

// Base item schema
export const itemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  category: z.string().default('General'),
  condition: z.enum(['New', 'Used', 'Refurbished', 'Other']).default('New'),
  images: z.array(z.string().url('Invalid image URL')).default([]),
  tags: z.array(z.string()).default([]),
  weight: z.number().min(0).default(0),
  dimensions: z.object({
    length: z.number().min(0).default(0),
    width: z.number().min(0).default(0),
    height: z.number().min(0).default(0),
  }).default({ length: 0, width: 0, height: 0 }),
  shipping: z.object({
    weight: z.number().min(0).default(0),
    method: z.string().default('Standard'),
    cost: z.number().min(0).default(0),
  }).default({ weight: 0, method: 'Standard', cost: 0 }),
  platforms: z.object({
    ebay: z.boolean().default(false),
    shopify: z.boolean().default(false),
  }).default({ ebay: false, shopify: false }),
})

// Form schema with string inputs that get transformed
export const itemFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().transform((val) => parseFloat(val) || 0),
  quantity: z.string().transform((val) => parseInt(val) || 1),
  category: z.string().default('General'),
  condition: z.enum(['New', 'Used', 'Refurbished', 'Other']).default('New'),
  images: z.string().transform((val) => val ? val.split(',').map(img => img.trim()).filter(Boolean) : []),
  tags: z.string().transform((val) => val ? val.split(',').map(tag => tag.trim()).filter(Boolean) : []),
  weight: z.string().transform((val) => parseFloat(val) || 0),
  length: z.string().transform((val) => parseFloat(val) || 0),
  width: z.string().transform((val) => parseFloat(val) || 0),
  height: z.string().transform((val) => parseFloat(val) || 0),
  shippingWeight: z.string().transform((val) => parseFloat(val) || 0),
  shippingMethod: z.string().default('Standard'),
  shippingCost: z.string().transform((val) => parseFloat(val) || 0),
  ebay: z.boolean().default(false),
  shopify: z.boolean().default(false),
})

// CSV upload schema
export const csvUploadSchema = z.object({
  csvFile: z.instanceof(File, { message: 'Please select a CSV file' })
    .refine((file) => file.type === 'text/csv' || file.name.endsWith('.csv'), {
      message: 'File must be a CSV'
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB'
    })
})

// Platform selection schema
export const platformSelectionSchema = z.object({
  platforms: z.array(z.enum(['ebay', 'shopify'])).min(1, 'Select at least one platform')
})

// Search and filter schema
export const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'pending', 'published', 'failed']).default('all'),
  platform: z.enum(['all', 'ebay', 'shopify']).default('all')
})

// Type exports (for TypeScript projects)
// export type Item = z.infer<typeof itemSchema>
// export type ItemFormData = z.infer<typeof itemFormSchema>
// export type CSVUploadData = z.infer<typeof csvUploadSchema>
// export type PlatformSelection = z.infer<typeof platformSelectionSchema>
// export type FilterData = z.infer<typeof filterSchema> 