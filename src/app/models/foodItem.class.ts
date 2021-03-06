import { Cart } from './cart.model'

export interface FoodItemModelResponse {
  _id: string
  name: string
  details: string
  slug: string
  price: number
  isSpecial: boolean
  discount: number
  domain: Array<string>
  category: Array<string>
  rating: number
  photo: string
  restaurant: string
  user: string
}

export class FoodItemClassResponse {
  constructor(public dataArray: Array<Cart>) {

  }
}

export class FoodItemsClassResponse {
  success: boolean
  data: Array<Cart>
  pagination: any
  count: number
}

const foodCategories = [
  "Starters",
  "Indian",
  "Mexicon",
  "Chinese",
  "Desserts",
  "Quick Bites",
  "Beverages",
  "Thalis",
  "Breakfasts",
  "Mughlai",
  "Biryani",
  "North Indian",
  "South Indian",
  "Asian",
  "Sea Food",
  "Mithai",
  "other",
]